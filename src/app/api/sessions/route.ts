import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { logAudit } from '@/lib/audit';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-fallback-key-change-me';

export async function POST(request: Request) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch user subscription for plan limits
        const { data: sub } = await supabase
            .from('subscriptions')
            .select('plan')
            .eq('user_id', user.id)
            .single();

        const plan = sub?.plan || 'Free';
        const limits: Record<string, number> = { 'Free': 3, 'Starter': 3, 'Pro': 10, 'Elite': 1000 };

        // Check current session count
        const { count } = await supabase
            .from('api_credentials')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        if (count !== null && count >= (limits[plan] || 1)) {
            return NextResponse.json({ error: `Plan limit reached (${limits[plan]} sessions)` }, { status: 403 });
        }

        const body = await request.json();
        const { name, exchange, apiKey, apiSecret, proxies, target_percent } = body;

        if (!name || !exchange || !apiKey || !apiSecret) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Encrypt sensitive data
        const encryptedKey = CryptoJS.AES.encrypt(apiKey, ENCRYPTION_KEY).toString();
        const encryptedSecret = CryptoJS.AES.encrypt(apiSecret, ENCRYPTION_KEY).toString();

        // Mask the key for display
        const maskedKey = apiKey.length > 8
            ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
            : '****';

        const { data, error } = await supabase
            .from('api_credentials')
            .insert([
                {
                    user_id: user.id,
                    name,
                    exchange,
                    api_key_masked: maskedKey,
                    encrypted_api_key: encryptedKey,
                    encrypted_api_secret: encryptedSecret,
                    proxies: proxies || [],
                    target_percent: target_percent || 100,
                    status: 'Inactive'
                }
            ])
            .select();

        if (error) throw error;

        // Log the security event
        await logAudit('CREATE_SESSION', 'api_credentials', { name, exchange, session_id: data[0].id });

        return NextResponse.json({ data });
    } catch (error: any) {
        console.error('Credential creation error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabase
            .from('api_credentials')
            .select('id, name, exchange, api_key_masked, status, created_at, target_percent')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (error: any) {
        console.error('Fetch credentials error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
