import AsyncStorage from '@react-native-async-storage/async-storage'

const GLOBAL_REMINDER_KEY = 'adhd-planner:global-reminder-time'
const GLOBAL_REMINDER_UPDATED_AT_KEY = 'adhd-planner:global-reminder-updated-at'

export async function getGlobalReminderTime(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem(GLOBAL_REMINDER_KEY)
    } catch (error) {
        console.error('[globalSettingsStorage] getGlobalReminderTime failed:', error)
        return null
    }
}

export async function setGlobalReminderTime(time: string | null): Promise<void> {
    try {
        if (time === null) {
            await AsyncStorage.removeItem(GLOBAL_REMINDER_KEY)
        } else {
            await AsyncStorage.setItem(GLOBAL_REMINDER_KEY, time)
        }
        await AsyncStorage.setItem(GLOBAL_REMINDER_UPDATED_AT_KEY, new Date().toISOString())
    } catch (error) {
        console.error('[globalSettingsStorage] setGlobalReminderTime failed:', error)
    }
}

export async function getGlobalReminderUpdatedAt(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem(GLOBAL_REMINDER_UPDATED_AT_KEY)
    } catch (error) {
        console.error('[globalSettingsStorage] getGlobalReminderUpdatedAt failed:', error)
        return null
    }
}
