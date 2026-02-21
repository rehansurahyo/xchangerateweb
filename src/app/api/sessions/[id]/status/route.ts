import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { status } = body; // 'Active' | 'Inactive'

        if (!['Active', 'Inactive'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('api_credentials')
            .update({ status })
            .eq('id', params.id)
            .eq('user_id', user.id)
            .select();

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (error: any) {
        console.error('Status toggle error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
