import { dedupedToast } from "./toastDeduper";

const PROXY_BASE = "/api/xcr";

// Toast dedupe guard
const activeToastMessages = new Set<string>();
function guardedToast(type: 'success' | 'error' | 'loading', message: string) {
    if (activeToastMessages.has(message)) return;

    activeToastMessages.add(message);
    setTimeout(() => activeToastMessages.delete(message), 4000); // 4s guard window

    if (type === 'error') dedupedToast.error(message);
    else if (type === 'success') dedupedToast.success(message);
    else dedupedToast.loading(message);
}

export interface XCRResponse<T = any> {
    ok: boolean;
    data?: T;
    error?: string;
    message?: string;
    status: number;
    sessions?: any[]; // For session list
    trades?: any[];   // For trade list
    logs?: any[];     // For session logs
    positions?: any[]; // For Binance positions
    user?: any;       // For /api/me
    email?: string;
}

let authToken: string | null = null;

function getHeaders() {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
    return headers;
}

async function request<T = any>(
    path: string,
    method: string = "GET",
    body?: any
): Promise<XCRResponse<T>> {
    // If path starts with /api/, use it as-is. Otherwise, use proxy base.
    const url = path.startsWith("/api/") ? path : `${PROXY_BASE}/${path.startsWith("/") ? path.slice(1) : path}`;

    try {
        const response = await fetch(url, {
            method,
            headers: getHeaders(),
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const errorMsg = data.message || data.error || `Error ${response.status}`;

            // Special handling for missing sessionId to prevent spam
            if (response.status === 400 && errorMsg.includes("sessionId is required")) {
                guardedToast('error', "Trading session required. Please select a session.");
            } else {
                guardedToast('error', errorMsg);
            }

            return {
                ok: false,
                status: response.status,
                message: errorMsg,
                error: errorMsg
            };
        }

        return {
            ok: true,
            status: response.status,
            data: data,
            ...data // Flattening to support direct access (e.g., res.sessions)
        };
    } catch (error: any) {
        const msg = error.message || "Network request failed";
        guardedToast('error', msg);
        return {
            ok: false,
            status: 500,
            message: msg,
            error: msg
        };
    }
}

export const xcrClient = {
    setToken: (token: string | null) => { authToken = token; },

    get: <T = any>(path: string) => request<T>(path, "GET"),
    post: <T = any>(path: string, body?: any) => request<T>(path, "POST", body),

    // Domain Helpers
    getAccount: (sessionId: string) => xcrClient.post("account", { sessionId }),
    getPositions: (sessionId: string) => xcrClient.post("position-risk", { sessionId }),
    getBalance: (sessionId: string) => xcrClient.post("balance", { sessionId }),
    closePositions: (sessionId: string, symbol: string = "ALL") =>
        xcrClient.post("close-positions", { sessionId, symbol }),

    // Proxy Helpers
    getProxySessions: () => xcrClient.get("/api/proxy/sessions"),
    createProxySession: (body: any) => xcrClient.post("/api/proxy/sessions", body),
    getProxyTrades: () => xcrClient.get("/api/proxy/trades"),
    getProxyLogs: () => xcrClient.get("/api/proxy/logs"),
    getMe: () => xcrClient.get("/api/me"),
};
