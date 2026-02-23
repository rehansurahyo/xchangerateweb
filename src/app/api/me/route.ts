import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/supabaseServer";

export async function GET() {
    const user = await getServerUser();

    if (!user) {
        return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
        ok: true,
        user: { id: user.id, email: user.email },
        email: user.email
    });
}
