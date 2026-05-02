import { Platform } from 'react-native'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { supabase } from '@/app/lib/supabase'
import { User } from '@/app/models/User'
import { User as SupabaseUser } from '@supabase/supabase-js'

GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
})

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
            options: { redirectTo: window.location.origin },
        })
        return { error: error?.message ?? null }
    }

    try {
        await GoogleSignin.hasPlayServices()
        const response = await GoogleSignin.signIn()
        const idToken = response.data?.idToken
        if (!idToken) return { error: 'No ID token returned from Google' }

        const { error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: idToken,
        })
        return { error: error?.message ?? null }
    } catch (e: any) {
        if (e.code === 'SIGN_IN_CANCELLED') return { error: null }
        return { error: e.message ?? 'Google sign in failed' }
    }
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
