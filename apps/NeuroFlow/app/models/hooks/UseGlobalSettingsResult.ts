export interface UseGlobalSettingsResult {
    globalReminderTime: string | null
    isLoading: boolean
    setGlobalReminder: (time: string | null) => Promise<void>
}
