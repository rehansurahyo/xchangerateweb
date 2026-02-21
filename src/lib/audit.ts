import { createClient } from './supabase-server';

export async function logAudit(action: string, resource: string, details: any = {}) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        await supabase.from('audit_logs').insert({
            user_id: user.id,
            action,
            resource,
            details
        });
    } catch (error) {
        console.error('Failed to log audit:', error);
    }
}
