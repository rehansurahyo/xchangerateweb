import { NextResponse } from "next/server";

const API_BASE_URL = "https://xchangerateapi-fw8t.onrender.com";

export async function GET() {
    try {
        console.log("[Proxy] Forwarding to: " + `${API_BASE_URL}/api/proxies/list`);

        const upstream = await fetch(`${API_BASE_URL}/api/proxies/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'no-store',
        });

        const text = await upstream.text();
        console.log("UPSTREAM_STATUS", upstream.status);
        console.log("UPSTREAM_BODY", text.slice(0, 400));

        return new NextResponse(text, {
            status: upstream.status,
            headers: {
                "Content-Type": upstream.headers.get("content-type") || "application/json"
            },
        });
    } catch (error: any) {
        console.error("[Proxy List Error]:", error.message);
        return NextResponse.json({
            success: false,
            where: "proxy:/api/xcr/proxies/list",
            error: error.message || String(error)
        }, { status: 500 });
    }
}
