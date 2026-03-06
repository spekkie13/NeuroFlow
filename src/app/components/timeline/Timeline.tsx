import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Plus, CheckCircle2, Circle } from 'lucide-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { ScheduleTaskModal } from '@/app/components/timeline/ScheduleTaskModal'
import { formatLocalDateRange, formatLocalDate, parseLocalDate, toIsoDateString, isSameDay } from '../../utils/dateUtils'
import { isOverdue } from '@/app/services/domain/TaskService'
import { RescheduleModal } from '@/app/components/tasks/RescheduleModal'
import { getPriorityStyle } from '@/app/utils/priorityUtils'
import { Priority } from "@/app/models/Priority";
import { Task } from "@/app/models/Task";
import { TimelineProps } from "@/app/props/timeline/TimelineProps";
import { styles } from '@/app/styles/timeline'

const WebView = View as React.ComponentType<any>

export type TimelineHandle = { scrollToToday: () => void }

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

export const Timeline = ({
    project,
    onAddTask,
    onUpdateTask,
    ref,
}: TimelineProps & { ref?: React.Ref<TimelineHandle | null> }) => {
    const [showModal, setShowModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [rescheduleTask, setRescheduleTask] = useState<Task | null>(null)
    const [rescheduleDate, setRescheduleDate] = useState('')

    const openReschedule = (task: Task) => {
        setRescheduleTask(task)
        setRescheduleDate(task.date ? formatLocalDate(task.date) : '')
    }

    const handleSaveReschedule = () => {
        if (!rescheduleTask || !rescheduleDate) return
        const parsed = parseLocalDate(rescheduleDate)
        if (!parsed) return
        onUpdateTask(rescheduleTask.id, { date: toIsoDateString(parsed)! })
        setRescheduleTask(null)
        setRescheduleDate('')
    }

    const scrollViewRef = useRef<ScrollView>(null)
    const isDragging = useRef(false)
    const dragStartX = useRef(0)
    const dragStartScrollLeft = useRef(0)
    const [isGrabbing, setIsGrabbing] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    const handleMouseDown = (e: any) => {
        isDragging.current = true
        setIsGrabbing(true)
        dragStartX.current = e.clientX
        const node = (scrollViewRef.current as any)?.getScrollableNode?.()
        dragStartScrollLeft.current = node?.scrollLeft ?? 0
    }

    const handleMouseMove = (e: any) => {
        if (!isDragging.current) return
        e.preventDefault()
        const node = (scrollViewRef.current as any)?.getScrollableNode?.()
        if (node) node.scrollLeft = dragStartScrollLeft.current - (e.clientX - dragStartX.current)
    }

    const handleMouseUp = () => {
        isDragging.current = false
        setIsGrabbing(false)
    }

    useImperativeHandle(ref, () => ({
        scrollToToday: () => scrollViewRef.current?.scrollTo({ x: 0, animated: true }),
    }))

    // #1 — scroll to today on mount
    useEffect(() => {
        scrollViewRef.current?.scrollTo({ x: 0, animated: false })
    }, [])

    const today = useMemo(() => new Date(), [])

    const dates = useMemo(() => {
        return Array.from({ length: 14 }, (_, i) => {
            const d = new Date(today)
            d.setDate(today.getDate() + i)
            return d
        })
    }, [today])

    const selectableExistingTasks = useMemo(
        () => project.tasks.filter((task) => !task.date || isOverdue(task)),
        [project.tasks],
    )

    const overdueTasks = useMemo(() => {
        return project.tasks
            .filter(isOverdue)
            .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    }, [project.tasks])

    const tasksByDate = useMemo(() => {
        return dates.map((date) => {
            const dateStr = toIsoDateString(date)
            const tasksForDay = project.tasks.filter((task) => {
                if (!task.date) return false
                return task.date === dateStr
            })

            tasksForDay.sort(
                (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
            )

            return { date, tasks: tasksForDay, completedCount: tasksForDay.filter(t => t.completed).length }
        })
    }, [dates, project.tasks])

    const openAddModalForDate = (date: Date) => {
        setSelectedDate(date)
        setShowModal(true)
    }

    const handleToggleComplete = (task: Task) => {
        onUpdateTask(task.id, { completed: !task.completed })
    }

    return (
        <View style={styles.container}>
            {/* Columns */}
            <WebView
                style={{ position: 'relative', cursor: isGrabbing ? 'grabbing' : 'grab' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.columnsScroll}
                onScroll={(e) => setIsScrolled(e.nativeEvent.contentOffset.x > 0)}
                scrollEventThrottle={16}
            >
                {/* #6 — overdue column */}
                {overdueTasks.length > 0 && (
                    <View style={[styles.column, styles.columnOverdue]}>
                        <View style={[styles.columnHeader, styles.columnOverdueHeader]}>
                            <Text style={styles.columnOverdueLabel}>Overdue</Text>
                            <Text style={styles.columnOverdueCount}>
                                {overdueTasks.length} task{overdueTasks.length !== 1 ? 's' : ''}
                            </Text>
                        </View>
                        <View style={styles.columnBody}>
                            {overdueTasks.map((task) => {
                                const dateRange = formatLocalDateRange(task.date, task.date)
                                return (
                                    <View
                                        key={task.id}
                                        style={[styles.taskCard, { borderLeftColor: '#ef4444' }]}
                                    >
                                        <View style={styles.taskRow}>
                                            <TouchableOpacity
                                                onPress={() => handleToggleComplete(task)}
                                                style={styles.checkButton}
                                                activeOpacity={0.7}
                                                delayPressIn={50}
                                            >
                                                <Circle size={16} color="#9ca3af" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.taskContent}
                                                onPress={() => openReschedule(task)}
                                                activeOpacity={0.7}
                                                delayPressIn={50}
                                            >
                                                <Text style={styles.taskName} numberOfLines={2}>
                                                    {task.name}
                                                </Text>
                                                {dateRange && (
                                                    <Text style={[styles.taskDates, styles.taskDatesOverdue]}>
                                                        {dateRange}
                                                    </Text>
                                                )}
                                                <View style={[styles.priorityBadge, getPriorityStyle(task.priority, styles.priorityBadgeHigh, styles.priorityBadgeMedium, styles.priorityBadgeLow)]}>
                                                    <Text style={styles.priorityBadgeText}>{task.priority}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                )}

                {dates.map((date, index) => {
                    const { tasks, completedCount } = tasksByDate[index]
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
                                isSameDay(date, today) && styles.columnToday,
                            ]}
                        >
                            <View style={styles.columnHeader}>
                                <View style={styles.columnHeaderTopRow}>
                                    <Text style={styles.columnWeekday}>{weekday}</Text>

                                    {/* Always render to keep height consistent */}
                                    <Text
                                        style={[
                                            styles.todayBadgeInline,
                                            !isSameDay(date, today) && styles.todayBadgeHidden,
                                        ]}
                                    >
                                        Today
                                    </Text>
                                </View>

                                <Text style={styles.columnDate}>{dayMonth}</Text>

                                {/* #4 & #5 — task count + progress */}
                                {tasks.length > 0 && (
                                    <View style={styles.columnStats}>
                                        <View style={styles.progressTrack}>
                                            <View style={[styles.progressFill, {
                                                width: `${Math.round((completedCount / tasks.length) * 100)}%` as any,
                                                backgroundColor: completedCount === tasks.length ? '#22c55e' : '#2563eb',
                                            }]} />
                                        </View>
                                        <Text style={styles.progressText}>
                                            {completedCount}/{tasks.length}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.columnBody}>
                                {/* #3 — empty state */}
                                {tasks.length === 0 && (
                                    <View style={styles.emptyColumn}>
                                        <Text style={styles.emptyColumnText}>No tasks</Text>
                                    </View>
                                )}

                                {tasks.map((task) => {
                                    const dateRange = formatLocalDateRange(
                                        task.date,
                                        task.date,
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
                                                    delayPressIn={50}
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

                                                <TouchableOpacity
                                                    style={styles.taskContent}
                                                    onPress={() => openReschedule(task)}
                                                    activeOpacity={0.7}
                                                    delayPressIn={50}
                                                >
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
                                                            getPriorityStyle(task.priority, styles.priorityBadgeHigh, styles.priorityBadgeMedium, styles.priorityBadgeLow),
                                                        ]}
                                                    >
                                                        <Text style={styles.priorityBadgeText}>
                                                            {task.priority}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                })}

                                <TouchableOpacity
                                    style={styles.addTaskButton}
                                    onPress={() => openAddModalForDate(date)}
                                    activeOpacity={0.8}
                                    delayPressIn={50}
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
            {isScrolled && (
                <LinearGradient
                    colors={['rgba(255,255,255,0.95)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 48, pointerEvents: 'none' }}
                />
            )}
            <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.95)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 48, pointerEvents: 'none' }}
            />
            </WebView>

            <ScheduleTaskModal
                visible={showModal}
                selectedDate={selectedDate}
                selectableExistingTasks={selectableExistingTasks}
                onAddNewTask={onAddTask}
                onUpdateTask={onUpdateTask}
                onClose={() => setShowModal(false)}
            />

            <RescheduleModal
                visible={!!rescheduleTask}
                taskName={rescheduleTask?.name}
                date={rescheduleDate}
                onChangeDate={setRescheduleDate}
                onSave={handleSaveReschedule}
                onCancel={() => { setRescheduleTask(null); setRescheduleDate('') }}
            />
        </View>
    )
}
