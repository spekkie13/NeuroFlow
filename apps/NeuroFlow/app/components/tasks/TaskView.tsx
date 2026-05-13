import React, { useMemo, useState } from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import { Plus, ChevronDown, ChevronUp } from 'lucide-react-native'
import {TaskViewProps} from "../../props/tasks/TaskViewProps";
import {createTask} from "../../services/domain/TaskService";
import {Priority, Task} from "../../models";
import {formatLocalDate, parseLocalDate, toIsoDateString} from "../../utils/dateUtils";
import {TaskItem} from "./TaskItem";
import {styles} from "../../styles/taskView";
import {TextField} from "../ui/TextField";
import {AppButton} from "../ui/AppButton";
import {PriorityModal} from "./PriorityModal";
import {RescheduleModal} from "./RescheduleModal";
import {EstimateModal} from "./EstimateModal";

type FilterMode = 'all' | 'active' | 'completed'

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
    const [filterMode, setFilterMode] = useState<FilterMode>('all')
    const [showCompleted, setShowCompleted] = useState(true)

    const [priorityModalTask, setPriorityModalTask] = useState<Task | null>(null)
    const [rescheduleTask, setRescheduleTask] = useState<Task | null>(null)
    const [rescheduleStart, setRescheduleStart] = useState('')
    const [openMenuTaskId, setOpenMenuTaskId] = useState<string | null>(null)
    const [estimateModalTask, setEstimateModalTask] = useState<Task | null>(null)

    const activeTasks = useMemo(() => project.tasks.filter(t => !t.completed), [project.tasks])
    const completedTasks = useMemo(() => project.tasks.filter(t => t.completed), [project.tasks])

    const toggleMenu = (taskId: string) => {
        setOpenMenuTaskId((prev) => (prev === taskId ? null : taskId))
    }

    const handleAddTask = () => {
        const trimmed = newTaskName.trim()
        if (!trimmed) return
        onAddTask(createTask({ name: trimmed }))
        setNewTaskName('')
    }

    const startEditing = (task: Task) => {
        setOpenMenuTaskId(null)
        setEditingTaskId(task.id)
        setEditTaskName(task.name)
    }

    const saveEdit = (taskId: string) => {
        const trimmed = editTaskName.trim()
        onUpdateTask(taskId, { name: trimmed || 'Untitled Task' })
        setEditingTaskId(null)
    }

    const toggleCompleted = (task: Task) => {
        setOpenMenuTaskId(null)
        onUpdateTask(task.id, { completed: !task.completed })
    }

    const openPriorityModal = (task: Task) => {
        setOpenMenuTaskId(null)
        setPriorityModalTask(task)
    }

    const handleSetPriority = (priority: Priority) => {
        if (!priorityModalTask) return
        onUpdateTask(priorityModalTask.id, { priority })
        setPriorityModalTask(null)
    }

    const openEstimateModal = (task: Task) => {
        setOpenMenuTaskId(null)
        setEstimateModalTask(task)
    }

    const handleSetEstimate = (minutes: number | null) => {
        if (!estimateModalTask) return
        onUpdateTask(estimateModalTask.id, { estimatedMinutes: minutes ?? undefined })
        setEstimateModalTask(null)
    }

    const openRescheduleModal = (task: Task) => {
        setOpenMenuTaskId(null)
        setRescheduleTask(task)
        setRescheduleStart(task.date ? formatLocalDate(task.date) : '')
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

    const renderTaskItem = (task: Task, index: number, list: Task[]) => (
        <TaskItem
            key={task.id}
            task={task}
            isEditing={editingTaskId === task.id}
            editName={editTaskName}
            menuOpen={openMenuTaskId === task.id}
            canMoveUp={!!onMoveTask && index > 0}
            canMoveDown={!!onMoveTask && index < list.length - 1}
            canMoveToTop={!!onMoveTask && index > 0}
            canMoveToBottom={!!onMoveTask && index < list.length - 1}
            showMoveActions={!!onMoveTask}
            onEditNameChange={setEditTaskName}
            onSaveEdit={() => saveEdit(task.id)}
            onCancelEdit={() => setEditingTaskId(null)}
            onToggleComplete={() => toggleCompleted(task)}
            onOpenPriorityModal={() => openPriorityModal(task)}
            onOpenRescheduleModal={() => openRescheduleModal(task)}
            onToggleMenu={() => toggleMenu(task.id)}
            onStartEditing={() => startEditing(task)}
            onMoveUp={() => { setOpenMenuTaskId(null); onMoveTask?.(task.id, 'up') }}
            onMoveDown={() => { setOpenMenuTaskId(null); onMoveTask?.(task.id, 'down') }}
            onMoveToTop={() => { setOpenMenuTaskId(null); onMoveTask?.(task.id, 'top') }}
            onMoveToBottom={() => { setOpenMenuTaskId(null); onMoveTask?.(task.id, 'bottom') }}
            onDelete={() => { setOpenMenuTaskId(null); onDeleteTask(task.id) }}
            onSaveNotes={(notes) => onUpdateTask(task.id, { notes })}
            onSaveSteps={(steps) => onUpdateTask(task.id, { steps })}
            onOpenEstimateModal={() => openEstimateModal(task)}
        />
    )

    const displayActive = filterMode !== 'completed' ? activeTasks : []
    const displayCompleted = filterMode !== 'active' ? completedTasks : []
    const isEmpty = displayActive.length === 0 && displayCompleted.length === 0

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
                        <Text style={styles.headerMetaNumber}>{completedTasks.length}</Text> completed
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

            {/* Filter bar */}
            {project.tasks.length > 0 && (
                <View style={styles.filterBar}>
                    {(['all', 'active', 'completed'] as FilterMode[]).map((mode) => (
                        <TouchableOpacity
                            key={mode}
                            style={[styles.filterChip, filterMode === mode && styles.filterChipActive]}
                            onPress={() => setFilterMode(mode)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.filterChipText, filterMode === mode && styles.filterChipTextActive]}>
                                {mode === 'all' ? `All (${project.tasks.length})` : mode === 'active' ? `Active (${activeTasks.length})` : `Done (${completedTasks.length})`}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Task list */}
            {project.tasks.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>No tasks yet</Text>
                    <Text style={styles.emptySubtitle}>Add your first task to get started</Text>
                </View>
            ) : isEmpty ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>No {filterMode} tasks</Text>
                </View>
            ) : (
                <View style={styles.list}>
                    {displayActive.map((task, i) => renderTaskItem(task, i, displayActive))}

                    {filterMode === 'all' && completedTasks.length > 0 && (
                        <>
                            <TouchableOpacity
                                style={styles.completedSectionHeader}
                                onPress={() => setShowCompleted(v => !v)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.completedSectionTitle}>
                                    Completed ({completedTasks.length})
                                </Text>
                                {showCompleted
                                    ? <ChevronUp size={14} color="#9ca3af" />
                                    : <ChevronDown size={14} color="#9ca3af" />
                                }
                            </TouchableOpacity>
                            {showCompleted && completedTasks.map((task, i) => renderTaskItem(task, i, completedTasks))}
                        </>
                    )}

                    {filterMode === 'completed' && displayCompleted.map((task, i) => renderTaskItem(task, i, displayCompleted))}
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
                hasDate={!!rescheduleTask?.date}
                onChangeDate={setRescheduleStart}
                onSave={handleSaveReschedule}
                onClear={() => {
                    if (!rescheduleTask) return
                    onUpdateTask(rescheduleTask.id, { date: null })
                    closeRescheduleModal()
                }}
                onCancel={closeRescheduleModal}
            />

            <EstimateModal
                visible={!!estimateModalTask}
                taskName={estimateModalTask?.name}
                currentMinutes={estimateModalTask?.estimatedMinutes}
                onSetEstimate={handleSetEstimate}
                onClose={() => setEstimateModalTask(null)}
            />
        </View>
    )
}
