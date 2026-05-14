import { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import {projects, steps, tasks, workspaces} from "../db/schema";

export type Workspace = InferSelectModel<typeof workspaces>
export type Project = InferSelectModel<typeof projects>
export type Task = InferSelectModel<typeof tasks>
export type Step = InferSelectModel<typeof steps>

export type WorkspaceInsert = InferInsertModel<typeof workspaces>
export type ProjectInsert = InferInsertModel<typeof projects>
export type TaskInsert = InferInsertModel<typeof tasks>
export type StepInsert = InferInsertModel<typeof steps>

export type TaskUpdate = Omit<TaskInsert, 'projectId'>
export type StepUpdate = Omit<StepInsert, 'text'> & {
    text?: string
}
