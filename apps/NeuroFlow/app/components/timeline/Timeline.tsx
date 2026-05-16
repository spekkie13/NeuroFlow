import React, {RefObject, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Plus, CheckCircle2, Circle } from 'lucide-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { formatLocalDateRange, formatLocalDate, formatMinutes, parseLocalDate, toIsoDateString, isSameDay } from '../../utils/dateUtils'
import {Priority, Task} from "../../models";
import { TimelineProps } from "../../props/timeline/TimelineProps"
import { isOverdue } from "../../services/domain/TaskService"
import {styles} from "../../styles/timeline";
import {getPriorityStyle} from "../../utils/priorityUtils";
import {ScheduleTaskModal} from "./ScheduleTaskModal";
import {RescheduleModal} from "../tasks/RescheduleModal";

// Cast View to accept web-only mouse event props (onMouseDown etc.) that
// React Native's type definitions don't include but are valid on web builds.
const WebView = View as React.ComponentType<any>

export type TimelineHandle = { scrollToToday: () => void }

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

export const Timeline = ({
    project,
    dailyMinutes,
    onAddTask,
    onUpdateTask,
    ref,
}: TimelineProps & { ref?: React.Ref<TimelineHandle | null> }) => {
    const [isGrabbing, setIsGrabbing] = useState<boolean>(false)
    const [isScrolled, setIsScrolled] = useState<boolean>(false)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [rescheduleTask, setRescheduleTask] = useState<Task | null>(null)
    const [rescheduleDate, setRescheduleDate] = useState<string>('')

    const openReschedule = (task: Task) => {
        setRescheduleTask(task)
        setRescheduleDate(task.date ? formatLocalDate(task.date) : '')

    }
    const handleSaveReschedule = () => {
        if (!rescheduleTask || !rescheduleDate) return
        const parsed: Date = parseLocalDate(rescheduleDate)
        if (!parsed) return
        onUpdateTask(rescheduleTask.id, { date: toIsoDateString(parsed)! })
        setRescheduleTask(null)
        setRescheduleDate('')

    }
    const scrollViewRef: RefObject<ScrollView> = useRef<ScrollView>(null)
    const isDragging: RefObject<boolean> = useRef(false)
    const dragStartX: RefObject<number> = useRef(0)
    const dragStartScrollLeft: RefObject<number> = useRef(0)

    // Mouse event handlers for click-and-drag scrolling on web.
    // Parameters typed as `any` because React Native's types don't include
    // web MouseEvent; the underlying DOM event is accessed at runtime.
    const handleMouseDown = (e: any): void => {
        isDragging.current = true
        setIsGrabbing(true)
        dragStartX.current = e.clientX
        // getScrollableNode() is a React Native Web internal that returns the
        // underlying DOM element, giving us access to scrollLeft.
        const node = (scrollViewRef.current as any)?.getScrollableNode?.()
        dragStartScrollLeft.current = node?.scrollLeft ?? 0
    }

    const handleMouseMove = (e: any): void => {
        if (!isDragging.current) return
        e.preventDefault()
        const node = (scrollViewRef.current as any)?.getScrollableNode?.()
        if (node) node.scrollLeft = dragStartScrollLeft.current - (e.clientX - dragStartX.current)
    }

    const handleMouseUp = (): void => {
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

    const today: Date = useMemo(() => new Date(), [])

    const dates: Date[] = useMemo(() => {
        return Array.from({ length: 14 }, (_, i) => {
            const d = new Date(today)
            d.setDate(today.getDate() + i)
            return d
        })
    }, [today])

    const selectableExistingTasks: Task[] = useMemo(
        () => project.tasks.filter((task: Task) => !task.date || isOverdue(task)),
        [project.tasks],
    )

    const overdueTasks: Task[] = useMemo(() => {
        return project.tasks
            .filter(isOverdue)
            .sort(((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]))
    }, [project.tasks])

    const tasksByDate = useMemo(() => {
        return dates.map((date: Date) => {
            const dateStr: string = toIsoDateString(date)
            const tasksForDay: Task[] = project.tasks.filter((task) => {
                if (!task.date)
                    return false

                return task.date === dateStr
            })

            tasksForDay.sort(
                (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
            )

            const estimatedTotal: number = tasksForDay.reduce((sum, t) => sum + (t.estimatedMinutes ?? 0), 0)
            return { date, tasks: tasksForDay, completedCount: tasksForDay.filter(t => t.completed).length, estimatedTotal }
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
                    const weekday = date.toLocaleDateString(undefined, {
                        weekday: 'short',
                    })
                    const dayMonth = date.toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'short',
                    })

                    const { tasks, completedCount, estimatedTotal } = tasksByDate[index]

                    // Color the time total based on budget usage
                    const timeColor = !dailyMinutes || estimatedTotal === 0
                        ? '#6b7280'
                        : estimatedTotal > dailyMinutes
                            ? '#dc2626'
                            : estimatedTotal > dailyMinutes * 0.75
                                ? '#d97706'
                                : '#16a34a'

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

                                {/* task count + completion progress */}
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

                                {/* time estimate total */}
                                {estimatedTotal > 0 && (
                                    <Text style={[styles.timeEstimateText, { color: timeColor }]}>
                                        ~{formatMinutes(estimatedTotal)}{dailyMinutes ? ` / ${formatMinutes(dailyMinutes)}` : ''}
                                    </Text>
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
                hasDate={!!rescheduleTask?.date}
                onChangeDate={setRescheduleDate}
                onSave={handleSaveReschedule}
                onClear={() => {
                    if (!rescheduleTask) return
                    onUpdateTask(rescheduleTask.id, { date: null })
                    setRescheduleTask(null)
                    setRescheduleDate('')
                }}
                onCancel={() => { setRescheduleTask(null); setRescheduleDate('') }}
            />
        </View>
    )
}
