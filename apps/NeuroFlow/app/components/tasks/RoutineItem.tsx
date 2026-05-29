import React, {RefObject, useEffect, useRef, useState} from 'react'
import {Modal, StyleSheet, Switch, Text, TouchableOpacity, useWindowDimensions, View} from 'react-native'
import {MoreHorizontal, Pencil, Repeat2, Trash2} from 'lucide-react-native'
import {getRecurrenceLabel} from "../../services/domain/RoutineService"
import {RoutineItemProps} from "../../props/tasks/RoutineItemProps";
import {routineItemStyles} from "../../styles/tasks/routineItem.styles";
import {MenuItem} from "../ui/MenuItem";

export const RoutineItem: React.FC<RoutineItemProps> = ({routine, onToggleActive, onEdit, onDelete}: RoutineItemProps) => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const rowRef: RefObject<View> = useRef<View>(null)
    const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
    const { width: screenWidth, height: screenHeight } = useWindowDimensions()

    useEffect(() => {
        if (menuOpen) {
            requestAnimationFrame(() => {
                rowRef.current?.measureInWindow((x, y, width, height) => {
                    setMenuAnchor({ x, y, width, height })
                })
            })
        } else {
            setMenuAnchor(null)
        }
    }, [menuOpen])

    return (
        <View style={routineItemStyles.container}>
            <View ref={rowRef} style={routineItemStyles.row}>
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

            <Modal
                visible={menuOpen && !!menuAnchor}
                transparent
                animationType="none"
                onRequestClose={() => setMenuOpen(false)}
                statusBarTranslucent
            >
                <TouchableOpacity
                    style={StyleSheet.absoluteFillObject}
                    onPress={() => setMenuOpen(false)}
                    activeOpacity={1}
                />
                {menuAnchor && (() => {
                    const showAbove = menuAnchor.y + menuAnchor.height > screenHeight * 0.6
                    const right = screenWidth - (menuAnchor.x + menuAnchor.width)
                    const verticalPos = showAbove
                        ? { bottom: screenHeight - menuAnchor.y + 6 }
                        : { top: menuAnchor.y + menuAnchor.height + 6 }
                    return (
                        <View style={[routineItemStyles.inlineMenu, { position: 'absolute', right, ...verticalPos }]}>
                            <MenuItem
                                icon={<Pencil size={16} color="#374151" />}
                                label="Edit"
                                onPress={() => { setMenuOpen(false); onEdit() }}
                            />
                            <View style={routineItemStyles.inlineMenuDivider} />
                            <MenuItem
                                icon={<Trash2 size={16} color="#ef4444" />}
                                label="Delete"
                                danger
                                onPress={() => { setMenuOpen(false); onDelete() }}
                            />
                        </View>
                    )
                })()}
            </Modal>
        </View>
    )
}