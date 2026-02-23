import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Creates a server-side Supabase client using cookies.
 */
export function createSupabaseServer() {
    const cookieStore = cookies();

    return createServerClient(
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY, // Use service role on server for trusted ops
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {
                        // Handle potential error in Server Components
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.delete({ name, ...options });
                    } catch (error) {
                        // Handle potential error in Server Components
                    }
                },
            },
        }
    );
}

/**
 * Helper to get the authenticated user on the server.
 */
export async function getServerUser() {
    const supabase = createSupabaseServer();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
}
