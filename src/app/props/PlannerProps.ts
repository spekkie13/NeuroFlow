import {User} from "@/app/utils/types";

export type PlannerView = 'tasks' | 'timeline' | 'account'

export interface PlannerProps {
    user: User
}
