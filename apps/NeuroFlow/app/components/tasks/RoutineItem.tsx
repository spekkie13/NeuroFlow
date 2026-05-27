import React, {useState} from 'react'
import {Switch, Text, TouchableOpacity, View} from 'react-native'
import {MoreHorizontal, Pencil, Repeat2, Trash2} from 'lucide-react-native'
import {getRecurrenceLabel} from "../../services/domain/RoutineService"
import {RoutineItemProps} from "../../props/tasks/RoutineItemProps";
import {routineItemStyles} from "../../styles/tasks/routineItem.styles";

export const RoutineItem: React.FC<RoutineItemProps> = ({routine, onToggleActive, onEdit, onDelete}: RoutineItemProps) => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false)

    return (
        <View style={routineItemStyles.container}>
            <View style={routineItemStyles.row}>
                <Repeat2 size={15} color="#6b7280" style={routineItemStyles.icon}/>
                <View style={routineItemStyles.info}>
                    <Text style={[routineItemStyles.name, !routine.active && routineItemStyles.nameInactive]} numberOfLines={1}>
                        {routine.name}
                    </Text>
                    <Text style={routineItemStyles.label}>
                        {getRecurrenceLabel(routine.recurrence)}
                        {(routine.steps?.length ?? 0) > 0 ? `  ·  ${routine.steps!.length} step${routine.steps!.length === 1 ? '' : 's'}` : ''}
                    </Text>
                </View>
                <Switch
                    value={routine.active}
                    onValueChange={onToggleActive}
                    trackColor={{false: '#e5e7eb', true: '#bfdbfe'}}
                    thumbColor={routine.active ? '#2563eb' : '#9ca3af'}
                    style={routineItemStyles.switch}
                />
                <TouchableOpacity
                    onPress={() => setMenuOpen(v => !v)}
                    style={routineItemStyles.menuButton}
                    hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
                >
                    <MoreHorizontal size={16} color="#9ca3af"/>
                </TouchableOpacity>
            </View>

            {menuOpen && (
                <View style={routineItemStyles.menu}>
                    <TouchableOpacity
                        style={routineItemStyles.menuItem}
                        onPress={() => { setMenuOpen(false); onEdit() }}
                    >
                        <Pencil size={14} color="#374151"/>
                        <Text style={routineItemStyles.menuItemText}>Edit</Text>
                    </TouchableOpacity>
                    <View style={routineItemStyles.menuDivider}/>
                    <TouchableOpacity
                        style={routineItemStyles.menuItem}
                        onPress={() => { setMenuOpen(false); onDelete() }}
                    >
                        <Trash2 size={14} color="#ef4444"/>
                        <Text style={[routineItemStyles.menuItemText, routineItemStyles.menuItemDanger]}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}
