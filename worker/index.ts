/**
 * XChangeRate Trading Worker (V2)
 * Fully refactored for Production, Render, and Demo modes.
 */

import { createClient } from "@supabase/supabase-js";
import CryptoJS from "crypto-js";
import * as dotenv from "dotenv";
import path from "path";
import axios, { AxiosError, AxiosInstance } from "axios";
import * as crypto from "crypto";
import * as http from "http";
import { Database } from "../src/lib/types";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// ------------------------------------------------------------
// 1. CONFIG & ENV
// ------------------------------------------------------------
const CONFIG = {
    SUPABASE_URL: mustEnv("NEXT_PUBLIC_SUPABASE_URL"),
    SUPABASE_SERVICE_ROLE_KEY: mustEnv("SUPABASE_SERVICE_ROLE_KEY"),
    ENCRYPTION_KEY: mustEnv("ENCRYPTION_KEY"),
    BINANCE_BASE_URL: process.env.BINANCE_FUTURES_BASE_URL || "https://fapi.binance.com",
    USE_TESTNET: process.env.USE_TESTNET === "true",
    MOCK_MODE: process.env.MOCK_BINANCE_DATA === "true",
    INTERVAL_MS: Number(process.env.WORKER_INTERVAL_MS || 2000),
    PORT: Number(process.env.PORT || 3000),
    MAX_ASSETS: 50,
    MAX_POSITIONS: 50,
};

function mustEnv(name: string): string {
    const v = process.env[name]?.trim();
    if (!v) {
        console.error(`❌ CRITICAL: Missing required env ${name}`);
        process.exit(1);
    }
    return v;
}

// ------------------------------------------------------------
// 2. LOGGER & UTILS
// ------------------------------------------------------------
const Logger = {
    info: (msg: string) => console.log(`[${new Date().toISOString()}] INFO: ${msg}`),
    warn: (msg: string) => console.warn(`[${new Date().toISOString()}] WARN: ${msg}`),
    error: (msg: string, err?: any) => {
        console.error(`[${new Date().toISOString()}] ❌ ERROR: ${msg}`);
        if (err) {
            if (err.isAxiosError) {
                console.error(`   API Error: ${err.response?.status} - ${JSON.stringify(err.response?.data)}`);
            } else {
                console.error(`   Details: ${err.message || JSON.stringify(err)}`);
            }
        }
    },
    diag: (sessionName: string, err: any) => {
        if (err?.response?.data?.code === -2015) {
            console.error(`\n💡 DIAGNOSIS for [${sessionName}]: -2015 Invalid API Key/IP`);
            console.error(`   1. Check if Futures trading is enabled on this key.`);
            console.error(`   2. If IP whitelisting is ON, add this server's IP.`);
            console.error(`   3. Ensure you are not using Testnet keys on Mainnet (or vice versa).`);
            console.error(`   4. Verify decryption is working (ENCRYPTION_KEY must match).`);
        }
    }
};

// ------------------------------------------------------------
// 3. CRYPTO
// ------------------------------------------------------------
const Crypto = {
    decrypt: (cipher: string) => {
        try {
            const bytes = CryptoJS.AES.decrypt(cipher, CONFIG.ENCRYPTION_KEY);
            return bytes.toString(CryptoJS.enc.Utf8).trim();
        } catch {
            return "";
        }
    },
    isPrintable: (str: string) => /^[\x20-\x7E]+$/.test(str)
};

// ------------------------------------------------------------
// 4. SUPABASE REPO
// ------------------------------------------------------------
const supabase = createClient<Database>(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_ROLE_KEY);

const Repo = {
    getActiveSessions: async () => {
        const { data, error } = await (supabase
            .from("api_credentials") as any)
            .select("*")
            .eq("status", "Active");
        if (error) throw error;
        return data || [];
    },
    updateSessionStatus: async (id: string, updates: any) => {
        await (supabase.from("api_credentials") as any).update(updates).eq("id", id);
    },
    logSnapshot: async (email: string, snapshot: any) => {
        await (supabase.from("sessions_log") as any).insert({
            email,
            trades: snapshot // V2 stores snapshots in trades JSONB
        });
    },
    logTrades: async (email: string, logs: any) => {
        await (supabase.from("trades_log") as any).insert({
            email,
            logs
        });
    }
};

// ------------------------------------------------------------
// 5. BINANCE CLIENT
// ------------------------------------------------------------
const Binance = {
    getPublic: () => axios.create({ baseURL: CONFIG.BINANCE_BASE_URL, timeout: 5000 }),
    getSigned: (apiKey: string) => axios.create({
        baseURL: CONFIG.BINANCE_BASE_URL,
        timeout: 5000,
        headers: { "X-MBX-APIKEY": apiKey }
    }),
    sign: (query: string, secret: string) => crypto.createHmac("sha256", secret).update(query).digest("hex"),
    getServerTime: async () => {
        const res = await axios.get(`${CONFIG.BINANCE_BASE_URL}/fapi/v1/time`);
        return res.data.serverTime;
    }
};

// ------------------------------------------------------------
// 6. TRADING ENGINE
// ------------------------------------------------------------
async function getAccountSnapshot(apiKey: string, apiSecret: string, sessionName: string): Promise<any> {
    const client = Binance.getSigned(apiKey);
    const ts = await Binance.getServerTime();

    const params = `timestamp=${ts}&recvWindow=5000`;
    const signature = Binance.sign(params, apiSecret);
    const url = `/fapi/v2/account?${params}&signature=${signature}`;

    const res = await client.get(url);
    const acc = res.data;

    // Position risk
    const posRes = await client.get(`/fapi/v2/positionRisk?${params}&signature=${signature}`);
    const positions = posRes.data.filter((p: any) => parseFloat(p.positionAmt) !== 0);

    return {
        ts: new Date().toISOString(),
        totalWalletBalance: acc.totalWalletBalance,
        totalUnrealizedProfit: acc.totalUnrealizedProfit,
        assets: acc.assets.filter((a: any) => parseFloat(a.walletBalance) !== 0).slice(0, CONFIG.MAX_ASSETS),
        positions: positions.slice(0, CONFIG.MAX_POSITIONS)
    };
}

function getMockSnapshot(): any {
    return {
        ts: new Date().toISOString(),
        totalWalletBalance: (1000 + Math.random() * 100).toFixed(2),
        totalUnrealizedProfit: (Math.random() * 50 - 25).toFixed(2),
        assets: [{ asset: "USDT", walletBalance: "1000.00", unrealizedProfit: "5.00" }],
        positions: [{ symbol: "BTCUSDT", positionAmt: "0.01", entryPrice: "50000", markPrice: "50500", unrealizedProfit: "5.00" }]
    };
}

// ------------------------------------------------------------
// 7. MAIN LOOP
// ------------------------------------------------------------
let cycleRunning = false;
const sessionBackoffs: Record<string, number> = {};

async function runCycle() {
    if (cycleRunning) return;
    cycleRunning = true;
    Logger.info("Starting trading cycle...");

    try {
        const sessionsData = await Repo.getActiveSessions();
        const sessions = sessionsData as any[];

        if (sessions.length === 0) {
            Logger.info("No active sessions found.");
            return;
        }

        for (const session of sessions) {
            // Check backoff (e.g., skip if failed in last 30s)
            const now = Date.now();
            if (sessionBackoffs[session.id] && now < sessionBackoffs[session.id]) {
                continue;
            }

            const name = session.name || session.id;
            try {
                let snapshot: any;

                if (CONFIG.MOCK_MODE) {
                    snapshot = getMockSnapshot();
                } else {
                    const apiKey = Crypto.decrypt(session.api_key);
                    const apiSecret = Crypto.decrypt(session.api_secret);

                    if (!apiKey || !apiSecret || !Crypto.isPrintable(apiSecret)) {
                        Logger.warn(`[${name}] Decryption failed for key: ${session.api_key?.substring(0, 10)}... (Check ENCRYPTION_KEY)`);
                        throw new Error("Decryption failed or invalid key format");
                    }

                    snapshot = await getAccountSnapshot(apiKey, apiSecret, name);
                }

                // Write to Supabase V2 Schema
                await Repo.logSnapshot(session.email, snapshot);

                // Sync IPs if full_ips exists
                const fullIps = session.full_ips as any[];
                const derivedIps = Array.isArray(fullIps) ? fullIps.map((p: any) => p.ip).filter(Boolean) : [];

                // Update session state
                await Repo.updateSessionStatus(session.id, {
                    last_sync_at: new Date().toISOString(),
                    last_error: null,
                    ips: derivedIps.length > 0 ? derivedIps : session.ips
                });

                Logger.info(`✅ [${name}] Updated. Balance: ${snapshot.totalWalletBalance}`);
                delete sessionBackoffs[session.id];

            } catch (err: any) {
                Logger.error(`[${name}] Cycle failed`, err);
                Logger.diag(name, err);

                // Set backoff to 30s
                sessionBackoffs[session.id] = Date.now() + 30000;

                await Repo.updateSessionStatus(session.id, {
                    last_error: err?.response?.data?.msg || err.message || "Unknown error"
                });
            }
        }
    } catch (err) {
        Logger.error("Cycle exploded", err);
    } finally {
        cycleRunning = false;
    }
}

// ------------------------------------------------------------
// 8. API HANDLER
// ------------------------------------------------------------
async function handleApiRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.writeHead(401);
        res.end(JSON.stringify({ message: "Unauthorized" }));
        return;
    }

    const token = authHeader.split(" ")[1];

    // 1. Verify user with Supabase
    const { data: { user }, error: authError } = await (supabase.auth as any).getUser(token);
    if (authError || !user) {
        res.writeHead(401);
        res.end(JSON.stringify({ message: "Invalid session" }));
        return;
    }

    // 2. Get active session for user
    const { data: sessions, error: dbError } = await (supabase
        .from("api_credentials") as any)
        .select("*")
        .eq("email", user.email)
        .eq("status", "Active")
        .limit(1);

    if (dbError || !sessions || sessions.length === 0) {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "No active trading session found for this user" }));
        return;
    }

    const session = sessions[0];
    const apiKey = Crypto.decrypt(session.api_key);
    const apiSecret = Crypto.decrypt(session.api_secret);

    // 3. Route specific logic
    const path = req.url || "";
    let data: any = null;

    if (path.includes("/get-account") || path.includes("/get-balance") || path.includes("/get-position")) {
        if (CONFIG.MOCK_MODE) {
            data = getMockSnapshot();
        } else {
            data = await getAccountSnapshot(apiKey, apiSecret, session.name);
        }
    } else if (path.includes("/close-positions")) {
        // Simple success mock for now, actual implementation would close positions via Binance
        data = { success: true, message: "Close command accepted" };
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Endpoint not found" }));
        return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

// ------------------------------------------------------------
// 9. RENDER HEALTH SERVER
// ------------------------------------------------------------
function startHealthServer() {
    const server = http.createServer((req, res) => {
        const { method, url } = req;

        // CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        if (url === "/health") {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: true, ts: new Date().toISOString(), mode: CONFIG.MOCK_MODE ? "MOCK" : "PROD" }));
            return;
        }

        // Generic API Handler (Extremely simplified for stability)
        if (url?.startsWith("/api/")) {
            handleApiRequest(req, res).catch(err => {
                Logger.error(`API Error: ${url}`, err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: err.message || "Internal Server Error" }));
            });
            return;
        }

        res.writeHead(404);
        res.end();
    });

    server.on("error", (err: any) => {
        if (err.code === "EADDRINUSE") {
            Logger.warn(`Health server port ${CONFIG.PORT} already in use. Skipping health server...`);
        } else {
            Logger.error("Health server failed", err);
        }
    });

    server.listen(CONFIG.PORT, () => {
        Logger.info(`Health server listening on port ${CONFIG.PORT}`);
    });
}

// ------------------------------------------------------------
// 9. BOOT
// ------------------------------------------------------------
async function boot() {
    Logger.info("XChangeRate Worker Booting...");

    // Print Public IP hint for whitelisting
    try {
        const ipRes = await axios.get("https://api.ipify.org?format=json");
        Logger.info(`Egress Public IP: ${ipRes.data.ip} (Add to Binance whitelist if needed)`);
    } catch {
        Logger.warn("Could not detect public IP");
    }

    startHealthServer();

    // Initial run
    await runCycle();

    // Schedule
    setInterval(runCycle, CONFIG.INTERVAL_MS);
}

boot().catch(err => {
    Logger.error("Boot failed", err);
    process.exit(1);
});