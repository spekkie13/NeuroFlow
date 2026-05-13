import { useEffect, useState } from 'react'
import {
    getSession,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle as authSignInWithGoogle,
    signOut as authSignOut,
} from '../services/auth/authService'
import {User} from "../models";
import {supabase} from "../lib/supabase";

export interface UseAuthResult {
    user: User | null
    isLoading: boolean
    error: string | null
    signInWithGoogle: () => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, name: string) => Promise<void>
    signOut: () => Promise<void>
    clearError: () => void
}

export function useAuth(): UseAuthResult {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        getSession().then((u) => {
            setUser(u)
            setIsLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const u = session?.user
            if (!u) {
                setUser(null)
                return
            }
            setUser({
                id: u.id,
                email: u.email ?? '',
                name: u.user_metadata?.name ?? u.user_metadata?.full_name ?? u.email?.split('@')[0] ?? 'User',
                provider: u.app_metadata?.provider === 'google' ? 'google' : 'email',
                createdAt: u.created_at,
            })
        })

        return () => subscription.unsubscribe()
    }, [])

    const signInWithGoogle = async () => {
        setError(null)
        setIsLoading(true)
        const { error } = await authSignInWithGoogle()
        setError(error)
        setIsLoading(false)
    }

    const signIn = async (email: string, password: string) => {
        setError(null)
        setIsLoading(true)
        const { user, error } = await signInWithEmail(email, password)
        setUser(user)
        setError(error)
        setIsLoading(false)
    }

    const signUp = async (email: string, password: string, name: string) => {
        setError(null)
        setIsLoading(true)
        const { user, error } = await signUpWithEmail(email, password, name)
        setUser(user)
        setError(error)
        setIsLoading(false)
    }

    const signOut = async () => {
        await authSignOut()
        setUser(null)
    }

    const clearError = () => setError(null)

    return { user, isLoading, error, signInWithGoogle, signIn, signUp, signOut, clearError }
}
