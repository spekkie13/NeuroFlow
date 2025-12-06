// utils/storageClient.ts
import AsyncStorage from '@react-native-async-storage/async-storage'

export class StorageClient {
    static async setItem<T>(key: string, value: T): Promise<void> {
        try {
            const json = JSON.stringify(value)
            await AsyncStorage.setItem(key, json)
        } catch (err) {
            console.error(`Failed to save value for key "${key}"`, err)
        }
    }

    static async getItem<T>(key: string): Promise<T | null> {
        try {
            const raw = await AsyncStorage.getItem(key)
            if (!raw) return null
            return JSON.parse(raw) as T
        } catch (err) {
            console.error(`Failed to load value for key "${key}"`, err)
            return null
        }
    }

    static async removeItem(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key)
        } catch (err) {
            console.error(`Failed to remove key "${key}"`, err)
        }
    }
}
