import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/app/utils/types'
import {
    clearCurrentUser,
    loadCurrentUser,
    saveCurrentUser,
} from '@/app/services/storage/authStorage'

interface AuthContextValue {
    user: User | null
    isLoading: boolean
    loginWithEmail: (params: { email: string; password: string; name?: string }) => Promise<void>
    loginWithGoogle: () => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        const init = async () => {
            const storedUser = await loadCurrentUser()
            if (!mounted) return
            setUser(storedUser)
            setIsLoading(false)
        }
        init()
        return () => {
            mounted = false
        }
    }, [])

    const loginWithEmail = async ({
                                      email,
                                      password,
                                      name,
                                  }: {
        email: string
        password: string
        name?: string
    }) => {
        // hier kun je later echte backend-auth inpluggen
        const user: User = {
            id: Date.now().toString(),
            email,
            name: name || email.split('@')[0],
            provider: 'email',
            createdAt: new Date().toISOString(),
        }
        setUser(user)
        await saveCurrentUser(user)
    }

    const loginWithGoogle = async () => {
        // placeholder-implementatie
        const user: User = {
            id: Date.now().toString(),
            email: 'user@gmail.com',
            name: 'Google User',
            provider: 'google',
            createdAt: new Date().toISOString(),
        }
        setUser(user)
        await saveCurrentUser(user)
    }

    const logout = async () => {
        setUser(null)
        await clearCurrentUser()
    }

    return (
        <AuthContext.Provider
            value={{
        user,
            isLoading,
            loginWithEmail,
            loginWithGoogle,
            logout,
    }}
>
    {children}
    </AuthContext.Provider>
)
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return ctx
}
