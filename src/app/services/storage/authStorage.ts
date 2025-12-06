// services/storage/authStorage.ts
import { User } from '@/app/utils/types'
import { getJsonItem, removeItem, setJsonItem } from './baseStorage'

const AUTH_USER_KEY = 'adhd-planner:auth:user'

export async function saveCurrentUser(user: User): Promise<void> {
    await setJsonItem(AUTH_USER_KEY, user)
}

export async function loadCurrentUser(): Promise<User | null> {
    return await getJsonItem<User>(AUTH_USER_KEY)
}

export async function clearCurrentUser(): Promise<void> {
    await removeItem(AUTH_USER_KEY)
}
