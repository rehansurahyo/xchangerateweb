import { NextResponse } from "next/server";

const API_BASE_URL = "https://xchangerateapi-fw8t.onrender.com";

export async function GET() {
    try {
        // Ping Render to confirm upstream is reachable
        const upstreamRes = await fetch(`${API_BASE_URL}/api/proxies/list`, {
            method: 'GET',
            next: { revalidate: 0 }
        });

        return NextResponse.json({
            ok: true,
            status: "online",
            upstream: upstreamRes.ok ? "reachable" : "unreachable",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return NextResponse.json({
            ok: true,
            status: "degraded",
            upstream: "unreachable",
            error: "Upstream connection failed"
        }, { status: 200 }); // Still return 200 for health check but indicate status
    }
}
