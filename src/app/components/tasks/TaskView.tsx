import React, { useMemo, useState } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { Plus, CheckCircle2, Circle, Edit3, Trash2, ArrowUp, ArrowDown, Clock, Flag, X, MoreHorizontal } from 'lucide-react-native'
import { AppButton } from '@/app/components/ui/AppButton'
import { TextField } from '@/app/components/ui/TextField'
import { IconButton } from '@/app/components/ui/IconButton'
import { MenuItem } from '@/app/components/ui/MenuItem'
import { PriorityModal } from '@/app/components/tasks/PriorityModal'
import { RescheduleModal } from '@/app/components/tasks/RescheduleModal'
import { formatLocalDateRange, parseLocalDate, toIsoDateString, startOfDay } from '@/app/utils/dateUtils'
import { Priority } from '@/app/models/Priority'
import { Task } from '@/app/models/Task'
import { TaskViewProps } from '@/app/props/TaskViewProps'
import { styles } from '@/app/styles/taskView'

export const TaskView: React.FC<TaskViewProps> = ({
                                                      project,
                                                      onAddTask,
                                                      onUpdateTask,
                                                      onDeleteTask,
                                                      onMoveTask,
                                                  }) => {
    const [newTaskName, setNewTaskName] = useState('')
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
    const [editTaskName, setEditTaskName] = useState('')

    const [priorityModalTask, setPriorityModalTask] = useState<Task | null>(null)

    const [rescheduleTask, setRescheduleTask] = useState<Task | null>(null)
    const [rescheduleStart, setRescheduleStart] = useState('')

    const [openMenuTaskId, setOpenMenuTaskId] = useState<string | null>(null)

    const today = useMemo(() => new Date(), [])
    const orderedTasks = useMemo(() => {
        return [...project.tasks]
    }, [project.tasks])

    const completedCount = useMemo(
        () => project.tasks.filter((t) => t.completed).length,
        [project.tasks],
    )

    const closeMenu = () => setOpenMenuTaskId(null)

    const toggleMenu = (taskId: string) => {
        setOpenMenuTaskId((prev) => (prev === taskId ? null : taskId))
    }

    const handleAddTask = () => {
        const trimmed = newTaskName.trim()
        if (!trimmed) return

        const task: Task = {
            id: Date.now().toString(),
            name: trimmed,
            completed: false,
            priority: 'medium',
            date: null,
            notes: '',
        }

        onAddTask(task)
        setNewTaskName('')
    }

    const startEditing = (task: Task) => {
        closeMenu()
        setEditingTaskId(task.id)
        setEditTaskName(task.name)
    }

    const saveEdit = (taskId: string) => {
        const trimmed = editTaskName.trim()
        onUpdateTask(taskId, { name: trimmed || 'Untitled Task' })
        setEditingTaskId(null)
    }

    const toggleCompleted = (task: Task) => {
        closeMenu()
        onUpdateTask(task.id, { completed: !task.completed })
    }

    const openPriorityModal = (task: Task) => {
        closeMenu()
        setPriorityModalTask(task)
    }

    const handleSetPriority = (priority: Priority) => {
        if (!priorityModalTask) return
        onUpdateTask(priorityModalTask.id, { priority })
        setPriorityModalTask(null)
    }

    const openRescheduleModal = (task: Task) => {
        closeMenu()
        setRescheduleTask(task)
        if (task.date) {
            const val = formatLocalDateRange(task.date, task.date, true)
            setRescheduleStart(Array.isArray(val) ? val[0] : val as string)
        } else {
            setRescheduleStart('')
        }
    }

    const handleSaveReschedule = () => {
        if (!rescheduleTask) return
        const start = parseLocalDate(rescheduleStart)
        if (!start) return
        onUpdateTask(rescheduleTask.id, { date: toIsoDateString(start)! })
        setRescheduleTask(null)
        setRescheduleStart('')
    }

    const closeRescheduleModal = () => {
        setRescheduleTask(null)
        setRescheduleStart('')
    }

    const isOverdue = (task: Task) => {
        if (!task.date || task.completed) return false
        return startOfDay(new Date(task.date)) < startOfDay(today)
    }

    const getPriorityBadgeStyle = (priority: Priority) => {
        switch (priority) {
            case 'high':
                return styles.priorityHigh
            case 'medium':
                return styles.priorityMedium
            case 'low':
                return styles.priorityLow
        }
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.projectName, { color: project.color }]}>{project.name}</Text>
                <View style={styles.headerMetaRow}>
                    <Text style={styles.headerMetaText}>
                        <Text style={styles.headerMetaNumber}>{project.tasks.length}</Text> tasks
                    </Text>
                    <Text style={styles.headerMetaDot}>•</Text>
                    <Text style={styles.headerMetaText}>
                        <Text style={styles.headerMetaNumber}>{completedCount}</Text> completed
                    </Text>
                </View>
            </View>

            {/* Add task */}
            <View style={styles.addRow}>
                <View style={{ flex: 1 }}>
                    <TextField
                        value={newTaskName}
                        onChangeText={setNewTaskName}
                        placeholder="Add a new task..."
                        returnKeyType="done"
                        onSubmitEditing={handleAddTask}
                    />
                </View>

                <View style={{ marginLeft: 8 }}>
                    <AppButton
                        title=""
                        variant="primary"
                        size="md"
                        onPress={handleAddTask}
                        disabled={!newTaskName.trim()}
                        leftIcon={<Plus size={18} color="#ffffff" />}
                    />
                </View>
            </View>

            {/* Task list */}
            {orderedTasks.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>No tasks yet</Text>
                    <Text style={styles.emptySubtitle}>Add your first task to get started</Text>
                </View>
            ) : (
                <View style={styles.list}>
                    {orderedTasks.map((task, index) => {
                        const rangeLabel = task.date
                            ? formatLocalDateRange(task.date, task.date)
                            : null

                        const overdue = isOverdue(task)
                        const menuOpen = openMenuTaskId === task.id

                        const canMoveUp = !!onMoveTask && index > 0
                        const canMoveDown = !!onMoveTask && index < orderedTasks.length - 1

                        return (
                            <View
                                key={task.id}
                                style={[styles.taskItem, menuOpen && styles.taskItemMenuOpen]}
                            >
                                <View
                                    style={[styles.taskItemInner, menuOpen && styles.taskItemInnerMenuOpen]}
                                >
                                    <View style={styles.card}>
                                        <View style={styles.mainRow}>
                                            {/* LEFT: title + date */}
                                            <View style={styles.leftCol}>
                                                {editingTaskId === task.id ? (
                                                    <View style={styles.editRow}>
                                                        <View style={{ flex: 1 }}>
                                                            <TextField
                                                                value={editTaskName}
                                                                onChangeText={setEditTaskName}
                                                                returnKeyType="done"
                                                                onSubmitEditing={() => saveEdit(task.id)}
                                                            />
                                                        </View>
                                                        <IconButton
                                                            icon={<CheckCircle2 size={20} color="#16a34a" />}
                                                            variant="success"
                                                            onPress={() => saveEdit(task.id)}
                                                            accessibilityLabel="Save task name"
                                                        />
                                                        <IconButton
                                                            icon={<X size={20} color="#6b7280" />}
                                                            variant="subtle"
                                                            onPress={() => setEditingTaskId(null)}
                                                            accessibilityLabel="Cancel editing"
                                                        />
                                                    </View>
                                                ) : (
                                                    <>
                                                        <View style={styles.titleRow}>
                                                            <TouchableOpacity
                                                                style={styles.checkbox}
                                                                onPress={() => toggleCompleted(task)}
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

                                            {/* RIGHT: priority + actions (same row, centered) */}
                                            {editingTaskId !== task.id && (
                                                <View style={styles.rightCol}>
                                                    <TouchableOpacity
                                                        activeOpacity={0.8}
                                                        onPress={() => openPriorityModal(task)}
                                                        style={[styles.priorityBadge, getPriorityBadgeStyle(task.priority)]}
                                                        accessibilityLabel="Set priority"
                                                    >
                                                        <Flag size={11} color="#111827" />
                                                        <Text style={styles.priorityText}>{task.priority}</Text>
                                                    </TouchableOpacity>

                                                    <View style={styles.actionsRow}>
                                                        <IconButton
                                                            icon={<Clock size={18} color={overdue ? '#b91c1c' : '#6b7280'} />}
                                                            variant="neutral"
                                                            onPress={() => openRescheduleModal(task)}
                                                            accessibilityLabel="Schedule / reschedule task"
                                                        />
                                                        <IconButton
                                                            icon={<MoreHorizontal size={18} color="#6b7280" />}
                                                            variant="neutral"
                                                            onPress={() => toggleMenu(task.id)}
                                                            accessibilityLabel="More actions"
                                                        />
                                                    </View>
                                                </View>
                                            )}
                                        </View>
                                    </View>

                                    {/* ✅ ABSOLUTE menu => does NOT push next task down */}
                                    {editingTaskId !== task.id && menuOpen && (
                                        <View style={styles.inlineMenuOverlay} pointerEvents="box-none">
                                            <View style={styles.inlineMenu}>
                                                <MenuItem
                                                    icon={<Edit3 size={16} color="#374151" />}
                                                    label="Edit"
                                                    onPress={() => startEditing(task)}
                                                />

                                                <MenuItem
                                                    icon={<Clock size={16} color="#374151" />}
                                                    label={task.date ? 'Reschedule' : 'Schedule'}
                                                    onPress={() => openRescheduleModal(task)}
                                                />

                                                {onMoveTask ? (
                                                    <>
                                                        <View style={styles.inlineMenuDivider} />
                                                        <MenuItem
                                                            icon={<ArrowUp size={16} color={canMoveUp ? '#374151' : '#d1d5db'} />}
                                                            label="Move up"
                                                            disabled={!canMoveUp}
                                                            onPress={() => {
                                                                closeMenu()
                                                                onMoveTask?.(task.id, 'up')
                                                            }}
                                                        />
                                                        <MenuItem
                                                            icon={<ArrowDown size={16} color={canMoveDown ? '#374151' : '#d1d5db'} />}
                                                            label="Move down"
                                                            disabled={!canMoveDown}
                                                            onPress={() => {
                                                                closeMenu()
                                                                onMoveTask?.(task.id, 'down')
                                                            }}
                                                        />
                                                    </>
                                                ) : null}

                                                <View style={styles.inlineMenuDivider} />

                                                <MenuItem
                                                    icon={<Trash2 size={16} color="#ef4444" />}
                                                    label="Delete"
                                                    danger
                                                    onPress={() => {
                                                        closeMenu()
                                                        onDeleteTask(task.id)
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )
                    })}
                </View>
            )}

            <PriorityModal
                visible={!!priorityModalTask}
                taskName={priorityModalTask?.name}
                onSetPriority={handleSetPriority}
                onClose={() => setPriorityModalTask(null)}
            />

            <RescheduleModal
                visible={!!rescheduleTask}
                taskName={rescheduleTask?.name}
                date={rescheduleStart}
                onChangeDate={setRescheduleStart}
                onSave={handleSaveReschedule}
                onCancel={closeRescheduleModal}
            />
        </View>
    )
}
