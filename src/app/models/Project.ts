import {Task} from "@/app/models/Task";

export interface Project {
    id: string
    name: string
    tasks: Task[]
    color: string
    reminderTime?: string | null
    createdAt?: string
    updatedAt?: string
}
