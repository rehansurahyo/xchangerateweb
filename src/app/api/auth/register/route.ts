
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const { email, password, fullName } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        console.log("Registering user:", email);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) {
            console.error("Supabase SignUp Error:", error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        console.log("SignUp data:", data);

        if (data.user && !data.session) {
            return NextResponse.json({
                user: data.user,
                message: "Account created! Please check your email to confirm your account before logging in."
            }, { status: 200 });
        }

        return NextResponse.json({ user: data.user, session: data.session }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
