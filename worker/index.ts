import { createClient } from "@supabase/supabase-js";
import CryptoJS from "crypto-js";
import * as dotenv from "dotenv";
import path from "path";
import axios, { AxiosInstance } from "axios";
import * as crypto from "crypto";
import { Database } from "../src/lib/types";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// -------------------- ENV VALIDATION (NO FALLBACKS) --------------------
function mustEnv(name: string): string {
    const v = process.env[name];
    if (!v || !v.trim()) {
        console.error(`❌ Missing env: ${name}`);
        process.exit(1);
    }
    return v.trim();
}

const supabaseUrl = mustEnv("NEXT_PUBLIC_SUPABASE_URL");
const supabaseServiceKey = mustEnv("SUPABASE_SERVICE_ROLE_KEY");
const encryptionKey = mustEnv("ENCRYPTION_KEY");

const BINANCE_BASE_URL = (process.env.BINANCE_FUTURES_BASE_URL || "https://fapi.binance.com").trim();
const USE_TESTNET = (process.env.USE_TESTNET || "false").trim() === "true";
const MOCK_BINANCE_DATA = (process.env.MOCK_BINANCE_DATA || "false").trim() === "true";

const INTERVAL_MS = 2_000;

// -------------------- CLIENTS --------------------
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

const binancePublic: AxiosInstance = axios.create({
    baseURL: BINANCE_BASE_URL,
    timeout: 10_000,
});

function binanceSigned(apiKey: string): AxiosInstance {
    return axios.create({
        baseURL: BINANCE_BASE_URL,
        timeout: 10_000,
        headers: { "X-MBX-APIKEY": apiKey },
    });
}

// -------------------- LOGGING HELPERS --------------------
function logHeader() {
    console.log(
        `Worker Config: [BaseURL: ${BINANCE_BASE_URL}] [Testnet: ${USE_TESTNET}] [MockMode: ${MOCK_BINANCE_DATA}]`
    );
}

// -------------------- UTILS --------------------
function decodeJWT(token: string): any {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        return JSON.parse(Buffer.from(parts[1], 'base64').toString());
    } catch {
        return null;
    }
}

function logError(prefix: string, err: any) {
    console.error(`❌ ${prefix}`);

    if (err?.response) {
        // Axios Error
        console.error(`Binance/API Status: ${err.response.status}`);
        console.error(`Data: ${JSON.stringify(err.response.data, null, 2)}`);
    } else if (err?.code && err?.message && (err?.details !== undefined || err?.hint !== undefined)) {
        // Supabase/PostgREST Error
        console.error(`Supabase Error [${err.code}]: ${err.message}`);
        console.error(`Details: ${err.details}`);
        console.error(`Hint: ${err.hint}`);
    } else if (err instanceof Error) {
        // Generic Error
        console.error(`Message: ${err.message}`);
        console.error(`Properties: ${JSON.stringify(Object.getOwnPropertyNames(err).reduce((acc: any, key) => {
            acc[key] = (err as any)[key];
            return acc;
        }, {}), null, 2)}`);
    } else {
        console.error(`Raw Error: ${JSON.stringify(err, null, 2)}`);
    }
}

function isPrintable(str: string) {
    return /^[\x20-\x7E]+$/.test(str); // printable ASCII
}

// -------------------- CRYPTO / DECRYPT --------------------
function decryptAES(cipherText: string, key: string): string {
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, key);
        const plain = bytes.toString(CryptoJS.enc.Utf8).trim();
        return plain;
    } catch {
        return "";
    }
}

function validateSecrets(sessionName: string, apiKey: string, apiSecret: string) {
    if (!apiKey || apiKey.length < 10) {
        throw new Error(`[${sessionName}] Decrypted apiKey invalid/empty`);
    }
    if (!apiSecret || apiSecret.length < 20) {
        throw new Error(`[${sessionName}] Decrypted apiSecret too short (${apiSecret?.length || 0})`);
    }
    if (!isPrintable(apiSecret)) {
        throw new Error(`[${sessionName}] Decrypted apiSecret contains non-printable chars (decrypt mismatch)`);
    }
}

// -------------------- BINANCE SIGNING --------------------
function buildQuery(params: Record<string, string | number | boolean>): string {
    const entries = Object.entries(params).sort(([a], [b]) => a.localeCompare(b));
    return entries
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join("&");
}

function signQuery(query: string, apiSecret: string): string {
    return crypto.createHmac("sha256", apiSecret).update(query).digest("hex");
}

async function getServerTime(): Promise<number> {
    try {
        const res = await binancePublic.get("/fapi/v1/time");
        const t = res.data?.serverTime;
        return typeof t === "number" ? t : Date.now();
    } catch {
        // fallback to local time if time endpoint fails
        return Date.now();
    }
}

/**
 * Signed GET helper:
 * - builds query with timestamp/recvWindow
 * - signs SAME query string that is sent
 */
async function signedGet<T = any>(
    client: AxiosInstance,
    path: string,
    apiSecret: string,
    baseParams: Record<string, string | number | boolean>,
    timestamp: number
): Promise<T> {
    const params = {
        ...baseParams,
        timestamp,
        recvWindow: 5000,
    };

    const query = buildQuery(params);
    const signature = signQuery(query, apiSecret);
    const url = `${path}?${query}&signature=${signature}`;

    const res = await client.get(url);
    return res.data as T;
}

// -------------------- BINANCE SNAPSHOT --------------------
async function fetchBinanceSnapshot(apiKey: string, apiSecret: string, sessionName: string) {
    try {
        const client = binanceSigned(apiKey);

        // Using ONE timestamp for all signed requests to reduce drift edge cases
        const timestamp = await getServerTime();

        // 1) Signed connectivity test (account)
        await signedGet(client, "/fapi/v2/account", apiSecret, {}, timestamp);

        // 2) Full data
        const account = await signedGet<any>(client, "/fapi/v2/account", apiSecret, {}, timestamp);
        const positions = await signedGet<any[]>(
            client,
            "/fapi/v2/positionRisk",
            apiSecret,
            {},
            timestamp
        );

        // Filter useful info
        const activeAssets = Array.isArray(account?.assets)
            ? account.assets.filter((a: any) => parseFloat(a.walletBalance || "0") !== 0)
            : [];

        const openPositions = Array.isArray(positions)
            ? positions.filter((p: any) => parseFloat(p.positionAmt || "0") !== 0)
            : [];

        return {
            ts: new Date().toISOString(),
            assets: activeAssets,
            positions: openPositions,
            totalWalletBalance: account.totalWalletBalance,
            totalUnrealizedProfit: account.totalUnrealizedProfit,
            totalMarginBalance: account.totalMarginBalance,
        };
    } catch (err: any) {
        logError(`[${sessionName}] Binance Fetch Failed`, err);
        throw err;
    }
}

// -------------------- STARTUP CHECK --------------------
async function checkConnectivity() {
    console.log("Checking public connectivity to Binance...");
    try {
        const res = await binancePublic.get("/fapi/v1/exchangeInfo");
        console.log(`✅ Connectivity OK: [ExchangeInfo Status: ${res.status}] [Symbols: ${res.data?.symbols?.length ?? 0}]`);
    } catch (err: any) {
        logError("Connectivity Failed (check BINANCE_FUTURES_BASE_URL)", err);
        process.exit(1);
    }
}

// -------------------- MAIN LOOP --------------------
let cycleRunning = false;

async function performTradingCycle() {
    if (cycleRunning) return;
    cycleRunning = true;

    console.log(`[${new Date().toISOString()}] Polling for active sessions...`);

    try {
        const { data: activeSessions, error } = await supabase
            .from("api_credentials")
            .select("*")
            .eq("status", "Active");

        if (error) throw error;

        if (!activeSessions?.length) {
            console.log("No active sessions found.");
            return;
        }

        const sessions = (activeSessions || []) as Database['public']['Tables']['api_credentials']['Row'][];
        for (const session of sessions) {
            const name = session.name || session.id || "session";

            try {
                // only Binance sessions (case-insensitive)
                const ex = String(session?.exchange || "").toLowerCase();
                if (ex && !ex.includes("binance")) {
                    console.log(`[${name}] Skipping non-binance exchange: ${session.exchange}`);
                    continue;
                }

                // decrypt
                const apiKey = decryptAES(session.encrypted_api_key, encryptionKey).trim();
                const apiSecret = decryptAES(session.encrypted_api_secret, encryptionKey).trim();

                validateSecrets(name, apiKey, apiSecret);

                console.log(`[${name}] Decrypted Key Prefix: ${apiKey.substring(0, 8)}...`);

                // mock mode
                let snapshotData: any;

                if (MOCK_BINANCE_DATA) {
                    console.log(`[${name}] Mocking Binance data...`);
                    snapshotData = {
                        ts: new Date().toISOString(),
                        assets: [{ asset: "USDT", walletBalance: "1000.00", unrealizedProfit: "50.00" }],
                        positions: [{ symbol: "BTCUSDT", positionAmt: "0.1", entryPrice: "50000", unrealizedProfit: "50.00" }],
                        totalWalletBalance: "1000.00",
                        totalUnrealizedProfit: "50.00",
                    };
                } else {
                    console.log(`[${name}] Fetching Binance snapshot...`);
                    snapshotData = await fetchBinanceSnapshot(apiKey, apiSecret, name);
                    console.log(`[${name}] Snapshot OK. Balance: ${snapshotData.totalWalletBalance}`);
                }

                // insert snapshot
                const { data: inserted, error: insertError } = await supabase
                    .from("account_snapshots")
                    .insert({
                        user_id: session.user_id,
                        session_id: session.id,
                        exchange: session.exchange,
                        snapshot: snapshotData,
                    } as any)
                    .select("id")
                    .single();

                if (insertError) {
                    throw insertError;
                }

                console.log(`✅ [${name}] Snapshot stored (ID: ${(inserted as any)?.id}). Balance: ${snapshotData.totalWalletBalance}`);

                // Update session sync info
                await (supabase
                    .from("api_credentials") as any)
                    .update({
                        last_sync_at: new Date().toISOString(),
                        last_error: null
                    })
                    .eq("id", session.id);

            } catch (err: any) {
                logError(`[${name}] Cycle entry failed`, err);

                // Report error to DB
                await (supabase
                    .from("api_credentials") as any)
                    .update({
                        last_error: err?.message || String(err)
                    })
                    .eq("id", session.id);
            }
        }
    } catch (err: any) {
        console.error("Worker cycle error:", err?.message || err);
    } finally {
        cycleRunning = false;
    }
}

// -------------------- BOOT --------------------
async function boot() {
    console.log("-----------------------------------------");
    console.log("XChangeRate Trading Worker Booting...");

    // Role Check
    const payload = decodeJWT(supabaseServiceKey);
    const role = payload?.role || "unknown";
    console.log(`Supabase Role Check: [Role: ${role}]`);

    if (role !== "service_role") {
        console.error("❌ CRITICAL: SUPABASE_SERVICE_ROLE_KEY is not a service_role key!");
        process.exit(1);
    }

    console.log(`Base URL: ${BINANCE_BASE_URL}`);
    console.log(`Mock Mode: ${MOCK_BINANCE_DATA}`);
    console.log("-----------------------------------------");

    // Initial run
    logHeader();
    await checkConnectivity();
    await performTradingCycle();
    setInterval(performTradingCycle, INTERVAL_MS);
}

boot().catch((e) => {
    console.error("Worker boot failed:", e?.message || e);
    process.exit(1);
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing worker');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing worker');
    process.exit(0);
});