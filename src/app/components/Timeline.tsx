import React, { useMemo, useState } from 'react'
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Plus, List, CheckCircle2, Circle, X } from 'lucide-react-native'
import { styles } from '@/app/styles/timeline'
import { Priority } from "@/app/models/Priority";
import { Task } from "@/app/models/Task";
import { TimelineProps } from "@/app/props/TimelineProps";
import { startOfDay, formatLocalDate, formatLocalDateRange, getDateInputPlaceholder, parseLocalDate, toIsoDateString } from '../utils/dateUtils'
import { AppButton } from './ui/AppButton'
import { TextField } from './ui/TextField'
import { DateField } from './ui/DateField'


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
    const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium')
    const [taskStartDate, setTaskStartDate] = useState('')
    const [taskEndDate, setTaskEndDate] = useState('')
    const [selectedExistingTaskId, setSelectedExistingTaskId] =
        useState<string | null>(null)

    const today = useMemo(() => new Date(), [])

    const isToday = (date: Date) => {
        return startOfDay(date).getTime() === startOfDay(today).getTime()
    }

    const dates = useMemo(() => {
        return Array.from({ length: 14 }, (_, i) => {
            const d = new Date(today)
            d.setDate(today.getDate() + i)
            return d
        })
    }, [today])

    const isOverdue = (task: Task) => {
        if (!task.endDate || task.completed) return false
        return startOfDay(new Date(task.endDate)) < startOfDay(today)
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
                (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
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
        if (!selectedExistingTaskId || !taskStartDate || !taskEndDate) return

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
                            {selectableExistingTasks.length} task
                            {selectableExistingTasks.length !== 1 ? 's' : ''} need scheduling
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
                        <View
                            key={index}
                            style={[
                                styles.column,
                                isToday(date) && styles.columnToday,
                            ]}
                        >
                            <View style={styles.columnHeader}>
                                <View style={styles.columnHeaderTopRow}>
                                    <Text style={styles.columnWeekday}>{weekday}</Text>

                                    {/* Always render to keep height consistent */}
                                    <Text
                                        style={[
                                            styles.todayBadgeInline,
                                            !isToday(date) && styles.todayBadgeHidden,
                                        ]}
                                    >
                                        Today
                                    </Text>
                                </View>

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
                                                            {overdue ? 'Needs attention · ' : ''}
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
                                                    const active = newTaskPriority === prio
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
                                                No tasks need scheduling
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
                                                            selectedExistingTaskId === task.id
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
