// services/domain/timelineService.ts
import { Project, Task } from '../../utils/types'
import { doesTaskCoverDate, isTaskScheduled } from './TaskService'

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
