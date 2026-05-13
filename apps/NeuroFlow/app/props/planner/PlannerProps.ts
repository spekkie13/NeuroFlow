import {User} from "../../models";

export type PlannerView = 'tasks' | 'today' | 'timeline' | 'settings'

export interface PlannerProps {
    user: User
    onSignOut: () => Promise<void>
}
