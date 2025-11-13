import {User} from "@/app/utils/auth";

export interface PlannerProps {
    user: User;
    onLogout: () => void;
}
