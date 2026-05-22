import {Priority} from "./Priority";

export interface Step {
    id: string
    text: string
    done: boolean
}

export interface Task {
    id: string
    name: string
    completed: boolean
    priority: Priority
    date: string | null
    notes: string
    steps?: Step[]
    estimatedMinutes?: number
    routineId?: string
    createdAt?: string
    updatedAt?: string
}
