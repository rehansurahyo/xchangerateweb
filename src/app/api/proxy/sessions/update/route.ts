import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer, getServerUser } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });

    try {
        const { id, status } = await req.json();
        if (!id || !status) {
            return NextResponse.json({ ok: false, message: "Missing id or status" }, { status: 400 });
        }

        const supabase = createSupabaseServer();
        const { error } = await supabase
            .from("api_credentials")
            .update({ status })
            .eq("id", id)
            .eq("email", user.email);

        if (error) throw error;

        return NextResponse.json({ ok: true });
    } catch (error: any) {
        return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
    }
}
