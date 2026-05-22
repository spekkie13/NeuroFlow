import {Task} from "./Task";
import {Routine} from "./Routine";

export interface Project {
    id: string
    name: string
    tasks: Task[]
    routines?: Routine[]
    color: string
    reminderTime?: string | null
    createdAt?: string
    updatedAt?: string
}
