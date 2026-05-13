export interface User {
    id: string
    email: string
    name: string
    provider: 'email' | 'google'
    createdAt: string
}
