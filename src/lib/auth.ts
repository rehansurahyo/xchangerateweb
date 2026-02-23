import { createClient } from './supabase-server'

export async function getUser() {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    return user
}

export async function getProfile(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (error) {
        console.error('Error fetching profile:', error)
        return null
    }
    return data
}

export async function getServerSessionWithProfile() {
    const user = await getUser()
    if (!user) return null

    const profile = await getProfile(user.id)
    return { user, profile }
}
