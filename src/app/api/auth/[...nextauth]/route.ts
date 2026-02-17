
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Supabase",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: Record<"email" | "password", string> | undefined) {
                if (!credentials?.email || !credentials?.password) return null;

                console.log("Attempting login for:", credentials.email);
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: credentials.email,
                    password: credentials.password,
                });

                if (error || !data.user) {
                    console.error("Supabase Login Error:", error);
                    throw new Error(error?.message || "Invalid credentials");
                }
                console.log("Login successful:", data.user.email);

                return {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
                };
            },
        }),
    ],
    pages: {
        signIn: "/",
    },
    callbacks: {
        async session({ session, token }: { session: any, token: any }) {
            if (session.user && token.sub) {
                session.user.name = token.name;
            }
            return session;
        },
        async jwt({ token, user }: { token: any, user: any }) {
            if (user) {
                token.sub = user.id;
                token.name = user.name;
            }
            return token;
        }
    }
});

export { handler as GET, handler as POST };
