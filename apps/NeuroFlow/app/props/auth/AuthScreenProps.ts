export type Mode = 'login' | 'signup'

export interface AuthScreenProps {
    onSignInWithGoogle: () => void
    onSubmitEmail: (params: {
        mode: Mode
        email: string
        password: string
        name?: string
    }) => void
    error?: string | null
    isLoading?: boolean
}