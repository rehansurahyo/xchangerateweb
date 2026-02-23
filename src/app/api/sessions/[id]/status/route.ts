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
        const { status } = body; // 'Active' | 'Paused'

        if (!['Active', 'Paused'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const updateData: any = { status };

        if (status === 'Active') {
            // Only set start_time if it's currently null
            const { data: current } = await supabase
                .from('api_credentials')
                .select('start_time')
                .eq('id', params.id)
                .single();

            if (current && !current.start_time) {
                updateData.start_time = new Date().toISOString();
            }
        }

        const { data, error } = await supabase
            .from('api_credentials')
            .update(updateData)
            .eq('id', params.id)
            .eq('email', user.email)
            .select();

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (error: any) {
        console.error('Status toggle error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
