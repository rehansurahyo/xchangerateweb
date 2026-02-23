import axios, { AxiosInstance, AxiosError } from 'axios';
import { dedupedToast } from './toastDeduper';

const BASE_URL = process.env.NEXT_PUBLIC_XCR_API_BASE_URL || 'https://xchangerateapi-fw8t.onrender.com';

// ------------------------------------------------------------
// AUTH HELPERS
// ------------------------------------------------------------
export const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('xcr_token') : null;
export const setToken = (token: string) => localStorage.setItem('xcr_token', token);
export const clearToken = () => localStorage.removeItem('xcr_token');

// ------------------------------------------------------------
// API CLIENT
// ------------------------------------------------------------
const xcrClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 20000, // 20s timeout as requested
});

// Request Interceptor: Attach Supabase Access Token or local xcr_token
xcrClient.interceptors.request.use(async (config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: Handle errors without spamming
xcrClient.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError) => {
        const status = error.response?.status;
        const message = (error.response?.data as any)?.message ||
            (error.response?.data as any)?.msg ||
            error.message ||
            'Network error — check API base URL/CORS';

        // 401 Logout Logic
        if (status === 401) {
            clearToken();
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        // Use Deduped Toast
        dedupedToast.error(message);

        return Promise.reject(error);
    }
);

// ------------------------------------------------------------
// API SERVICE LAYER
// ------------------------------------------------------------
export const xcrApi = {
    // Live Dashboard Data (POST as requested)
    getBalance: (payload: any = {}) => xcrClient.post('/api/balance', payload),
    getAccount: (payload: any = {}) => xcrClient.post('/api/account', payload),
    getPositions: (payload: any = {}) => xcrClient.post('/api/position-risk', payload),

    // Actions
    closeAllPositions: (payload: { symbol: string }) => xcrClient.post('/api/close-positions', payload),

    // Proxies
    listProxies: () => xcrClient.get('/api/proxies/list'),
    validateProxy: (payload: { ip: string, port: string | number }) => xcrClient.post('/api/proxies/validate', payload),

    // Route Discovery
    getRoutes: () => xcrClient.get('/routes'),
};

export default xcrApi;
