import { User } from '@/app/models/User'

export type PlannerView = 'tasks' | 'timeline' | 'settings'

export interface PlannerProps {
    user: User
    onSignOut: () => Promise<void>
}
