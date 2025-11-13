import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ListTodo, Calendar, User, Cog } from 'lucide-react-native';
import { styles } from "@/styles/bottomNav";
import { ViewType } from "@/types/ViewType";
import { BottomNavProps } from "@/props/BottomNavProps";


export default function BottomNav({ currentView, onViewChange }: BottomNavProps) {
    const navItems = [
        { id: 'tasks' as ViewType, label: 'Tasks', icon: ListTodo },
        { id: 'timeline' as ViewType, label: 'Timeline', icon: Calendar },
        { id: 'account' as ViewType, label: 'Account', icon: User },
        { id: 'settings' as ViewType, label: 'Settings', icon: Cog },
    ];

    return (
        <View style={styles.navContainer}>
            <View style={styles.navInner}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                        <Pressable
                            key={item.id}
                            onPress={() => onViewChange(item.id)}
                            style={({ pressed }) => [
                                styles.navItem,
                                pressed && { opacity: 0.8 },
                            ]}
                            accessibilityLabel={item.label}
                        >
                            <Icon
                                size={24}
                                strokeWidth={isActive ? 2.5 : 2}
                                color={isActive ? '#2563EB' : '#6B7280'}
                            />
                            <Text
                                style={[
                                    styles.navLabel,
                                    isActive && styles.navLabelActive,
                                ]}
                            >
                                {item.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}
