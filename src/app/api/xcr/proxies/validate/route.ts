import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://xchangerateapi-fw8t.onrender.com";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));

        console.log("[Proxy] Forwarding to: " + `${API_BASE_URL}/api/proxies/validate`);

        const upstream = await fetch(`${API_BASE_URL}/api/proxies/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
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
        console.error("[Proxy Validate Error]:", error.message);
        return NextResponse.json({
            success: false,
            where: "proxy:/api/xcr/proxies/validate",
            error: error.message || String(error)
        }, { status: 500 });
    }
}
