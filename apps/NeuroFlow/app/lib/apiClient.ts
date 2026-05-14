import { supabase } from './supabase'

const API_URL: string = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001'

async function getToken(): Promise<string | null> {
    const { data } = await supabase.auth.getSession()
    return data.session?.user.id ?? null
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token: string = await getToken()

    const isDelete: boolean = options.method === 'DELETE'

    const response: Response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            ...(isDelete ? {} : { 'Content-Type': 'application/json' }),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    })

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
    }

    return response.json()
}

export const apiClient = {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body: unknown) =>
        request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    patch: <T>(path: string, body: unknown) =>
        request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
