import { NextResponse } from "next/server";
import { createSupabaseServer, getServerUser } from "@/lib/supabaseServer";

export async function GET() {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });

    const supabase = createSupabaseServer();
    const { data: logs, error } = await supabase
        .from("sessions_log")
        .select("*")
        .eq("email", user.email)
        .order("created_at", { ascending: false })
        .limit(100);

    if (error) {
        return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, logs });
}
