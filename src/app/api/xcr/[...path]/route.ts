import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, getUserCredentials } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

const API_BASE_URL =
    process.env.XCR_API_BASE_URL || "https://xchangerateapi-fw8t.onrender.com";

const TIMEOUT_MS = 30_000; // 30s upstream timeout

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    return handleRequest(req, params.path);
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
    return handleRequest(req, params.path);
}

export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
    return handleRequest(req, params.path);
}

export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
    return handleRequest(req, params.path);
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-MBX-APIKEY",
        },
    });
}

async function handleRequest(req: NextRequest, pathSegments: string[]) {
    const path = pathSegments.join("/");

    // ── Health shortcut — no upstream call, eliminates 404 loop ──
    if (path === "health") {
        return NextResponse.json({ ok: true, ts: new Date().toISOString() });
    }

    try {
        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const method = req.method;
        const bodyText = method !== "GET" && method !== "HEAD" ? await req.text() : "";
        let bodyJson: any = {};
        try { bodyJson = bodyText ? JSON.parse(bodyText) : {}; } catch (e) { }

        // ── Binance Credential Injection ──
        // If it's a binance route, we expect a sessionId to lookup credentials
        if (path.startsWith("binance/") && (path.includes("position-risk") || path.includes("account") || path.includes("balance"))) {
            const sessionId = bodyJson.sessionId || req.nextUrl.searchParams.get("sessionId");
            if (!sessionId) {
                return NextResponse.json({ success: false, error: "sessionId is required" }, { status: 400 });
            }

            const credentials = await getUserCredentials(user.email!); // This now fetches by userEmail and gets most recent active
            // Note: If we need a SPECIFIC session by ID, we should update api-utils or handle here.
            // For now, let's stick to the user's active session as per current api-utils logic.

            if (!credentials) {
                return NextResponse.json({ success: false, error: "No active trading session found." }, { status: 404 });
            }

            // Inject credentials into body for Upstream
            bodyJson.apiKey = credentials.apiKey;
            bodyJson.apiSecret = credentials.apiSecret;
        }

        const upstreamUrl = `${API_BASE_URL}/${path}${req.nextUrl.search}`;
        const headers = new Headers();
        headers.set("Content-Type", "application/json");

        // Set timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        console.log(`[XCR Proxy] ${method} → ${upstreamUrl} (User: ${user.email})`);

        const response = await fetch(upstreamUrl, {
            method,
            headers,
            body: method !== "GET" && method !== "HEAD" ? JSON.stringify(bodyJson) : undefined,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const contentType = response.headers.get("content-type") ?? "";
        let data: any;

        if (contentType.includes("application/json")) {
            data = await response.json().catch(() => ({}));
        } else {
            const text = await response.text().catch(() => "");
            data = { message: text || response.statusText, status: response.status };
        }

        return NextResponse.json(data, { status: response.status });
    } catch (error: any) {
        const isTimeout = error.name === "AbortError";
        console.error(`[XCR Proxy Error] ${path}:`, error.message);

        return NextResponse.json(
            {
                success: false,
                error: isTimeout ? "Upstream Timeout" : "Proxy Error",
                message: isTimeout
                    ? `Upstream did not respond within ${TIMEOUT_MS / 1000}s`
                    : error.message,
            },
            { status: isTimeout ? 504 : 502 }
        );
    }
}
