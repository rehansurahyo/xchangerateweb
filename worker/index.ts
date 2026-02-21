/**
 * XChangeRate Futures Worker (Binance)
 * - Polls active api_credentials sessions from Supabase
 * - Decrypts API key/secret (CryptoJS AES)
 * - Fetches Binance Futures snapshot (account + positionRisk)
 * - Inserts into account_snapshots
 *
 * IMPORTANT:
 * - This worker ONLY updates columns that exist in your api_credentials schema.
 *   (Your schema does NOT include last_sync_at / last_error by default.)
 * - If you want those, add them via SQL:
 *   alter table public.api_credentials add column if not exists last_sync_at timestamptz;
 *   alter table public.api_credentials add column if not exists last_error text;
 */

import { createClient } from "@supabase/supabase-js";
import CryptoJS from "crypto-js";
import * as dotenv from "dotenv";
import path from "path";
import axios, { AxiosError, AxiosInstance } from "axios";
import * as crypto from "crypto";
import { Database } from "../src/lib/types";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// -------------------- ENV --------------------
function mustEnv(name: string): string {
    const v = process.env[name];
    if (!v || !v.trim()) {
        console.error(`❌ Missing env: ${name}`);
        process.exit(1);
    }
    return v.trim();
}

const SUPABASE_URL = mustEnv("NEXT_PUBLIC_SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = mustEnv("SUPABASE_SERVICE_ROLE_KEY");
const ENCRYPTION_KEY = mustEnv("ENCRYPTION_KEY");

// Binance
const BINANCE_BASE_URL = (process.env.BINANCE_FUTURES_BASE_URL || "https://fapi.binance.com").trim();
const USE_TESTNET = (process.env.USE_TESTNET || "false").trim() === "true";
const MOCK_BINANCE_DATA = (process.env.MOCK_BINANCE_DATA || "false").trim() === "true";

// Polling interval (2s requested)
const INTERVAL_MS = Number(process.env.WORKER_INTERVAL_MS || 2000);

// Reduce payload risk
const MAX_ASSETS = Number(process.env.MAX_ASSETS || 50);
const MAX_POSITIONS = Number(process.env.MAX_POSITIONS || 50);

// -------------------- CLIENTS --------------------
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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

// -------------------- LOGGING --------------------
function logHeader() {
    console.log("-----------------------------------------");
    console.log("XChangeRate Trading Worker Booting...");
    console.log(`Worker Config: [BaseURL: ${BINANCE_BASE_URL}] [Testnet: ${USE_TESTNET}] [MockMode: ${MOCK_BINANCE_DATA}]`);
    console.log(`Interval: ${INTERVAL_MS}ms | MAX_ASSETS=${MAX_ASSETS} | MAX_POSITIONS=${MAX_POSITIONS}`);
    console.log("-----------------------------------------");
}

function decodeJWT(token: string): any {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        return JSON.parse(Buffer.from(parts[1], "base64").toString());
    } catch {
        return null;
    }
}

function serializeAny(err: any) {
    try {
        return JSON.stringify(err, Object.getOwnPropertyNames(err), 2);
    } catch {
        return String(err);
    }
}

function logError(prefix: string, err: any) {
    console.error(`❌ ${prefix}`);

    // Axios
    if (err && (err as AxiosError).isAxiosError) {
        const ax = err as AxiosError<any>;
        if (ax.response) {
            console.error(`HTTP Status: ${ax.response.status}`);
            console.error(`Data: ${JSON.stringify(ax.response.data, null, 2)}`);
        } else {
            console.error(`Axios Message: ${ax.message}`);
        }
        console.error(`Axios Full: ${serializeAny(ax)}`);
        return;
    }

    // Supabase/PostgREST
    if (err?.code && err?.message) {
        console.error(`Supabase Error [${err.code}]: ${err.message}`);
        if (err.details !== undefined) console.error(`Details: ${err.details}`);
        if (err.hint !== undefined) console.error(`Hint: ${err.hint}`);
        console.error(`Supabase Full: ${serializeAny(err)}`);
        return;
    }

    // Generic
    if (err instanceof Error) {
        console.error(`Message: ${err.message}`);
        console.error(`Stack: ${err.stack}`);
        console.error(`Error Full: ${serializeAny(err)}`);
        return;
    }

    console.error(`Raw Error: ${serializeAny(err)}`);
}

function isPrintable(str: string) {
    return /^[\x20-\x7E]+$/.test(str);
}

// -------------------- CRYPTO --------------------
function decryptAES(cipherText: string, key: string): string {
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, key);
        return bytes.toString(CryptoJS.enc.Utf8).trim();
    } catch {
        return "";
    }
}

function validateSecrets(sessionName: string, apiKey: string, apiSecret: string) {
    if (!apiKey || apiKey.length < 10) throw new Error(`[${sessionName}] Decrypted apiKey invalid/empty`);
    if (!apiSecret || apiSecret.length < 20) throw new Error(`[${sessionName}] Decrypted apiSecret too short (${apiSecret?.length || 0})`);
    if (!isPrintable(apiSecret)) throw new Error(`[${sessionName}] Decrypted apiSecret has non-printable chars (decrypt mismatch)`);
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
        return Date.now();
    }
}

async function signedGet<T>(
    client: AxiosInstance,
    endpointPath: string,
    apiSecret: string,
    baseParams: Record<string, string | number | boolean>,
    timestamp: number
): Promise<T> {
    const params = { ...baseParams, timestamp, recvWindow: 5000 };
    const query = buildQuery(params);
    const signature = signQuery(query, apiSecret);
    const url = `${endpointPath}?${query}&signature=${signature}`;
    const res = await client.get(url);
    return res.data as T;
}

// -------------------- SNAPSHOT --------------------
type Snapshot = {
    ts: string;
    assets: any[];
    positions: any[];
    totalWalletBalance?: string | number;
    totalUnrealizedProfit?: string | number;
    totalMarginBalance?: string | number;
};

async function fetchBinanceSnapshot(apiKey: string, apiSecret: string, sessionName: string): Promise<Snapshot> {
    const client = binanceSigned(apiKey);
    const timestamp = await getServerTime();

    try {
        // quick signed test
        await signedGet(client, "/fapi/v2/account", apiSecret, {}, timestamp);

        const account = await signedGet<any>(client, "/fapi/v2/account", apiSecret, {}, timestamp);
        const positions = await signedGet<any[]>(client, "/fapi/v2/positionRisk", apiSecret, {}, timestamp);

        const activeAssets = Array.isArray(account?.assets)
            ? account.assets.filter((a: any) => parseFloat(a?.walletBalance || "0") !== 0).slice(0, MAX_ASSETS)
            : [];

        const openPositions = Array.isArray(positions)
            ? positions.filter((p: any) => parseFloat(p?.positionAmt || "0") !== 0).slice(0, MAX_POSITIONS)
            : [];

        return {
            ts: new Date().toISOString(),
            assets: activeAssets,
            positions: openPositions,
            totalWalletBalance: account?.totalWalletBalance,
            totalUnrealizedProfit: account?.totalUnrealizedProfit,
            totalMarginBalance: account?.totalMarginBalance,
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

// -------------------- DB HELPERS --------------------
async function insertSnapshot(session: Database["public"]["Tables"]["api_credentials"]["Row"], snapshot: Snapshot, sessionName: string) {
    const payload = {
        user_id: session.user_id,
        session_id: session.id,
        exchange: session.exchange || "Binance",
        snapshot: snapshot as any,
    } as any;

    const { data, error } = await supabase
        .from("account_snapshots")
        .insert(payload)
        .select("id")
        .single();

    if (error) {
        logError(`[${sessionName}] Supabase insert(account_snapshots) failed`, error);
        throw error;
    }

    return data as any;
}

/**
 * Optional: update api_credentials tracking fields ONLY if columns exist.
 * (Safe mode: do nothing unless you enable it)
 */
const ENABLE_SESSION_TRACKING = (process.env.ENABLE_SESSION_TRACKING || "false").trim() === "true";

async function updateSessionTracking(sessionId: string, updates: Record<string, any>, sessionName: string) {
    if (!ENABLE_SESSION_TRACKING) return;

    const { error } = await (supabase.from("api_credentials") as any).update(updates).eq("id", sessionId);
    if (error) logError(`[${sessionName}] Supabase update(api_credentials) failed`, error);
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

        const sessions = activeSessions as Database["public"]["Tables"]["api_credentials"]["Row"][];

        for (const session of sessions) {
            const name = session.name || session.id || "session";

            try {
                const ex = String(session.exchange || "").toLowerCase();
                if (ex && !ex.includes("binance")) {
                    console.log(`[${name}] Skipping non-binance exchange: ${session.exchange}`);
                    continue;
                }

                const apiKey = decryptAES(session.encrypted_api_key, ENCRYPTION_KEY).trim();
                const apiSecret = decryptAES(session.encrypted_api_secret, ENCRYPTION_KEY).trim();
                validateSecrets(name, apiKey, apiSecret);

                console.log(`[${name}] Decrypted Key Prefix: ${apiKey.substring(0, 8)}...`);

                let snapshotData: Snapshot;

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

                console.log(`[${name}] Inserting snapshot into Supabase...`);
                const inserted = await insertSnapshot(session, snapshotData, name);

                console.log(`✅ [${name}] Snapshot stored (ID: ${inserted?.id}). Balance: ${snapshotData.totalWalletBalance}`);

                // Optional tracking if you add columns later
                await updateSessionTracking(
                    session.id,
                    { last_sync_at: new Date().toISOString(), last_error: null },
                    name
                );
            } catch (err: any) {
                logError(`[${name}] Cycle entry failed`, err);

                await updateSessionTracking(
                    session.id,
                    { last_error: err?.message || String(err) },
                    name
                );
            }
        }
    } catch (err: any) {
        logError("Worker cycle error", err);
    } finally {
        cycleRunning = false;
    }
}

// -------------------- BOOT --------------------
async function boot() {
    logHeader();

    const payload = decodeJWT(SUPABASE_SERVICE_ROLE_KEY);
    const role = payload?.role || "unknown";
    console.log(`Supabase Role Check: [Role: ${role}]`);

    if (role !== "service_role") {
        console.error("❌ CRITICAL: SUPABASE_SERVICE_ROLE_KEY is not a service_role key!");
        process.exit(1);
    }

    await checkConnectivity();
    await performTradingCycle();
    setInterval(performTradingCycle, INTERVAL_MS);
}

boot().catch((e) => {
    logError("Worker boot failed", e);
    process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received: closing worker");
    process.exit(0);
});
process.on("SIGINT", () => {
    console.log("SIGINT received: closing worker");
    process.exit(0);
});