import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer, getServerUser } from "@/lib/supabaseServer";
import { encrypt } from "@/lib/crypto";

const UPSTREAM_API = "https://xchangerateapi-fw8t.onrender.com";

export async function GET() {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });

    const supabase = createSupabaseServer();
    const { data: sessions, error } = await supabase
        .from("api_credentials")
        .select("id, name, exchange, status, created_at, ips, full_ips, api_key_masked")
        .eq("email", user.email)
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, sessions });
}

export async function POST(req: NextRequest) {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });

    try {
        const { name, exchange, apiKey, apiSecret, isTestnet } = await req.json();

        if (!name || !apiKey || !apiSecret) {
            return NextResponse.json({ ok: false, message: "Missing required fields" }, { status: 400 });
        }

        // 1. Fetch proxies from upstream (Try local first if configured, else default)
        const proxyRes = await fetch(`${UPSTREAM_API}/api/proxies/list`).catch(() => null);
        let allProxies = [];
        if (proxyRes && proxyRes.ok) {
            const proxyData = await proxyRes.json();
            allProxies = proxyData.results || proxyData.proxies || [];
        }

        // Take subset for ips (TEXT[]) and full_ips (JSONB)
        const subset = allProxies.slice(0, 10);
        const ips = subset.map((p: any) => p.proxy_address || p.ip);
        const full_ips = subset.map((p: any) => ({
            ip: p.proxy_address || p.ip,
            port: p.port
        }));

        // 2. Encrypt keys
        const encryptedKey = encrypt(apiKey);
        const encryptedSecret = encrypt(apiSecret);

        // 3. Insert into Supabase
        const supabase = createSupabaseServer();
        const { data: session, error: insertError } = await supabase
            .from("api_credentials")
            .insert({
                user_id: user.id,
                email: user.email,
                name,
                exchange: exchange || "Binance",
                encrypted_api_key: encryptedKey,
                encrypted_api_secret: encryptedSecret,
                api_key_masked: `****${apiKey.slice(-4)}`,
                ips: ips,
                full_ips: full_ips,
                target_percentage: 100,
                is_testnet: !!isTestnet,
                status: "Paused"
            })
            .select()
            .single();

        if (insertError) throw insertError;

        // 4. Initial session log
        await supabase.from("sessions_log").insert({
            user_id: user.id,
            email: user.email,
            session_id: session.id,
            name: name,
            status: "Paused",
            trades: []
        });

        return NextResponse.json({ ok: true, sessionId: session.id, session });
    } catch (error: any) {
        console.error("[Proxy Session Create] Error:", error.message);
        return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
    }
}
