import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {
    ListTodo as ListTodoIcon,
    Calendar as CalendarIcon,
    User as UserIcon, CogIcon,
} from 'lucide-react-native';

type ViewType = 'tasks' | 'timeline' | 'account' | 'settings';

interface BottomNavProps {
    currentView: ViewType;
    onViewChange: (view: ViewType) => void;
}

export default function BottomNav({ currentView, onViewChange }: BottomNavProps) {
    const navItems = [
        { id: 'tasks' as ViewType, label: 'Tasks', icon: ListTodoIcon },
        { id: 'timeline' as ViewType, label: 'Timeline', icon: CalendarIcon },
        { id: 'account' as ViewType, label: 'Account', icon: UserIcon },
        { id: 'settings' as ViewType, label: 'Settings', icon: CogIcon },
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

const styles = StyleSheet.create({
    navContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 50,
    },
    navInner: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 64,
        paddingHorizontal: 16,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navLabel: {
        fontSize: 11,
        marginTop: 4,
        color: '#6B7280',
        fontWeight: '500',
    },
    navLabelActive: {
        color: '#2563EB',
        fontWeight: '600',
    },
});
