import { ComponentType } from 'react'
import { ViewType } from "@/app/props/ui/BottomNavProps";
import { Calendar, ListTodo, User as UserIcon } from "lucide-react-native";

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
        id: 'timeline' as ViewType,
        label: 'Timeline',
        icon: Calendar,
    },
    {
        id: 'settings' as ViewType,
        label: 'Settings',
        icon: UserIcon,
    },
]
