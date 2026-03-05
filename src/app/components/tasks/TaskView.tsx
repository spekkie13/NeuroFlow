import React, { useMemo, useState } from 'react'
import { Text, View } from 'react-native'
import { Plus } from 'lucide-react-native'
import { AppButton } from '@/app/components/ui/AppButton'
import { TextField } from '@/app/components/ui/TextField'
import { TaskItem } from '@/app/components/tasks/TaskItem'
import { PriorityModal } from '@/app/components/tasks/PriorityModal'
import { RescheduleModal } from '@/app/components/tasks/RescheduleModal'
import { formatLocalDate, parseLocalDate, toIsoDateString } from '@/app/utils/dateUtils'
import { Priority } from '@/app/models/Priority'
import { Task } from '@/app/models/Task'
import { TaskViewProps } from '@/app/props/tasks/TaskViewProps'
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

    const completedCount = useMemo(
        () => project.tasks.filter((t) => t.completed).length,
        [project.tasks],
    )

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
            {project.tasks.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>No tasks yet</Text>
                    <Text style={styles.emptySubtitle}>Add your first task to get started</Text>
                </View>
            ) : (
                <View style={styles.list}>
                    {project.tasks.map((task, index) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            isEditing={editingTaskId === task.id}
                            editName={editTaskName}
                            menuOpen={openMenuTaskId === task.id}
                            canMoveUp={!!onMoveTask && index > 0}
                            canMoveDown={!!onMoveTask && index < project.tasks.length - 1}
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
                            onDelete={() => { setOpenMenuTaskId(null); onDeleteTask(task.id) }}
                        />
                    ))}
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
