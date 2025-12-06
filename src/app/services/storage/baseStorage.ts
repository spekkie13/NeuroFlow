// services/storage/baseStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage'

export async function setJsonItem<T>(key: string, value: T): Promise<void> {
    try {
        const json = JSON.stringify(value)
        await AsyncStorage.setItem(key, json)
    } catch (error) {
        console.error(`Failed to save key ${key}`, error)
    }
}

export async function getJsonItem<T>(key: string): Promise<T | null> {
    try {
        const json = await AsyncStorage.getItem(key)
        if (!json) return null
        return JSON.parse(json) as T
    } catch (error) {
        console.error(`Failed to load key ${key}`, error)
        return null
    }
}

export async function removeItem(key: string): Promise<void> {
    try {
        await AsyncStorage.removeItem(key)
    } catch (error) {
        console.error(`Failed to remove key ${key}`, error)
    }
}
