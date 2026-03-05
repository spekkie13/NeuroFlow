import React from 'react'
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { ListTodo, Calendar, User as UserIcon } from 'lucide-react-native'
import { BottomNavProps, ViewType } from "@/app/props/ui/BottomNavProps";
import { styles } from "@/app/styles/bottomNav";
import {navItems} from "@/app/constants/navItems";

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange }: BottomNavProps) => {
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

export default BottomNav;
