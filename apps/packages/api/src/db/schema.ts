import { pgTable, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core'

export const workspaces = pgTable('workspaces', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    name: text('name').notNull(),
    dailyMinutes: integer('daily_minutes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
})

export const projects = pgTable('projects', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    color: text('color').notNull(),
    reminderTime: text('reminder_time'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
})

export const tasks = pgTable('tasks', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    completed: boolean('completed').default(false).notNull(),
    priority: text('priority', { enum: ['high', 'medium', 'low'] }).default('medium').notNull(),
    date: text('date'),
    notes: text('notes').default('').notNull(),
    estimatedMinutes: integer('estimated_minutes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
})

export const steps = pgTable('steps', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    taskId: text('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
    text: text('text').notNull(),
    done: boolean('done').default(false).notNull(),
})

export const userSettings = pgTable('user_settings', {
    userId: text('user_id').primaryKey(),
    globalReminderTime: text('global_reminder_time'),
    updatedAt: timestamp('updated_at').defaultNow(),
})
