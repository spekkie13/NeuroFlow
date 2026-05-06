import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { Project } from '@/app/models/Project'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
})

const REMINDER_ID_PREFIX = 'reminder-'

function toIdentifier(timeHHMM: string): string {
    return `${REMINDER_ID_PREFIX}${timeHHMM.replace(':', '-')}`
}

function formatTime(timeHHMM: string): string {
    const [h, m] = timeHHMM.split(':').map(Number)
    const period = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 || 12
    const minute = m.toString().padStart(2, '0')
    return `${hour}:${minute} ${period}`
}

function buildBody(projectNames: string[]): string {
    if (projectNames.length === 1) return `Time to work on ${projectNames[0]}!`
    const last = projectNames[projectNames.length - 1]
    const rest = projectNames.slice(0, -1).join(', ')
    return `Time to work on ${rest} and ${last}!`
}

export async function requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false
    const { status: existing } = await Notifications.getPermissionsAsync()
    if (existing === 'granted') return true
    const { status } = await Notifications.requestPermissionsAsync()
    return status === 'granted'
}

export async function scheduleAllReminders(
    projects: Project[],
    globalReminderTime: string | null,
): Promise<void> {
    if (Platform.OS === 'web') return

    // Cancel all existing reminder notifications
    const scheduled = await Notifications.getAllScheduledNotificationsAsync()
    await Promise.all(
        scheduled
            .filter(n => n.identifier.startsWith(REMINDER_ID_PREFIX))
            .map(n => Notifications.cancelScheduledNotificationAsync(n.identifier)),
    )

    // Group projects by effective reminder time
    const groups = new Map<string, string[]>()
    for (const project of projects) {
        let effectiveTime: string | null | undefined
        if (project.reminderTime === null) {
            effectiveTime = null // explicitly silenced
        } else if (typeof project.reminderTime === 'string') {
            effectiveTime = project.reminderTime
        } else {
            effectiveTime = globalReminderTime // inherit
        }

        if (!effectiveTime) continue
        const existing = groups.get(effectiveTime) ?? []
        groups.set(effectiveTime, [...existing, project.name])
    }

    // Schedule one notification per distinct time
    for (const [timeHHMM, names] of groups.entries()) {
        const [hour, minute] = timeHHMM.split(':').map(Number)
        await Notifications.scheduleNotificationAsync({
            identifier: toIdentifier(timeHHMM),
            content: {
                title: `NeuroFlow — ${formatTime(timeHHMM)}`,
                body: buildBody(names),
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour,
                minute,
            },
        })
    }
}