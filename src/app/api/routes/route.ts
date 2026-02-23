import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        ok: true,
        routes: [
            "/api/me",
            "/api/proxy/sessions",
            "/api/proxy/trades",
            "/api/xcr/account",
            "/api/xcr/position-risk",
            "/api/xcr/balance",
            "/api/xcr/close-positions",
            "/api/xcr/health"
        ]
    });
}
