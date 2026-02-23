import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer, getServerUser } from "@/lib/supabaseServer";
import { decrypt } from "@/lib/crypto";

const UPSTREAM_API = "http://localhost:4000";

export async function POST(req: NextRequest) {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });

    try {
        const { sessionId, symbol } = await req.json();
        if (!sessionId) {
            return NextResponse.json({ ok: false, message: "sessionId is required" }, { status: 400 });
        }

        const supabase = createSupabaseServer();
        const { data: session, error } = await supabase
            .from("api_credentials")
            .select("*")
            .eq("id", sessionId)
            .eq("email", user.email)
            .single();

        if (error || !session) {
            return NextResponse.json({ ok: false, message: "Session not found" }, { status: 404 });
        }

        const apiKey = decrypt(session.encrypted_api_key);
        const apiSecret = decrypt(session.encrypted_api_secret);

        const upstreamRes = await fetch(`${UPSTREAM_API}/api/binance/close-positions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                apiKey,
                apiSecret,
                exchange: session.exchange,
                isTestnet: session.is_testnet || session.name?.toLowerCase().includes("demo") || session.name?.toLowerCase().includes("test"),
                symbol: symbol || "ALL",
                recvWindow: 10000
            })
        });

        const data = await upstreamRes.json().catch(() => ({}));

        if (!upstreamRes.ok) {
            console.error(`[Proxy ClosePositions] Upstream Error ${upstreamRes.status}:`, data);
        }

        return NextResponse.json(data, { status: upstreamRes.status });
    } catch (error: any) {
        console.error("[Proxy ClosePositions] Exception:", error.message);
        return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
    }
}
