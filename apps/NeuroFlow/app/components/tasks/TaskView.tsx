import React, { useMemo, useState } from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import { Plus, ChevronDown, ChevronUp } from 'lucide-react-native'
import {TaskViewProps} from "../../props/tasks/TaskViewProps";
import {createTask} from "../../services/domain/TaskService";
import {Priority, Task, Routine, Step} from "../../models";
import {formatLocalDate, parseLocalDate, toIsoDateString} from "../../utils/dateUtils";
import {TaskItem} from "./TaskItem";
import {RoutineItem} from "./RoutineItem";
import {RoutineModal} from "./RoutineModal";
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
                                                      onAddRoutine,
                                                      onUpdateRoutine,
                                                      onDeleteRoutine,
                                                  }: TaskViewProps) => {
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

    const [showRoutines, setShowRoutines] = useState(true)
    const [routineModalOpen, setRoutineModalOpen] = useState(false)
    const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null)

    const routines: Routine[] = project.routines ?? []

    const activeTasks: Task[] = useMemo(() => project.tasks.filter((t: Task) => !t.completed && !t.routineId), [project.tasks])
    const completedTasks: Task[] = useMemo(() => project.tasks.filter((t: Task) => t.completed), [project.tasks])

    const toggleMenu = (taskId: string) => {
        setOpenMenuTaskId((prev) => (prev === taskId ? null : taskId))
    }

    const handleAddTask = () => {
        const trimmed: string = newTaskName.trim()
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
        const trimmed: string = editTaskName.trim()
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
        const start: Date = parseLocalDate(rescheduleStart)
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
            onSaveNotes={(notes: string) => onUpdateTask(task.id, { notes })}
            onSaveSteps={(steps: Step[]) => onUpdateTask(task.id, { steps })}
            onOpenEstimateModal={() => openEstimateModal(task)}
        />
    )

    const displayActive: Task[] = filterMode !== 'completed' ? activeTasks : []
    const displayCompleted: Task[] = filterMode !== 'active' ? completedTasks : []
    const isEmpty: boolean = displayActive.length === 0 && displayCompleted.length === 0

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

            {/* Routines section */}
            <View style={routineStyles.section}>
                <TouchableOpacity
                    style={routineStyles.sectionHeader}
                    onPress={() => setShowRoutines(v => !v)}
                    activeOpacity={0.7}
                >
                    <Text style={routineStyles.sectionTitle}>Routines ({routines.length})</Text>
                    <View style={routineStyles.sectionHeaderRight}>
                        <TouchableOpacity
                            onPress={() => { setEditingRoutine(null); setRoutineModalOpen(true) }}
                            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
                            style={routineStyles.addButton}
                        >
                            <Plus size={14} color="#2563eb"/>
                        </TouchableOpacity>
                        {showRoutines
                            ? <ChevronUp size={14} color="#9ca3af"/>
                            : <ChevronDown size={14} color="#9ca3af"/>
                        }
                    </View>
                </TouchableOpacity>

                {showRoutines && (
                    <View>
                        {routines.length === 0 ? (
                            <Text style={routineStyles.emptyText}>
                                No routines yet. Tap + to add one.
                            </Text>
                        ) : routines.map(routine => (
                            <RoutineItem
                                key={routine.id}
                                routine={routine}
                                onToggleActive={(active) => onUpdateRoutine(routine.id, {active})}
                                onEdit={() => { setEditingRoutine(routine); setRoutineModalOpen(true) }}
                                onDelete={() => onDeleteRoutine(routine.id)}
                            />
                        ))}
                    </View>
                )}
            </View>

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

            <RoutineModal
                visible={routineModalOpen}
                routine={editingRoutine ?? undefined}
                onSave={(routine) => {
                    if (editingRoutine) {
                        onUpdateRoutine(routine.id, routine)
                    } else {
                        onAddRoutine(routine)
                    }
                    setRoutineModalOpen(false)
                    setEditingRoutine(null)
                }}
                onClose={() => { setRoutineModalOpen(false); setEditingRoutine(null) }}
            />
        </View>
    )
}

import {StyleSheet} from 'react-native'
const routineStyles = StyleSheet.create({
    section: {
        marginTop: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    addButton: {
        padding: 2,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9ca3af',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    emptyText: {
        fontSize: 13,
        color: '#9ca3af',
        textAlign: 'center',
        paddingVertical: 12,
    },
})
