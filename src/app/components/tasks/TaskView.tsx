// components/tasks/TaskView.tsx
import React, { useMemo, useState } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import {Plus, CheckCircle2, Circle, Edit3, Trash2, ArrowUp, ArrowDown, Clock, Flag, X} from 'lucide-react-native'
import { Project, Task, Priority } from '../../utils/types'
import { AppButton } from '../ui/AppButton'
import { TextField } from '../ui/TextField'
import { IconButton } from '../ui/IconButton'
import { formatLocalDateRange, parseLocalDate, toIsoDateString } from '../../utils/dateUtils'
import { PriorityModal, RescheduleModal } from './TaskModals'
import { styles } from "@/app/styles/taskView";

export interface TaskViewProps {
    project: Project
    onAddTask: (task: Task) => void
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void
    onDeleteTask: (taskId: string) => void
    onMoveTask?: (taskId: string, direction: 'up' | 'down') => void
}

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

    const [priorityModalTask, setPriorityModalTask] =
        useState<Task | null>(null)

    const [rescheduleTask, setRescheduleTask] =
        useState<Task | null>(null)
    const [rescheduleStart, setRescheduleStart] = useState('')
    const [rescheduleEnd, setRescheduleEnd] = useState('')

    const today = useMemo(() => new Date(), [])

    const sortedTasks = useMemo(() => {
        const priorityOrder: Record<Priority, number> = {
            high: 0,
            medium: 1,
            low: 2,
        }

        const copy = [...project.tasks]

        copy.sort((a, b) => {
            // incomplete eerst
            if (a.completed && !b.completed) return 1
            if (!a.completed && b.completed) return -1

            // priority high -> low
            const priorityDifference =
                priorityOrder[a.priority] - priorityOrder[b.priority]
            if (priorityDifference !== 0) return priorityDifference

            return Number(a.id) - Number(b.id)
        })

        return copy
    }, [project.tasks])

    const completedCount = useMemo(
        () => project.tasks.filter((t) => t.completed).length,
        [project.tasks],
    )

    const handleAddTask = () => {
        const trimmed = newTaskName.trim()
        if (!trimmed) return

        const task: Task = {
            id: Date.now().toString(),
            name: trimmed,
            completed: false,
            priority: 'medium',
            startDate: null,
            endDate: null,
            notes: '',
        }

        onAddTask(task)
        setNewTaskName('')
    }

    const startEditing = (task: Task) => {
        setEditingTaskId(task.id)
        setEditTaskName(task.name)
    }

    const saveEdit = (taskId: string) => {
        const trimmed = editTaskName.trim()
        onUpdateTask(taskId, {
            name: trimmed || 'Untitled Task',
        })
        setEditingTaskId(null)
    }

    const toggleCompleted = (task: Task) => {
        onUpdateTask(task.id, { completed: !task.completed })
    }

    const openPriorityModal = (task: Task) => {
        setPriorityModalTask(task)
    }

    const handleSetPriority = (priority: Priority) => {
        if (!priorityModalTask) return
        onUpdateTask(priorityModalTask.id, { priority })
        setPriorityModalTask(null)
    }

    const openRescheduleModal = (task: Task) => {
        setRescheduleTask(task)

        if (task.startDate && task.endDate) {
            const range = formatLocalDateRange(
                task.startDate,
                task.endDate,
                true,
            ) as string[] | string

            if (Array.isArray(range)) {
                setRescheduleStart(range[0])
                setRescheduleEnd(range[1])
            } else {
                setRescheduleStart(range)
                setRescheduleEnd(range)
            }
        } else {
            setRescheduleStart('')
            setRescheduleEnd('')
        }
    }

    const handleSaveReschedule = () => {
        if (!rescheduleTask) return

        const start = parseLocalDate(rescheduleStart)
        const end = parseLocalDate(rescheduleEnd)

        if (!start || !end) return

        const startIso = toIsoDateString(start)!
        const endIso = toIsoDateString(end)!

        onUpdateTask(rescheduleTask.id, {
            startDate: startIso,
            endDate: endIso,
        })

        setRescheduleTask(null)
        setRescheduleStart('')
        setRescheduleEnd('')
    }

    const closeRescheduleModal = () => {
        setRescheduleTask(null)
        setRescheduleStart('')
        setRescheduleEnd('')
    }

    const isOverdue = (task: Task) => {
        if (!task.endDate || task.completed) return false
        return new Date(task.endDate) < today
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
                <Text
                    style={[styles.projectName, { color: project.color }]}
                >
                    {project.name}
                </Text>
                <View style={styles.headerMetaRow}>
                    <Text style={styles.headerMetaText}>
                        <Text style={styles.headerMetaNumber}>
                            {project.tasks.length}
                        </Text>{' '}
                        tasks
                    </Text>
                    <Text style={styles.headerMetaDot}>•</Text>
                    <Text style={styles.headerMetaText}>
                        <Text style={styles.headerMetaNumber}>{completedCount}</Text>{' '}
                        completed
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
            {sortedTasks.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>No tasks yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Add your first task to get started
                    </Text>
                </View>
            ) : (
                <View style={styles.list}>
                    {sortedTasks.map((task, index) => {
                        const rangeLabel = task.startDate
                            ? formatLocalDateRange(
                                task.startDate,
                                task.endDate || task.startDate,
                            )
                            : null

                        const overdue = isOverdue(task)

                        return (
                            <View key={task.id} style={styles.card}>
                                <View style={styles.cardRow}>
                                    {/* Checkbox */}
                                    <TouchableOpacity
                                        style={styles.checkbox}
                                        onPress={() => toggleCompleted(task)}
                                        activeOpacity={0.7}
                                        accessibilityLabel={
                                            task.completed
                                                ? 'Mark as incomplete'
                                                : 'Mark as complete'
                                        }
                                    >
                                        {task.completed ? (
                                            <CheckCircle2
                                                size={22}
                                                color="#22c55e"
                                            />
                                        ) : (
                                            <Circle size={22} color="#9ca3af" />
                                        )}
                                    </TouchableOpacity>

                                    {/* Content */}
                                    <View style={styles.cardContent}>
                                        {editingTaskId === task.id ? (
                                            <View style={styles.editRow}>
                                                <View style={{ flex: 1 }}>
                                                    <TextField
                                                        value={editTaskName}
                                                        onChangeText={setEditTaskName}
                                                        returnKeyType="done"
                                                        onSubmitEditing={() =>
                                                            saveEdit(task.id)
                                                        }
                                                    />
                                                </View>
                                                <IconButton
                                                    icon={
                                                        <CheckCircle2
                                                            size={20}
                                                            color="#16a34a"
                                                        />
                                                    }
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
                                                    <Text
                                                        style={[
                                                            styles.taskName,
                                                            task.completed &&
                                                            styles.taskNameCompleted,
                                                        ]}
                                                        numberOfLines={2}
                                                    >
                                                        {task.name}
                                                    </Text>
                                                    <View
                                                        style={[
                                                            styles.priorityBadge,
                                                            getPriorityBadgeStyle(
                                                                task.priority,
                                                            ),
                                                        ]}
                                                    >
                                                        <Flag size={11} color="#111827" />
                                                        <Text
                                                            style={styles.priorityText}
                                                        >
                                                            {task.priority}
                                                        </Text>
                                                    </View>
                                                </View>

                                                {rangeLabel && (
                                                    <View style={styles.dateRow}>
                                                        <Clock
                                                            size={14}
                                                            color={
                                                                overdue
                                                                    ? '#b91c1c'
                                                                    : '#6b7280'
                                                            }
                                                            style={{ marginRight: 4 }}
                                                        />
                                                        <Text
                                                            style={[
                                                                styles.dateText,
                                                                overdue &&
                                                                styles.dateTextOverdue,
                                                            ]}
                                                        >
                                                            {overdue ? 'Overdue · ' : ''}
                                                            {rangeLabel}
                                                        </Text>
                                                    </View>
                                                )}
                                            </>
                                        )}
                                    </View>

                                    {/* Actions */}
                                    {editingTaskId !== task.id && (
                                        <View style={styles.actions}>
                                            {/* Priority */}
                                            <IconButton
                                                icon={
                                                    <Flag size={18} color="#6b7280" />
                                                }
                                                variant="neutral"
                                                onPress={() => openPriorityModal(task)}
                                                accessibilityLabel="Set priority"
                                            />

                                            <IconButton
                                                icon={
                                                    <Clock
                                                        size={18}
                                                        color={
                                                            overdue ? '#b91c1c' : '#6b7280'
                                                        }
                                                    />
                                                }
                                                variant="neutral"
                                                onPress={() => openRescheduleModal(task)}
                                                accessibilityLabel="Reschedule task"
                                            />

                                            {/* Edit */}
                                            <IconButton
                                                icon={
                                                    <Edit3 size={18} color="#6b7280" />
                                                }
                                                variant="neutral"
                                                onPress={() => startEditing(task)}
                                                accessibilityLabel="Edit task"
                                            />

                                            {onMoveTask && (
                                                <>
                                                    <IconButton
                                                        icon={
                                                            <ArrowUp
                                                                size={18}
                                                                color={
                                                                    index === 0
                                                                        ? '#d1d5db'
                                                                        : '#6b7280'
                                                                }
                                                            />
                                                        }
                                                        variant="subtle"
                                                        onPress={() =>
                                                            index > 0 &&
                                                            onMoveTask(task.id, 'up')
                                                        }
                                                        disabled={index === 0}
                                                        accessibilityLabel="Move task up"
                                                    />
                                                    <IconButton
                                                        icon={
                                                            <ArrowDown
                                                                size={18}
                                                                color={
                                                                    index ===
                                                                    sortedTasks.length - 1
                                                                        ? '#d1d5db'
                                                                        : '#6b7280'
                                                                }
                                                            />
                                                        }
                                                        variant="subtle"
                                                        onPress={() =>
                                                            index <
                                                            sortedTasks.length - 1 &&
                                                            onMoveTask(task.id, 'down')
                                                        }
                                                        disabled={
                                                            index ===
                                                            sortedTasks.length - 1
                                                        }
                                                        accessibilityLabel="Move task down"
                                                    />
                                                </>
                                            )}

                                            {/* Delete */}
                                            <IconButton
                                                icon={
                                                    <Trash2 size={18} color="#ef4444" />
                                                }
                                                variant="danger"
                                                onPress={() => onDeleteTask(task.id)}
                                                accessibilityLabel="Delete task"
                                            />
                                        </View>
                                    )}
                                </View>
                            </View>
                        )
                    })}
                </View>
            )}

            {/* Priority modal */}
            <PriorityModal
                visible={!!priorityModalTask}
                taskName={priorityModalTask?.name}
                onSetPriority={handleSetPriority}
                onClose={() => setPriorityModalTask(null)}
            />

            {/* Reschedule modal */}
            <RescheduleModal
                visible={!!rescheduleTask}
                taskName={rescheduleTask?.name}
                startDate={rescheduleStart}
                onChangeStartDate={setRescheduleStart}
                onChangeEndDate={setRescheduleEnd}
                onSave={handleSaveReschedule}
                onCancel={closeRescheduleModal}
            />
        </View>
    )
}
