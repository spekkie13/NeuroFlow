import {Priority} from "@/app/models/Priority";

export interface Task {
    id: string
    name: string
    completed: boolean
    priority: Priority
    startDate: string | null
    endDate: string | null
    notes: string
}
