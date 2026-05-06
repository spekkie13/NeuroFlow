import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { Project } from '@/app/models/Project'
import {formatTime} from "@/app/utils/dateUtils";

const REMINDER_ID_PREFIX = 'reminder-'

export function initNotificationHandler(): void {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    })
}

function toIdentifier(timeHHMM: string): string {
    return `${REMINDER_ID_PREFIX}${timeHHMM.replace(':', '-')}`
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

    await cancelExistingReminders()
    const groups = groupProjectsByTime(projects, globalReminderTime)
    await scheduleReminderGroup(groups);
}

async function cancelExistingReminders(): Promise<void> {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync()
    await Promise.all(
        scheduled
            .filter(n => n.identifier.startsWith(REMINDER_ID_PREFIX))
            .map(n => Notifications.cancelScheduledNotificationAsync(n.identifier)),
    )
}

function groupProjectsByTime(projects: Project[], globalReminderTime: string | null): Map<string, string[]> {
    const groups = new Map<string, string[]>()
    for (const project of projects) {
        let effectiveTime: string | null | undefined
        if (project.reminderTime === null) {
            effectiveTime = null
        } else if (typeof project.reminderTime === 'string') {
            effectiveTime = project.reminderTime
        } else {
            effectiveTime = globalReminderTime
        }

        if (!effectiveTime) continue
        const existing = groups.get(effectiveTime) ?? []
        groups.set(effectiveTime, [...existing, project.name])
    }
    return groups;
}

async function scheduleReminderGroup(groups: Map<string, string[]>): Promise<void> {
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
