import { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import {projects, steps, tasks, userSettings, workspaces} from "../db/schema.js";

export type Workspace = InferSelectModel<typeof workspaces>
export type Project = InferSelectModel<typeof projects>
export type Task = InferSelectModel<typeof tasks>
export type Step = InferSelectModel<typeof steps>
export type UserSettings = InferInsertModel<typeof userSettings>

export type WorkspaceInsert = InferInsertModel<typeof workspaces>
export type ProjectInsert = InferInsertModel<typeof projects>
export type TaskInsert = InferInsertModel<typeof tasks>
export type StepInsert = InferInsertModel<typeof steps>
export type UserSettingsInsert = InferInsertModel<typeof userSettings>

export type ProjectUpdate = Omit<ProjectInsert, 'name' | 'color' | 'reminderTime'> & {
    name?: string,
    color?: string,
    reminderTime?: string
}
export type TaskUpdate = Omit<TaskInsert, 'projectId'>
export type StepUpdate = Omit<StepInsert, 'text'> & {
    text?: string
}
