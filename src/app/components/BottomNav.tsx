// components/BottomNav.tsx
import React from 'react'
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { ListTodo, Calendar, User as UserIcon } from 'lucide-react-native'
import { BottomNavProps, ViewType } from "@/app/props/BottomNavProps";
import {styles} from "@/app/styles/bottomNav";

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange }: BottomNavProps) => {
    const navItems = [
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
            id: 'account' as ViewType,
            label: 'Account',
            icon: UserIcon,
        },
    ]

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.navContainer}>
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = currentView === item.id

                    return (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => onViewChange(item.id)}
                            style={styles.navItem}
                            activeOpacity={0.7}
                        >
                            <Icon
                                size={24}
                                strokeWidth={isActive ? 2.5 : 2}
                                color={isActive ? '#2563eb' : '#6b7280'}
                            />
                            <Text
                                style={[
                                    styles.label,
                                    isActive ? styles.labelActive : styles.labelInactive,
                                ]}
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </SafeAreaView>
    )
}
