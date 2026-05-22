import {Priority} from "./Priority";

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly'

export interface RecurrenceRule {
    frequency: RecurrenceFrequency
    daysOfWeek?: number[]  // 0=Sun … 6=Sat; used when frequency='weekly'
    dayOfMonth?: number    // 1–28; used when frequency='monthly'
}

export interface Routine {
    id: string
    name: string
    recurrence: RecurrenceRule
    priority: Priority
    estimatedMinutes?: number
    notes?: string
    active: boolean
    createdAt: string
    updatedAt: string
}