import React, {useState} from 'react'
import {StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native'
import {MoreHorizontal, Pencil, Repeat2, Trash2} from 'lucide-react-native'
import {Routine} from "../../models"
import {getRecurrenceLabel} from "../../services/domain/RoutineService"

interface RoutineItemProps {
    routine: Routine
    onToggleActive: (active: boolean) => void
    onEdit: () => void
    onDelete: () => void
}

export const RoutineItem: React.FC<RoutineItemProps> = ({routine, onToggleActive, onEdit, onDelete}) => {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Repeat2 size={15} color="#6b7280" style={styles.icon}/>
                <View style={styles.info}>
                    <Text style={[styles.name, !routine.active && styles.nameInactive]} numberOfLines={1}>
                        {routine.name}
                    </Text>
                    <Text style={styles.label}>{getRecurrenceLabel(routine.recurrence)}</Text>
                </View>
                <Switch
                    value={routine.active}
                    onValueChange={onToggleActive}
                    trackColor={{false: '#e5e7eb', true: '#bfdbfe'}}
                    thumbColor={routine.active ? '#2563eb' : '#9ca3af'}
                    style={styles.switch}
                />
                <TouchableOpacity
                    onPress={() => setMenuOpen(v => !v)}
                    style={styles.menuButton}
                    hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
                >
                    <MoreHorizontal size={16} color="#9ca3af"/>
                </TouchableOpacity>
            </View>

            {menuOpen && (
                <View style={styles.menu}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => { setMenuOpen(false); onEdit() }}
                    >
                        <Pencil size={14} color="#374151"/>
                        <Text style={styles.menuItemText}>Edit</Text>
                    </TouchableOpacity>
                    <View style={styles.menuDivider}/>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => { setMenuOpen(false); onDelete() }}
                    >
                        <Trash2 size={14} color="#ef4444"/>
                        <Text style={[styles.menuItemText, styles.menuItemDanger]}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9fafb',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginBottom: 6,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    icon: {
        marginRight: 10,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    nameInactive: {
        color: '#9ca3af',
    },
    label: {
        fontSize: 11,
        color: '#6b7280',
        marginTop: 1,
    },
    switch: {
        marginLeft: 8,
        transform: [{scaleX: 0.8}, {scaleY: 0.8}],
    },
    menuButton: {
        marginLeft: 8,
        padding: 2,
    },
    menu: {
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        backgroundColor: '#ffffff',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        gap: 8,
    },
    menuItemText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
    },
    menuItemDanger: {
        color: '#ef4444',
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#f3f4f6',
        marginHorizontal: 14,
    },
})
