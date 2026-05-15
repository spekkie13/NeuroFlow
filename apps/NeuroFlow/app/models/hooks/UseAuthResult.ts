import {User} from "../User";

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
