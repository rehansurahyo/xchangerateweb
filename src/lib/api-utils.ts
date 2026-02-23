import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import CryptoJS from "crypto-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default-fallback-key";

/**
 * Retrieves the authenticated Supabase user from the request headers.
 */
export async function getAuthUser(req: NextRequest) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    const token = authHeader.split(" ")[1];

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user;
}

/**
 * Fetches the user's active API credentials and decrypts them.
 */
export async function getUserCredentials(userEmail: string) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch the most recent active session
    const { data: session, error } = await supabase
        .from("api_credentials")
        .select("id, email, exchange, encrypted_api_key, encrypted_api_secret, status, ips")
        .eq("email", userEmail)
        .eq("status", "Active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    let targetSession = session;

    if (error || !session) {
        // Fallback to most recent session regardless of status if no active one found
        const { data: latestSession, error: latestError } = await supabase
            .from("api_credentials")
            .select("id, email, exchange, encrypted_api_key, encrypted_api_secret, status, ips")
            .eq("email", userEmail)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (latestError || !latestSession) {
            throw { code: "MISSING_KEYS", message: "No trading sessions found for this user." };
        }
        targetSession = latestSession;
    }

    const decrypted = decryptSession(targetSession);

    if (!decrypted || !decrypted.apiKey || !decrypted.apiSecret) {
        throw { code: "MISSING_KEYS", message: "Session keys missing or invalid. Please re-add session." };
    }

    return decrypted;
}

function decryptSession(session: any) {
    if (!session || !session.encrypted_api_key || !session.encrypted_api_secret) {
        return null;
    }

    try {
        const keyBytes = CryptoJS.AES.decrypt(session.encrypted_api_key, ENCRYPTION_KEY);
        const apiKey = keyBytes.toString(CryptoJS.enc.Utf8);

        const secretBytes = CryptoJS.AES.decrypt(session.encrypted_api_secret, ENCRYPTION_KEY);
        const apiSecret = secretBytes.toString(CryptoJS.enc.Utf8);

        if (!apiKey || !apiSecret) {
            console.warn("[api-utils] Decrypted keys are empty for session:", session.id);
            return null;
        }

        return {
            apiKey,
            apiSecret,
            exchange: session.exchange,
            email: session.email
        };
    } catch (err) {
        console.warn("[api-utils] Decryption failed for session:", session.id);
        return null;
    }
}
