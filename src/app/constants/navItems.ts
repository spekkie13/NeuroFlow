import {ViewType} from "@/app/props/BottomNavProps";
import {Calendar, ListTodo, User as UserIcon} from "lucide-react-native";

export const navItems = [
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
