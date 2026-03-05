import {Priority} from "@/app/models/Priority";

export interface Task {
    id: string
    name: string
    completed: boolean
    priority: Priority
    date: string | null
    notes: string
}
