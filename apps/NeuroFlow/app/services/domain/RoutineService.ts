import {Priority, Project, Task} from "../../models";
import {Routine, RecurrenceRule} from "../../models/Routine";
import {generateId} from "../../utils/idUtils";
import {toIsoDateString} from "../../utils/dateUtils";

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function createRoutine(params: {
    name: string
    recurrence: RecurrenceRule
    priority?: Priority
    estimatedMinutes?: number
    notes?: string
}): Routine {
    return {
        id: generateId(),
        name: params.name.trim() || 'Untitled Routine',
        recurrence: params.recurrence,
        priority: params.priority ?? 'medium',
        estimatedMinutes: params.estimatedMinutes,
        notes: params.notes,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
}

export function getRecurrenceLabel(rule: RecurrenceRule): string {
    switch (rule.frequency) {
        case 'daily':
            return 'Every day'
        case 'weekly': {
            const sorted = (rule.daysOfWeek ?? []).slice().sort((a, b) => a - b)
            if (sorted.length === 0) return 'Weekly'
            if (sorted.length === 7) return 'Every day'
            return `Every ${sorted.map(d => DAY_NAMES[d]).join(', ')}`
        }
        case 'monthly':
            return `Monthly on the ${ordinal(rule.dayOfMonth ?? 1)}`
        default:
            return 'Recurring'
    }
}

function ordinal(n: number): string {
    const s = ['th', 'st', 'nd', 'rd']
    const v = n % 100
    return n + (s[(v - 20) % 10] ?? s[v] ?? s[0])
}

function matchesRule(rule: RecurrenceRule, date: Date): boolean {
    switch (rule.frequency) {
        case 'daily':
            return true
        case 'weekly':
            return (rule.daysOfWeek ?? []).includes(date.getDay())
        case 'monthly':
            return rule.dayOfMonth === date.getDate()
        default:
            return false
    }
}

function getTargetDates(rule: RecurrenceRule, today: Date, horizonDays: number): Date[] {
    const dates: Date[] = []
    for (let i = 0; i < horizonDays; i++) {
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)
        if (matchesRule(rule, d)) dates.push(d)
    }
    return dates
}

function createTaskFromRoutine(routine: Routine, dateStr: string): Task {
    return {
        id: generateId(),
        name: routine.name,
        completed: false,
        priority: routine.priority,
        date: dateStr,
        notes: routine.notes ?? '',
        estimatedMinutes: routine.estimatedMinutes,
        routineId: routine.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
}

export function generateRoutineInstances(
    projects: Project[],
    today: Date,
    horizonDays: number = 14,
): Project[] {
    return projects.map(project => {
        const activeRoutines = (project.routines ?? []).filter(r => r.active)
        if (activeRoutines.length === 0) return project

        const existingKeys = new Set<string>(
            project.tasks
                .filter(t => t.routineId && t.date)
                .map(t => `${t.routineId}:${t.date}`),
        )

        const newTasks: Task[] = []

        for (const routine of activeRoutines) {
            for (const date of getTargetDates(routine.recurrence, today, horizonDays)) {
                const dateStr = toIsoDateString(date)!
                const key = `${routine.id}:${dateStr}`
                if (!existingKeys.has(key)) {
                    existingKeys.add(key)
                    newTasks.push(createTaskFromRoutine(routine, dateStr))
                }
            }
        }

        if (newTasks.length === 0) return project

        return {
            ...project,
            tasks: [...project.tasks, ...newTasks],
            updatedAt: new Date().toISOString(),
        }
    })
}

export function cleanupOldInstances(projects: Project[], cutoffDays: number = 60): Project[] {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - cutoffDays)
    const cutoffStr = toIsoDateString(cutoff)!

    return projects.map(project => {
        const tasks = project.tasks.filter(t =>
            !t.routineId || !t.date || !t.completed || t.date >= cutoffStr,
        )
        if (tasks.length === project.tasks.length) return project
        return { ...project, tasks }
    })
}