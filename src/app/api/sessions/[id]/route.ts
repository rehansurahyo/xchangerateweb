import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { error } = await supabase
            .from('api_credentials')
            .delete()
            .eq('id', params.id)
            .eq('email', user.email);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Session delete error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
