import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer, getServerUser } from "@/lib/supabaseServer";
import { decrypt } from "@/lib/crypto";

const UPSTREAM_API = "https://xchangerateapi-fw8t.onrender.com";

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

        const upstreamRes = await fetch(`${UPSTREAM_API}/api/balance`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(apiKey ? { "X-MBX-APIKEY": apiKey } : {}),
                ...(apiSecret ? { "X-MBX-SECRET": apiSecret } : {})
            },
            body: JSON.stringify({ exchange: session.exchange })
        });

        const data = await upstreamRes.json();
        return NextResponse.json(data, { status: upstreamRes.status });
    } catch (error: any) {
        return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
    }
}
