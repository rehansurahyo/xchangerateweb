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

        const body = await request.json();
        const { name, exchange, apiKey, apiSecret, target_percentage } = body;

        if (!name || !exchange || !apiKey || !apiSecret) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Encrypt sensitive data
        const encryptedKey = CryptoJS.AES.encrypt(apiKey, ENCRYPTION_KEY).toString();
        const encryptedSecret = CryptoJS.AES.encrypt(apiSecret, ENCRYPTION_KEY).toString();

        const { data, error } = await supabase
            .from('api_credentials')
            .insert([
                {
                    email: user.email,
                    name,
                    exchange,
                    api_key: encryptedKey,
                    api_secret: encryptedSecret,
                    target_percentage: target_percentage || 100,
                    status: 'Paused',
                    ips: [],
                    full_ips: [],
                    is_new: true
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
            .select('*')
            .eq('email', user.email)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (error: any) {
        console.error('Fetch credentials error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
