import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer, getServerUser } from "@/lib/supabaseServer";
import { decrypt } from "@/lib/crypto";

const UPSTREAM_API = "http://localhost:4000";

export async function POST(req: NextRequest) {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });

    try {
        const { sessionId } = await req.json();
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

        if (!apiKey || !apiSecret) {
            return NextResponse.json({ ok: false, message: "Session keys invalid" }, { status: 400 });
        }

        const upstreamRes = await fetch(`${UPSTREAM_API}/api/binance/account`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                apiKey,
                apiSecret,
                recvWindow: 10000,
                exchange: session.exchange,
                isTestnet: session.is_testnet || session.name?.toLowerCase().includes("demo") || session.name?.toLowerCase().includes("test")
            })
        });

        const data = await upstreamRes.json().catch(() => ({}));

        if (!upstreamRes.ok) {
            console.error(`[Proxy Account] Upstream Error ${upstreamRes.status}:`, data);
        }

        return NextResponse.json(data, { status: upstreamRes.status });
    } catch (error: any) {
        console.error("[Proxy Account] Exception:", error.message);
        return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
    }
}
