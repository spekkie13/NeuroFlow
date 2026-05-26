import { FastifyInstance } from 'fastify'
import { requireAuth } from "../middleware/auth.js"
import {projectService} from "../services/projectService.js";
import {Project, Step, Task} from "../types/db.types";
import {taskService} from "../services/taskService.js";
import {stepService} from "../services/stepService.js";
import {randomUUID} from "crypto";

export async function projectRoutes(app: FastifyInstance) {
    app.get('/workspaces/:workspaceId/projects', { preHandler: requireAuth }, async (request, reply) => {
        const { workspaceId } = request.params as { workspaceId: string }
        const userId: string = request.user!.id;

        const projectList: Project[] = await projectService.getProjectsForWorkspace(userId, workspaceId);

        const result = await Promise.all(
            projectList.map(async (project) => {
                if (project.deletedAt) {
                    return { ...project, tasks: [] }
                }

                const taskList: Task[] = await taskService.getTasksByProject(userId, project.id);

                const tasksWithSteps: Task[] = await Promise.all(
                    taskList.map(async (task) => {
                        const stepList: Step[] = await stepService.getStepsByTask(userId, task.id);

                        return { ...task, steps: stepList }
                    })
                )

                return { ...project, tasks: tasksWithSteps }
            })
        )

        return reply.send(result)
    })

    app.post('/workspaces/:workspaceId/projects', { preHandler: requireAuth }, async (request, reply) => {
        const { workspaceId } = request.params as { workspaceId: string }
        const userId: string = request.user!.id;

        const { id, name, color, reminderTime, routines, tasks: tasksInput, updatedAt } = request.body as {
            id: string
            name: string
            color: string
            reminderTime?: string
            routines?: any[]
            tasks?: {
                id: string
                name: string
                completed: boolean
                priority?: 'high' | 'medium' | 'low'
                date?: string | null
                notes?: string
                estimatedMinutes?: number | null
                routineId?: string | null
                steps?: { id?: string; text: string; done?: boolean }[]
            }[]
            updatedAt?: string
        }

        const project: Project = await projectService.createProject(userId, id, workspaceId, name, color, reminderTime, routines, updatedAt);

        if (tasksInput) {
            await taskService.syncTasksForProject(userId, id, tasksInput)
            for (const task of tasksInput) {
                if (task.steps?.length) {
                    await stepService.syncStepsForTask(userId, task.id, task.steps.map(s => ({
                        id: s.id ?? randomUUID(),
                        text: s.text,
                        done: s.done ?? false,
                    })))
                }
            }
        }

        return reply.status(201).send(project)
    })

    app.patch('/workspaces/:workspaceId/projects/:id', { preHandler: requireAuth }, async (request, reply) => {
        const { id, workspaceId } = request.params as { workspaceId: string; id: string }
        const userId: string = request.user!.id;
        const { name, color, reminderTime } = request.body as {
            name?: string
            color?: string
            reminderTime?: string
        }

        await projectService.updateProject(userId, id, workspaceId, name, color, reminderTime);

        return reply.send({ success: true })
    })

    app.delete('/workspaces/:workspaceId/projects/:id', { preHandler: requireAuth }, async (request, reply) => {
        const { id } = request.params as { workspaceId: string; id: string }
        const userId: string = request.user!.id;

        await projectService.softDeleteProject(userId, id);

        return reply.status(201).send()
    })

    app.delete('/projects/:id', { preHandler: requireAuth }, async (request, reply) => {
        const { id } = request.params as { id: string }
        const userId: string = request.user!.id;

        await projectService.softDeleteProject(userId, id);

        return reply.status(201).send()
    })
}
