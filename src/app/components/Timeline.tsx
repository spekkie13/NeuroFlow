// components/timeline/Timeline.tsx
import React, { useMemo, useState } from 'react'
import { Modal, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { Plus, List, CheckCircle2, Circle, X } from 'lucide-react-native'
import { Project, Task, Priority } from '@/app/utils/types'
import { formatLocalDate, formatLocalDateRange, getDateInputPlaceholder, parseLocalDate, toIsoDateString } from '../utils/dateUtils'
import { AppButton } from './ui/AppButton'
import { TextField } from './ui/TextField'
import { DateField } from './ui/DateField'

interface TimelineProps {
    project: Project
    onAddTask: (task: Task) => void
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void
}

type ModalTab = 'new' | 'existing'

export const Timeline: React.FC<TimelineProps> = ({
                                                      project,
                                                      onAddTask,
                                                      onUpdateTask,
                                                  }) => {
    const [showModal, setShowModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [modalTab, setModalTab] = useState<ModalTab>('new')
    const [newTaskName, setNewTaskName] = useState('')
    const [newTaskPriority, setNewTaskPriority] =
        useState<Priority>('medium')
    const [taskStartDate, setTaskStartDate] = useState('')
    const [taskEndDate, setTaskEndDate] = useState('')
    const [selectedExistingTaskId, setSelectedExistingTaskId] =
        useState<string | null>(null)

    const today = useMemo(() => new Date(), [])

    const dates = useMemo(() => {
        return Array.from({ length: 14 }, (_, i) => {
            const d = new Date(today)
            d.setDate(today.getDate() + i)
            return d
        })
    }, [today])

    const isOverdue = (task: Task) => {
        if (!task.endDate || task.completed) return false
        return new Date(task.endDate) < today
    }

    // Taken zonder datum OF overdue (niet voltooid)
    const selectableExistingTasks = useMemo(
        () =>
            project.tasks.filter((task) => {
                const hasNoDates = !task.startDate || !task.endDate
                return hasNoDates || isOverdue(task)
            }),
        [project.tasks],
    )

    const tasksByDate = useMemo(() => {
        return dates.map((date) => {
            const dateStr = date.toISOString().split('T')[0]
            const tasksForDay = project.tasks.filter((task) => {
                if (!task.startDate || !task.endDate) return false
                const startStr = new Date(task.startDate)
                    .toISOString()
                    .split('T')[0]
                const endStr = new Date(task.endDate)
                    .toISOString()
                    .split('T')[0]
                return dateStr >= startStr && dateStr <= endStr
            })

            // sorteer op priority: high > medium > low
            const priorityOrder: Record<Priority, number> = {
                high: 0,
                medium: 1,
                low: 2,
            }
            tasksForDay.sort(
                (a, b) =>
                    priorityOrder[a.priority] - priorityOrder[b.priority],
            )

            return { date, tasks: tasksForDay }
        })
    }, [dates, project.tasks])

    const openAddModalForDate = (date: Date) => {
        setSelectedDate(date)
        const opts: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }
        const formatted = formatLocalDate(date, opts)

        setTaskStartDate(formatted)
        setTaskEndDate(formatted)
        setNewTaskName('')
        setNewTaskPriority('medium')
        setSelectedExistingTaskId(null)

        setModalTab(
            selectableExistingTasks.length > 0 ? 'existing' : 'new',
        )

        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedExistingTaskId(null)
        setTaskStartDate('')
        setTaskEndDate('')
        setNewTaskName('')
    }

    const handleToggleComplete = (task: Task) => {
        onUpdateTask(task.id, { completed: !task.completed })
    }

    const handleAddNewTask = () => {
        if (!newTaskName.trim() || !taskStartDate || !taskEndDate) return

        const start = parseLocalDate(taskStartDate)
        const end = parseLocalDate(taskEndDate)
        if (!start || !end) return

        const startIso = toIsoDateString(start)!
        const endIso = toIsoDateString(end)!

        const newTask: Task = {
            id: Date.now().toString(),
            name: newTaskName.trim(),
            completed: false,
            priority: newTaskPriority,
            startDate: startIso,
            endDate: endIso,
            notes: '',
        }

        onAddTask(newTask)
        closeModal()
    }

    const handleAddExistingTask = () => {
        if (!selectedExistingTaskId || !taskStartDate || !taskEndDate)
            return

        const start = parseLocalDate(taskStartDate)
        const end = parseLocalDate(taskEndDate)
        if (!start || !end) return

        const startIso = toIsoDateString(start)!
        const endIso = toIsoDateString(end)!

        onUpdateTask(selectedExistingTaskId, {
            startDate: startIso,
            endDate: endIso,
        })

        closeModal()
    }

    const placeholder = getDateInputPlaceholder()

    const getPriorityBadgeStyle = (priority: Priority) => {
        switch (priority) {
            case 'high':
                return styles.priorityBadgeHigh
            case 'medium':
                return styles.priorityBadgeMedium
            case 'low':
                return styles.priorityBadgeLow
        }
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.headerTitle}>Timeline View</Text>
                    <Text style={styles.headerSubtitle}>Next 14 days</Text>
                </View>

                {selectableExistingTasks.length > 0 && (
                    <View style={styles.badge}>
                        <List size={16} color="#92400e" />
                        <Text style={styles.badgeText}>
                            {selectableExistingTasks.length} unscheduled or overdue
                            task{selectableExistingTasks.length !== 1 ? 's' : ''}
                        </Text>
                    </View>
                )}
            </View>

            {/* Columns */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.columnsScroll}
            >
                {dates.map((date, index) => {
                    const { tasks } = tasksByDate[index]
                    const weekday = date.toLocaleDateString(undefined, {
                        weekday: 'short',
                    })
                    const dayMonth = date.toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'short',
                    })

                    return (
                        <View key={index} style={styles.column}>
                            <View style={styles.columnHeader}>
                                <Text style={styles.columnWeekday}>{weekday}</Text>
                                <Text style={styles.columnDate}>{dayMonth}</Text>
                            </View>

                            <View style={styles.columnBody}>
                                {tasks.map((task) => {
                                    const dateRange = formatLocalDateRange(
                                        task.startDate,
                                        task.endDate,
                                    )
                                    const overdue = isOverdue(task)

                                    return (
                                        <View
                                            key={task.id}
                                            style={[
                                                styles.taskCard,
                                                {
                                                    borderLeftColor: task.completed
                                                        ? '#9ca3af'
                                                        : project.color,
                                                },
                                                task.completed && styles.taskCardCompleted,
                                            ]}
                                        >
                                            <View style={styles.taskRow}>
                                                <TouchableOpacity
                                                    onPress={() => handleToggleComplete(task)}
                                                    style={styles.checkButton}
                                                    activeOpacity={0.7}
                                                >
                                                    {task.completed ? (
                                                        <CheckCircle2
                                                            size={16}
                                                            color="#22c55e"
                                                        />
                                                    ) : (
                                                        <Circle size={16} color="#9ca3af" />
                                                    )}
                                                </TouchableOpacity>

                                                <View style={styles.taskContent}>
                                                    <Text
                                                        style={[
                                                            styles.taskName,
                                                            task.completed && styles.taskNameCompleted,
                                                        ]}
                                                        numberOfLines={2}
                                                    >
                                                        {task.name}
                                                    </Text>

                                                    {dateRange && (
                                                        <Text
                                                            style={[
                                                                styles.taskDates,
                                                                overdue && styles.taskDatesOverdue,
                                                            ]}
                                                        >
                                                            {overdue ? 'Overdue · ' : ''}
                                                            {dateRange}
                                                        </Text>
                                                    )}

                                                    <View
                                                        style={[
                                                            styles.priorityBadge,
                                                            getPriorityBadgeStyle(task.priority),
                                                        ]}
                                                    >
                                                        <Text style={styles.priorityBadgeText}>
                                                            {task.priority}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })}

                                <TouchableOpacity
                                    style={styles.addTaskButton}
                                    onPress={() => openAddModalForDate(date)}
                                    activeOpacity={0.8}
                                >
                                    <Plus
                                        size={14}
                                        color="#6b7280"
                                        style={{ marginRight: 4 }}
                                    />
                                    <Text style={styles.addTaskText}>Add task</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                })}
            </ScrollView>

            {/* Modal */}
            <Modal
                visible={showModal}
                transparent
                animationType="fade"
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeaderRow}>
                            <View>
                                <Text style={styles.modalTitle}>Schedule Task</Text>
                                {selectedDate && (
                                    <Text style={styles.modalSubtitle}>
                                        {formatLocalDate(selectedDate)}
                                    </Text>
                                )}
                            </View>
                            <TouchableOpacity
                                onPress={closeModal}
                                style={styles.modalCloseButton}
                            >
                                <X size={18} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Tabs */}
                        <View style={styles.modalTabsRow}>
                            <TouchableOpacity
                                style={[
                                    styles.modalTab,
                                    modalTab === 'existing' && styles.modalTabActive,
                                ]}
                                onPress={() => setModalTab('existing')}
                                activeOpacity={0.8}
                            >
                                <View style={styles.modalTabInner}>
                                    <List size={16} color="#2563eb" />
                                    <Text
                                        style={[
                                            styles.modalTabText,
                                            modalTab === 'existing' &&
                                            styles.modalTabTextActive,
                                        ]}
                                    >
                                        Add Existing ({selectableExistingTasks.length})
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.modalTab,
                                    modalTab === 'new' && styles.modalTabActive,
                                ]}
                                onPress={() => setModalTab('new')}
                                activeOpacity={0.8}
                            >
                                <View style={styles.modalTabInner}>
                                    <Plus size={16} color="#2563eb" />
                                    <Text
                                        style={[
                                            styles.modalTabText,
                                            modalTab === 'new' &&
                                            styles.modalTabTextActive,
                                        ]}
                                    >
                                        Create New
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>

                            {modalTab === 'new' ? (
                                <>
                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.fieldLabel}>Task Name</Text>
                                        <TextField
                                            value={newTaskName}
                                            onChangeText={setNewTaskName}
                                            placeholder="Enter task name..."
                                            returnKeyType="done"
                                            onSubmitEditing={handleAddNewTask}
                                        />
                                    </View>

                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.fieldLabel}>Priority</Text>
                                        <View style={styles.priorityRow}>
                                            {(['low', 'medium', 'high'] as Priority[]).map(
                                                (prio) => {
                                                    const active =
                                                        newTaskPriority === prio
                                                    return (
                                                        <TouchableOpacity
                                                            key={prio}
                                                            style={[
                                                                styles.priorityOption,
                                                                active &&
                                                                styles.priorityOptionActive,
                                                            ]}
                                                            onPress={() =>
                                                                setNewTaskPriority(prio)
                                                            }
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.priorityOptionText,
                                                                    active &&
                                                                    styles.priorityOptionTextActive,
                                                                ]}
                                                            >
                                                                {prio}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )
                                                },
                                            )}
                                        </View>
                                    </View>

                                    <View style={styles.datesRow}>
                                        <View style={{ flex: 1, marginRight: 6 }}>
                                            <Text style={styles.fieldLabel}>
                                                Start date ({placeholder})
                                            </Text>
                                            <DateField
                                                value={taskStartDate}
                                                onChangeText={setTaskStartDate}
                                                placeholder={placeholder}
                                            />
                                        </View>
                                        <View style={{ flex: 1, marginLeft: 6 }}>
                                            <Text style={styles.fieldLabel}>
                                                End date ({placeholder})
                                            </Text>
                                            <DateField
                                                value={taskEndDate}
                                                onChangeText={setTaskEndDate}
                                                placeholder={placeholder}
                                            />
                                        </View>
                                    </View>
                                </>
                            ) : (
                                <>
                                    {selectableExistingTasks.length === 0 ? (
                                        <View style={styles.emptyExistingBox}>
                                            <List size={40} color="#9ca3af" />
                                            <Text style={styles.emptyExistingTitle}>
                                                No unscheduled or overdue tasks
                                            </Text>
                                            <Text style={styles.emptyExistingSubtitle}>
                                                All tasks are scheduled and up to date
                                            </Text>
                                        </View>
                                    ) : (
                                        <>
                                            <View style={styles.fieldGroup}>
                                                <Text style={styles.fieldLabel}>
                                                    Select Task
                                                </Text>
                                                <View style={styles.existingList}>
                                                    {selectableExistingTasks.map((task) => {
                                                        const active =
                                                            selectedExistingTaskId ===
                                                            task.id
                                                        return (
                                                            <TouchableOpacity
                                                                key={task.id}
                                                                style={[
                                                                    styles.existingItem,
                                                                    active &&
                                                                    styles.existingItemActive,
                                                                ]}
                                                                onPress={() =>
                                                                    setSelectedExistingTaskId(
                                                                        task.id,
                                                                    )
                                                                }
                                                                activeOpacity={0.8}
                                                            >
                                                                <Text
                                                                    style={styles.existingItemName}
                                                                    numberOfLines={1}
                                                                >
                                                                    {task.name}
                                                                </Text>
                                                                <View
                                                                    style={[
                                                                        styles.priorityBadgeSmall,
                                                                        getPriorityBadgeStyle(
                                                                            task.priority,
                                                                        ),
                                                                    ]}
                                                                >
                                                                    <Text
                                                                        style={
                                                                            styles.priorityBadgeText
                                                                        }
                                                                    >
                                                                        {task.priority}
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        )
                                                    })}
                                                </View>
                                            </View>

                                            <View style={styles.datesRow}>
                                                <View style={{ flex: 1, marginRight: 6 }}>
                                                    <Text style={styles.fieldLabel}>
                                                        Start date ({placeholder})
                                                    </Text>
                                                    <DateField
                                                        value={taskStartDate}
                                                        onChangeText={setTaskStartDate}
                                                        placeholder={placeholder}
                                                    />
                                                </View>
                                                <View style={{ flex: 1, marginLeft: 6 }}>
                                                    <Text style={styles.fieldLabel}>
                                                        End date ({placeholder})
                                                    </Text>
                                                    <DateField
                                                        value={taskEndDate}
                                                        onChangeText={setTaskEndDate}
                                                        placeholder={placeholder}
                                                    />
                                                </View>
                                            </View>
                                        </>
                                    )}
                                </>
                            )}
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <AppButton
                                title="Cancel"
                                variant="outline"
                                onPress={closeModal}
                                fullWidth
                            />
                            {modalTab === 'new' ? (
                                <AppButton
                                    title="Create & Schedule"
                                    variant="primary"
                                    onPress={handleAddNewTask}
                                    fullWidth
                                    disabled={
                                        !newTaskName.trim() ||
                                        !taskStartDate ||
                                        !taskEndDate
                                    }
                                />
                            ) : (
                                <AppButton
                                    title="Schedule Task"
                                    variant="primary"
                                    onPress={handleAddExistingTask}
                                    fullWidth
                                    disabled={
                                        !selectedExistingTaskId ||
                                        !taskStartDate ||
                                        !taskEndDate
                                    }
                                />
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

// --- styles (lokaal in deze file, je mag ze later naar /styles/timeline.styles.ts trekken) ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: '#fffbeb',
        borderWidth: 1,
        borderColor: '#fed7aa',
    },
    badgeText: {
        marginLeft: 6,
        fontSize: 11,
        fontWeight: '500',
        color: '#92400e',
    },
    columnsScroll: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    column: {
        width: 160,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginRight: 8,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
    },
    columnHeader: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#f9fafb',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    columnWeekday: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        color: '#6b7280',
    },
    columnDate: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginTop: 2,
    },
    columnBody: {
        paddingHorizontal: 8,
        paddingVertical: 8,
        minHeight: 140,
    },
    taskCard: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#d1d5db',
        marginBottom: 6,
        backgroundColor: '#ffffff',
        paddingVertical: 6,
        paddingHorizontal: 6,
    },
    taskCardCompleted: {
        backgroundColor: '#f9fafb',
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    checkButton: {
        marginRight: 6,
        paddingTop: 2,
    },
    taskContent: {
        flex: 1,
    },
    taskName: {
        fontSize: 12,
        fontWeight: '500',
        color: '#111827',
    },
    taskNameCompleted: {
        color: '#6b7280',
        textDecorationLine: 'line-through',
    },
    taskDates: {
        fontSize: 11,
        color: '#6b7280',
        marginTop: 2,
    },
    taskDatesOverdue: {
        color: '#b91c1c',
        fontWeight: '500',
    },
    priorityBadge: {
        alignSelf: 'flex-start',
        marginTop: 4,
        borderRadius: 999,
        borderWidth: 1,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    priorityBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    priorityBadgeHigh: {
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca',
    },
    priorityBadgeMedium: {
        backgroundColor: '#fffbeb',
        borderColor: '#fef3c7',
    },
    priorityBadgeLow: {
        backgroundColor: '#ecfdf3',
        borderColor: '#bbf7d0',
    },
    priorityBadgeSmall: {
        borderRadius: 999,
        borderWidth: 1,
        paddingHorizontal: 6,
        paddingVertical: 1,
    },
    addTaskButton: {
        marginTop: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#d1d5db',
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    addTaskText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6b7280',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    modalCard: {
        width: '100%',
        maxWidth: 420,
        borderRadius: 18,
        backgroundColor: '#ffffff',
        padding: 14,
    },
    modalHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    modalSubtitle: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    modalCloseButton: {
        padding: 4,
        borderRadius: 999,
    },
    modalTabsRow: {
        flexDirection: 'row',
        borderRadius: 999,
        backgroundColor: '#f3f4f6',
        padding: 2,
        marginTop: 8,
        marginBottom: 10,
    },
    modalTab: {
        flex: 1,
        borderRadius: 999,
        paddingVertical: 6,
    },
    modalTabActive: {
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    modalTabInner: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    modalTabText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6b7280',
    },
    modalTabTextActive: {
        color: '#2563eb',
    },
    modalBody: {
        maxHeight: 320,
    },
    fieldGroup: {
        marginBottom: 10,
    },
    fieldLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    priorityRow: {
        flexDirection: 'row',
        gap: 6,
    },
    priorityOption: {
        flex: 1,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#d1d5db',
        paddingVertical: 6,
        alignItems: 'center',
    },
    priorityOptionActive: {
        backgroundColor: '#e0f2fe',
        borderColor: '#38bdf8',
    },
    priorityOptionText: {
        fontSize: 12,
        color: '#4b5563',
        textTransform: 'capitalize',
    },
    priorityOptionTextActive: {
        color: '#0f172a',
        fontWeight: '600',
    },
    datesRow: {
        flexDirection: 'row',
        marginTop: 4,
    },
    emptyExistingBox: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 8,
    },
    emptyExistingTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4b5563',
        marginTop: 8,
        marginBottom: 2,
    },
    emptyExistingSubtitle: {
        fontSize: 12,
        color: '#9ca3af',
        textAlign: 'center',
    },
    existingList: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        maxHeight: 180,
        padding: 4,
    },
    existingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 8,
        marginBottom: 4,
    },
    existingItemActive: {
        backgroundColor: '#eff6ff',
    },
    existingItemName: {
        flex: 1,
        fontSize: 13,
        color: '#111827',
        marginRight: 8,
    },
    modalFooter: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 10,
    },
})
