import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { ArrowDown, ArrowUp, CheckCircle2, Circle, Clock, Edit3, Flag, MoreHorizontal, Trash2, X } from 'lucide-react-native'
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
}) => {
    const rangeLabel = task.date ? formatLocalDateRange(task.date, task.date) : null
    const overdue = !task.completed && !!task.date && startOfDay(new Date(task.date)) < startOfDay(new Date())

    return (
        <View style={[styles.taskItem, menuOpen && styles.taskItemMenuOpen]}>
            <View style={[styles.taskItemInner, menuOpen && styles.taskItemInnerMenuOpen]}>
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
                </View>

                {/* Inline menu — absolute positioned so it doesn't push tasks down */}
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
        </View>
    )
}