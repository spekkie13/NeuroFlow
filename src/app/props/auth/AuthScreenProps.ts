export type Mode = 'login' | 'signup'

export interface AuthScreenProps {
    onSubmitEmail: (params: {
        mode: Mode
        email: string
        password: string
        name?: string
    }) => void
    onSubmitGoogle: () => void
    error?: string | null
    isLoading?: boolean
}
