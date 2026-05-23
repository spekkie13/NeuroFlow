export interface ApiWorkspace {
    id: string
    userId: string
    name: string
    dailyMinutes: number | null
    createdAt: string
    updatedAt: string | null
    deletedAt: string | null
}

export interface ApiStep {
    id: string
    taskId: string
    text: string
    done: boolean
}

export interface ApiTask {
    id: string
    projectId: string
    name: string
    completed: boolean
    priority: 'high' | 'medium' | 'low'
    date: string | null
    notes: string
    estimatedMinutes: number | null
    routineId: string | null
    steps: ApiStep[]
    createdAt: string
    updatedAt: string | null
    deletedAt: string | null
}

export interface ApiRoutine {
    id: string
    name: string
    recurrence: {
        frequency: 'daily' | 'weekly' | 'monthly'
        daysOfWeek?: number[]
        dayOfMonth?: number
    }
    priority: 'high' | 'medium' | 'low'
    estimatedMinutes: number | null
    notes: string | null
    active: boolean
    createdAt: string
    updatedAt: string
}

export interface ApiProject {
    id: string
    workspaceId: string
    name: string
    color: string
    reminderTime: string | null
    tasks: ApiTask[]
    routines: ApiRoutine[]
    createdAt: string
    updatedAt: string | null
    deletedAt: string | null
}

export interface ApiSettings {
    userId: string
    globalReminderTime: string | null
    updatedAt: string | null
}

