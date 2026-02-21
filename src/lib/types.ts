export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    username: string | null
                    email: string | null
                    avatar_url: string | null
                    plan: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    username?: string | null
                    email?: string | null
                    avatar_url?: string | null
                    plan?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    username?: string | null
                    email?: string | null
                    avatar_url?: string | null
                    plan?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            api_credentials: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    exchange: 'Binance' | 'Bybit' | 'OKX'
                    api_key_masked: string
                    encrypted_api_key: string
                    encrypted_api_secret: string
                    proxies: Json
                    target_percent: number
                    status: 'Active' | 'Inactive'
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    exchange: string
                    api_key_masked: string
                    encrypted_api_key: string
                    encrypted_api_secret: string
                    proxies?: Json
                    target_percent?: number
                    status?: 'Active' | 'Inactive'
                    created_at?: string
                }
            }
            trades_log: {
                Row: {
                    id: string
                    user_id: string
                    session_id: string | null
                    symbol: string
                    side: 'LONG' | 'SHORT' | null
                    entry_price: number | null
                    exit_price: number | null
                    pnl: number | null
                    status: 'OPEN' | 'CLOSED' | 'CANCELLED' | null
                    created_at: string
                }
            }
            subscriptions: {
                Row: {
                    user_id: string
                    plan: 'Starter' | 'Pro' | 'Elite' | null
                    status: string | null
                }
            }
            community_messages: {
                Row: {
                    id: string
                    user_id: string
                    username: string
                    channel: 'trades' | 'signals' | 'system' | 'general'
                    message: string
                    created_at: string
                }
            }
            account_snapshots: {
                Row: {
                    id: string
                    user_id: string
                    session_id: string
                    exchange: string
                    snapshot: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    session_id: string
                    exchange: string
                    snapshot: Json
                    created_at?: string
                }
            }
        }
    }
}
