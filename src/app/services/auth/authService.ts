import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { Alert, Platform } from 'react-native'
import { supabase } from '@/app/lib/supabase'
import { User } from '@/app/models/User'
import { User as SupabaseUser } from '@supabase/supabase-js'

function toAppUser(u: SupabaseUser): User {
    return {
        id: u.id,
        email: u.email ?? '',
        name: u.user_metadata?.name ?? u.user_metadata?.full_name ?? u.email?.split('@')[0] ?? 'User',
        provider: u.app_metadata?.provider === 'google' ? 'google' : 'email',
        createdAt: u.created_at,
    }
}

export async function signInWithGoogle(): Promise<{ error: string | null }> {
    if (Platform.OS === 'web') {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        })
        return { error: error?.message ?? null }
    }

    const redirectTo = 'neuroflow://'

    Alert.alert('DEBUG', `redirectTo: ${redirectTo}`)

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo,
            skipBrowserRedirect: true,
        },
    })

    if (error || !data.url) {
        return { error: error?.message ?? 'Could not start Google sign in' }
    }

    Alert.alert('DEBUG', `OAuth URL contains redirect_to: ${data.url.includes('redirect_to')}`)

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo)

    if (result.type === 'success') {
        // Tokens may be in the fragment (#) or query string (?)
        const raw = result.url
        const fragment = raw.split('#')[1] ?? ''
        const query = raw.split('?')[1]?.split('#')[0] ?? ''
        const params = new URLSearchParams(fragment || query)

        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')

        if (accessToken && refreshToken) {
            const { error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            })
            if (sessionError) return { error: sessionError.message }
        }
    }

    // Cancelled or dismissed — not an error
    return { error: null }
}

export async function signInWithEmail(
    email: string,
    password: string,
): Promise<{ user: User | null; error: string | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { user: null, error: error.message }
    if (!data.user) return { user: null, error: 'Sign in failed' }
    return { user: toAppUser(data.user), error: null }
}

export async function signUpWithEmail(
    email: string,
    password: string,
    name: string,
): Promise<{ user: User | null; error: string | null }> {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
    })
    if (error) return { user: null, error: error.message }
    if (!data.user) return { user: null, error: 'Sign up failed' }
    return { user: toAppUser(data.user), error: null }
}

export async function signOut(): Promise<void> {
    await supabase.auth.signOut()
}

export async function getSession(): Promise<User | null> {
    const { data } = await supabase.auth.getSession()
    const user = data.session?.user
    return user ? toAppUser(user) : null
}