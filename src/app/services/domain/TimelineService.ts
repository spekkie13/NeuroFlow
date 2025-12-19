// services/domain/timelineService.ts
import { doesTaskCoverDate, isTaskScheduled } from './TaskService'
import { Project } from "@/app/models/Project";
import { Task } from "@/app/models/Task";

export interface TimelineDay {
    date: Date
    tasks: Task[]
}

export function getUnscheduledTasks(project: Project): Task[] {
    return project.tasks.filter((t) => !isTaskScheduled(t))
}

export function buildTimelineDaysForProject(
    project: Project,
    days: number,
    startDate: Date = new Date(),
): TimelineDay[] {
    const dates = Array.from({ length: days }, (_, i) => {
        const d = new Date(startDate)
        d.setDate(startDate.getDate() + i)
        return d
    })

    return dates.map((date) => ({
        date,
        tasks: project.tasks.filter((task) => doesTaskCoverDate(task, date)),
    }))
}
