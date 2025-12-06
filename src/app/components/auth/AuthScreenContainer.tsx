import React, { useState } from 'react'
import { AuthScreen } from '@/app/components/auth/AuthScreen'
import { useAuth } from '@/app/hooks/useAuth'

export const AuthScreenContainer: React.FC = () => {
    const { loginWithEmail, loginWithGoogle } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmitEmail = async (params: {
        mode: 'login' | 'signup'
        email: string
        password: string
        name?: string
    }) => {
        setError(null)
        setIsLoading(true)

        try {
            // simpele validatie kan hier óf in een aparte validator-service
            if (!params.email.includes('@')) {
                throw new Error('Please enter a valid email address')
            }
            if (params.password.length < 6) {
                throw new Error('Password must be at least 6 characters')
            }

            await loginWithEmail({
                email: params.email,
                password: params.password,
                name: params.mode === 'signup' ? params.name : undefined,
            })
        } catch (err: any) {
            setError(err.message || 'Failed to authenticate')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmitGoogle = async () => {
        setError(null)
        setIsLoading(true)
        try {
            await loginWithGoogle()
        } catch (err: any) {
            setError('Failed to log in with Google')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthScreen
            onSubmitEmail={handleSubmitEmail}
            onSubmitGoogle={handleSubmitGoogle}
            error={error}
            isLoading={isLoading}
        />
    )
}
