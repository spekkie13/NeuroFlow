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
import {UseAuthResult} from "../models/hooks/UseAuthResult";

export function useAuth(): UseAuthResult {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        getSession().then((u: User) => {
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

    const signInWithGoogle : () => Promise<void> = async () => {
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

    const signOut: () => Promise<void> = async () => {
        await authSignOut()
        setUser(null)
    }

    const clearError: () => void = () => setError(null)

    return { user, isLoading, error, signInWithGoogle, signIn, signUp, signOut, clearError }
}
