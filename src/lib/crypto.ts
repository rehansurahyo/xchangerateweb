import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default-fallback-key";

/**
 * Encrypts a plain string using AES-256.
 */
export function encrypt(text: string): string {
    if (!text) return "";
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

/**
 * Safely decrypts an AES-256 string.
 * Returns null instead of throwing on failure.
 */
export function decrypt(cipherText: string | undefined): string | null {
    if (!cipherText) return null;

    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);

        // If decryption results in empty string, it's likely a failure or invalid key
        if (!originalText) {
            // Fallback: If it's already a plain string (unencrypted), return it if it looks like a key
            // (Minimal heuristic: longer than 10 chars and alpha-numeric)
            if (cipherText.length > 10 && /^[a-zA-Z0-9_-]+$/.test(cipherText)) {
                return cipherText;
            }
            return null;
        }

        return originalText;
    } catch (err) {
        console.warn("[Crypto] Decryption failed, returning null.");
        return null;
    }
}
