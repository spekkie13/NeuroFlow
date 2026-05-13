import { ComponentType } from 'react'
import { Calendar, ListTodo, Sun, User as UserIcon } from "lucide-react-native";
import {ViewType} from "../props/ui/BottomNavProps";

type NavItem = {
    id: ViewType
    label: string
    icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>
}

export const navItems: NavItem[] = [
    {
        id: 'tasks' as ViewType,
        label: 'Tasks',
        icon: ListTodo,
    },
    {
        id: 'today' as ViewType,
        label: 'Today',
        icon: Sun,
    },
    {
        id: 'timeline' as ViewType,
        label: 'Timeline',
        icon: Calendar,
    },
    {
        id: 'settings' as ViewType,
        label: 'Workspaces',
        icon: UserIcon,
    },
]
