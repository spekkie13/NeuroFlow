import { useEffect, useState } from 'react'
import {getGlobalReminderTime, setGlobalReminderTime} from "../services/storage/globalSettingsStorage";
import {pushGlobalSettings, syncGlobalSettings} from "../services/sync/SyncService";

interface UseGlobalSettingsResult {
    globalReminderTime: string | null
    isLoading: boolean
    setGlobalReminder: (time: string | null) => Promise<void>
}

export function useGlobalSettings(userId: string | null): UseGlobalSettingsResult {
    const [globalReminderTime, setTime] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let mounted: boolean = true
        const init = async () => {
            const local: string = await getGlobalReminderTime()
            if (!mounted) return
            setTime(local)
            setIsLoading(false)

            if (userId) {
                const synced: string = await syncGlobalSettings()
                if (!mounted || synced === undefined) return
                setTime(synced)
            }
        }
        init()
        return () => { mounted = false }
    }, [userId])

    const setGlobalReminder = async (time: string | null) => {
        setTime(time)
        await setGlobalReminderTime(time)
        if (userId) pushGlobalSettings(time)
    }

    return { globalReminderTime, isLoading, setGlobalReminder }
}
