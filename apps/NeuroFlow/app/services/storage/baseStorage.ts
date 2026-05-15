import AsyncStorage from '@react-native-async-storage/async-storage'

export async function setJsonItem<T>(key: string, value: T): Promise<void> {
    try {
        const json: string = JSON.stringify(value)
        await AsyncStorage.setItem(key, json)
    } catch (error) {
        console.error(`Failed to save key ${key}`, error)
    }
}

export async function getJsonItem<T>(key: string): Promise<T | null> {
    try {
        const json: string = await AsyncStorage.getItem(key)
        if (!json)
            return null

        return JSON.parse(json) as T
    } catch (error) {
        console.error(`Failed to load key ${key}`, error)
        return null
    }
}
