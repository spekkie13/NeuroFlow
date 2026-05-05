import { User } from '@/app/models/User'

export type PlannerView = 'tasks' | 'today' | 'timeline' | 'settings'

export interface PlannerProps {
    user: User
    onSignOut: () => Promise<void>
}
