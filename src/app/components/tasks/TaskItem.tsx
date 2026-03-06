import React, { useEffect, useRef, useState } from 'react'
import { Animated, PanResponder, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ArrowDown, ArrowUp, CheckCircle2, Circle, Clock, Edit3, FileText, Flag, MoreHorizontal, Trash2, X } from 'lucide-react-native'
import { TextField } from '@/app/components/ui/TextField'
import { IconButton } from '@/app/components/ui/IconButton'
import { MenuItem } from '@/app/components/ui/MenuItem'
import { formatLocalDateRange, startOfDay } from '@/app/utils/dateUtils'
import { getPriorityStyle } from '@/app/utils/priorityUtils'
import { TaskItemProps } from '@/app/props/tasks/TaskItemProps'
import { styles } from '@/app/styles/taskView'

export const TaskItem: React.FC<TaskItemProps> = ({
    task,
    isEditing,
    editName,
    menuOpen,
    canMoveUp,
    canMoveDown,
    showMoveActions,
    onEditNameChange,
    onSaveEdit,
    onCancelEdit,
    onToggleComplete,
    onOpenPriorityModal,
    onOpenRescheduleModal,
    onToggleMenu,
    onStartEditing,
    onMoveUp,
    onMoveDown,
    onDelete,
    onSaveNotes,
}) => {
    const rangeLabel = task.date ? formatLocalDateRange(task.date, task.date) : null
    const overdue = !task.completed && !!task.date && startOfDay(new Date(task.date)) < startOfDay(new Date())

    const [notesExpanded, setNotesExpanded] = useState(false)
    const [localNotes, setLocalNotes] = useState(task.notes || '')

    useEffect(() => {
        setLocalNotes(task.notes || '')
    }, [task.notes])

    // Swipe-to-complete
    const swipeAnim = useRef(new Animated.Value(0)).current
    const menuOpenRef = useRef(menuOpen)
    const isEditingRef = useRef(isEditing)
    useEffect(() => { menuOpenRef.current = menuOpen }, [menuOpen])
    useEffect(() => { isEditingRef.current = isEditing }, [isEditing])

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, { dx, dy }) =>
                !menuOpenRef.current && !isEditingRef.current &&
                Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8,
            onPanResponderMove: (_, { dx }) => {
                swipeAnim.setValue(Math.max(0, dx))
            },
            onPanResponderRelease: (_, { dx }) => {
                if (dx > 80) {
                    Animated.timing(swipeAnim, { toValue: 350, duration: 150, useNativeDriver: true }).start(() => {
                        onToggleComplete()
                        swipeAnim.setValue(0)
                    })
                } else {
                    Animated.spring(swipeAnim, { toValue: 0, useNativeDriver: true }).start()
                }
            },
            onPanResponderTerminate: () => {
                Animated.spring(swipeAnim, { toValue: 0, useNativeDriver: true }).start()
            },
        })
    ).current

    return (
        <View style={[styles.taskItem, menuOpen && styles.taskItemMenuOpen]}>
            {/* Swipe background */}
            <View style={[StyleSheet.absoluteFillObject, task.completed ? styles.swipeBgUndo : styles.swipeBgComplete]}>
                <View style={styles.swipeBgContent}>
                    {task.completed
                        ? <X size={18} color="#fff" />
                        : <CheckCircle2 size={18} color="#fff" />
                    }
                    <Text style={styles.swipeBgLabel}>{task.completed ? 'Undo' : 'Done'}</Text>
                </View>
            </View>

            {/* Animated card layer */}
            <Animated.View
                style={[{ transform: [{ translateX: swipeAnim }] }, menuOpen && styles.taskItemInnerMenuOpen]}
                {...panResponder.panHandlers}
            >
                <View style={styles.taskItemInner}>
                    <View style={styles.card}>
                        <View style={styles.mainRow}>
                            {/* LEFT: title + date */}
                            <View style={styles.leftCol}>
                                {isEditing ? (
                                    <View style={styles.editRow}>
                                        <View style={{ flex: 1 }}>
                                            <TextField
                                                value={editName}
                                                onChangeText={onEditNameChange}
                                                returnKeyType="done"
                                                onSubmitEditing={onSaveEdit}
                                            />
                                        </View>
                                        <IconButton
                                            icon={<CheckCircle2 size={20} color="#16a34a" />}
                                            variant="success"
                                            onPress={onSaveEdit}
                                            accessibilityLabel="Save task name"
                                        />
                                        <IconButton
                                            icon={<X size={20} color="#6b7280" />}
                                            variant="subtle"
                                            onPress={onCancelEdit}
                                            accessibilityLabel="Cancel editing"
                                        />
                                    </View>
                                ) : (
                                    <>
                                        <View style={styles.titleRow}>
                                            <TouchableOpacity
                                                style={styles.checkbox}
                                                onPress={onToggleComplete}
                                                activeOpacity={0.7}
                                                accessibilityLabel={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                                            >
                                                {task.completed ? (
                                                    <CheckCircle2 size={22} color="#22c55e" />
                                                ) : (
                                                    <Circle size={22} color="#9ca3af" />
                                                )}
                                            </TouchableOpacity>

                                            <Text
                                                style={[styles.taskName, task.completed && styles.taskNameCompleted]}
                                                numberOfLines={2}
                                            >
                                                {task.name}
                                            </Text>
                                        </View>

                                        <View style={styles.dateRow}>
                                            {rangeLabel ? (
                                                <>
                                                    <Clock
                                                        size={14}
                                                        color={overdue ? '#b91c1c' : '#6b7280'}
                                                        style={{ marginRight: 4 }}
                                                    />
                                                    <Text style={[styles.dateText, overdue && styles.dateTextOverdue]}>
                                                        {overdue ? 'Overdue · ' : ''}
                                                        {rangeLabel}
                                                    </Text>
                                                </>
                                            ) : (
                                                <View style={styles.dateRowPlaceholder} />
                                            )}
                                        </View>
                                    </>
                                )}
                            </View>

                            {/* RIGHT: priority + actions */}
                            {!isEditing && (
                                <View style={styles.rightCol}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={onOpenPriorityModal}
                                        style={[styles.priorityBadge, getPriorityStyle(task.priority, styles.priorityHigh, styles.priorityMedium, styles.priorityLow)]}
                                        accessibilityLabel="Set priority"
                                    >
                                        <Flag size={11} color="#111827" />
                                        <Text style={styles.priorityText}>{task.priority}</Text>
                                    </TouchableOpacity>

                                    <View style={styles.actionsRow}>
                                        <IconButton
                                            icon={<FileText size={18} color={task.notes ? '#2563eb' : '#6b7280'} />}
                                            variant="neutral"
                                            onPress={() => setNotesExpanded(e => !e)}
                                            accessibilityLabel="Toggle notes"
                                        />
                                        <IconButton
                                            icon={<Clock size={18} color={overdue ? '#b91c1c' : '#6b7280'} />}
                                            variant="neutral"
                                            onPress={onOpenRescheduleModal}
                                            accessibilityLabel="Schedule / reschedule task"
                                        />
                                        <IconButton
                                            icon={<MoreHorizontal size={18} color="#6b7280" />}
                                            variant="neutral"
                                            onPress={onToggleMenu}
                                            accessibilityLabel="More actions"
                                        />
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Notes area */}
                        {notesExpanded && !isEditing && (
                            <View style={styles.notesArea}>
                                <TextInput
                                    style={styles.notesInput}
                                    value={localNotes}
                                    onChangeText={setLocalNotes}
                                    onBlur={() => onSaveNotes(localNotes)}
                                    placeholder="Add notes..."
                                    multiline
                                    numberOfLines={3}
                                    placeholderTextColor="#9ca3af"
                                />
                            </View>
                        )}
                    </View>

                    {/* Inline menu */}
                    {!isEditing && menuOpen && (
                        <View style={styles.inlineMenuOverlay} pointerEvents="box-none">
                            <View style={styles.inlineMenu}>
                                <MenuItem
                                    icon={<Edit3 size={16} color="#374151" />}
                                    label="Edit"
                                    onPress={onStartEditing}
                                />
                                <MenuItem
                                    icon={<Clock size={16} color="#374151" />}
                                    label={task.date ? 'Reschedule' : 'Schedule'}
                                    onPress={onOpenRescheduleModal}
                                />

                                {showMoveActions && (
                                    <>
                                        <View style={styles.inlineMenuDivider} />
                                        <MenuItem
                                            icon={<ArrowUp size={16} color={canMoveUp ? '#374151' : '#d1d5db'} />}
                                            label="Move up"
                                            disabled={!canMoveUp}
                                            onPress={onMoveUp}
                                        />
                                        <MenuItem
                                            icon={<ArrowDown size={16} color={canMoveDown ? '#374151' : '#d1d5db'} />}
                                            label="Move down"
                                            disabled={!canMoveDown}
                                            onPress={onMoveDown}
                                        />
                                    </>
                                )}

                                <View style={styles.inlineMenuDivider} />

                                <MenuItem
                                    icon={<Trash2 size={16} color="#ef4444" />}
                                    label="Delete"
                                    danger
                                    onPress={onDelete}
                                />
                            </View>
                        </View>
                    )}
                </View>
            </Animated.View>
        </View>
    )
}