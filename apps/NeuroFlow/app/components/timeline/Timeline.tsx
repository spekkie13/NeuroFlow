import React, {RefObject, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Plus, CheckCircle2, Circle } from 'lucide-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist'
import { formatLocalDateRange, formatLocalDate, formatMinutes, parseLocalDate, toIsoDateString, isSameDay } from '../../utils/dateUtils'
import {Task} from "../../models";
import { TimelineProps } from "../../props/timeline/TimelineProps"
import { isOverdue } from "../../services/domain/TaskService"
import { timelineStyles } from "../../styles/timeline/timeline.styles";
import {getPriorityStyle} from "../../utils/priorityUtils";
import {ScheduleTaskModal} from "./ScheduleTaskModal";
import {RescheduleModal} from "../tasks/RescheduleModal";
import {sortTasksForColumn} from "../../utils/taskSortUtils";

// Cast View to accept web-only mouse event props (onMouseDown etc.) that
// React Native's type definitions don't include but are valid on web builds.
const WebView = View as React.ComponentType<any>

export type TimelineHandle = { scrollToToday: () => void }

export const Timeline = ({
    project,
    dailyMinutes,
    onAddTask,
    onUpdateTask,
    onReorderTasks,
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
    // web MouseEvent; the underlying DOM element is accessed at runtime.
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
        () => project.tasks.filter((task: Task) => (!task.date || isOverdue(task)) && !task.completed),
        [project.tasks],
    )

    const overdueTasks: Task[] = useMemo(() => {
        return sortTasksForColumn(project.tasks.filter(isOverdue))
    }, [project.tasks])

    const tasksByDate = useMemo(() => {
        return dates.map((date: Date) => {
            const dateStr: string = toIsoDateString(date)
            const tasksForDay: Task[] = sortTasksForColumn(
                project.tasks.filter(task => task.date === dateStr)
            )
            const estimatedTotal: number = tasksForDay.reduce((sum, t) => sum + (t.estimatedMinutes ?? 0), 0)
            return { date, tasks: tasksForDay, completedCount: tasksForDay.filter(t => t.completed).length, estimatedTotal }
        })
    }, [dates, project.tasks])

    const openAddModalForDate = (date: Date) => {
        setSelectedDate(date)
        setShowModal(true)
    }

    const handleToggleComplete = useCallback((task: Task) => {
        onUpdateTask(task.id, { completed: !task.completed })
    }, [onUpdateTask])

    const renderOverdueTaskItem = useCallback(({ item: task, drag, isActive }: RenderItemParams<Task>) => {
        const dateRange = formatLocalDateRange(task.date, task.date)
        return (
            <View
                style={[
                    timelineStyles.taskCard,
                    { borderLeftColor: '#ef4444' },
                    isActive && { opacity: 0.88 },
                ]}
            >
                <View style={timelineStyles.taskRow}>
                    <TouchableOpacity
                        onPress={() => handleToggleComplete(task)}
                        style={timelineStyles.checkButton}
                        activeOpacity={0.7}
                        delayPressIn={50}
                    >
                        <Circle size={16} color="#9ca3af" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={timelineStyles.taskContent}
                        onPress={() => openReschedule(task)}
                        onLongPress={drag}
                        delayLongPress={200}
                        activeOpacity={0.7}
                        delayPressIn={50}
                    >
                        <Text style={timelineStyles.taskName} numberOfLines={2}>
                            {task.name}
                        </Text>
                        {dateRange && (
                            <Text style={[timelineStyles.taskDates, timelineStyles.taskDatesOverdue]}>
                                {dateRange}
                            </Text>
                        )}
                        <View style={[timelineStyles.priorityBadge, getPriorityStyle(task.priority, timelineStyles.priorityBadgeHigh, timelineStyles.priorityBadgeMedium, timelineStyles.priorityBadgeLow)]}>
                            <Text style={timelineStyles.priorityBadgeText}>{task.priority}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }, [handleToggleComplete, openReschedule])

    const renderDateTaskItem = useCallback(({ item: task, drag, isActive }: RenderItemParams<Task>) => {
        const dateRange = formatLocalDateRange(task.date, task.date)
        const overdue = isOverdue(task)
        return (
            <View
                style={[
                    timelineStyles.taskCard,
                    { borderLeftColor: task.completed ? '#9ca3af' : project.color },
                    task.completed && timelineStyles.taskCardCompleted,
                    isActive && { opacity: 0.88 },
                ]}
            >
                <View style={timelineStyles.taskRow}>
                    <TouchableOpacity
                        onPress={() => handleToggleComplete(task)}
                        style={timelineStyles.checkButton}
                        activeOpacity={0.7}
                        delayPressIn={50}
                    >
                        {task.completed ? (
                            <CheckCircle2 size={16} color="#22c55e" />
                        ) : (
                            <Circle size={16} color="#9ca3af" />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={timelineStyles.taskContent}
                        onPress={() => openReschedule(task)}
                        onLongPress={drag}
                        delayLongPress={200}
                        activeOpacity={0.7}
                        delayPressIn={50}
                    >
                        <Text
                            style={[
                                timelineStyles.taskName,
                                task.completed && timelineStyles.taskNameCompleted,
                            ]}
                            numberOfLines={2}
                        >
                            {task.name}
                        </Text>
                        {dateRange && (
                            <Text
                                style={[
                                    timelineStyles.taskDates,
                                    overdue && timelineStyles.taskDatesOverdue,
                                ]}
                            >
                                {overdue ? 'Needs attention · ' : ''}
                                {dateRange}
                            </Text>
                        )}
                        <View
                            style={[
                                timelineStyles.priorityBadge,
                                getPriorityStyle(task.priority, timelineStyles.priorityBadgeHigh, timelineStyles.priorityBadgeMedium, timelineStyles.priorityBadgeLow),
                            ]}
                        >
                            <Text style={timelineStyles.priorityBadgeText}>
                                {task.priority}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }, [project.color, handleToggleComplete, openReschedule])

    return (
        <View style={timelineStyles.container}>
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
                contentContainerStyle={timelineStyles.columnsScroll}
                onScroll={(e) => setIsScrolled(e.nativeEvent.contentOffset.x > 0)}
                scrollEventThrottle={16}
            >
                {/* #6 — overdue column */}
                {overdueTasks.length > 0 && (
                    <View style={[timelineStyles.column, timelineStyles.columnOverdue]}>
                        <View style={[timelineStyles.columnHeader, timelineStyles.columnOverdueHeader]}>
                            <Text style={timelineStyles.columnOverdueLabel}>Overdue</Text>
                            <Text style={timelineStyles.columnOverdueCount}>
                                {overdueTasks.length} task{overdueTasks.length !== 1 ? 's' : ''}
                            </Text>
                        </View>
                        <View style={timelineStyles.columnBody}>
                            <DraggableFlatList
                                data={overdueTasks}
                                keyExtractor={(task) => task.id}
                                renderItem={renderOverdueTaskItem}
                                onDragEnd={({ data }) => onReorderTasks(data)}
                                scrollEnabled={false}
                            />
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
                                timelineStyles.column,
                                isSameDay(date, today) && timelineStyles.columnToday,
                            ]}
                        >
                            <View style={timelineStyles.columnHeader}>
                                <View style={timelineStyles.columnHeaderTopRow}>
                                    <Text style={timelineStyles.columnWeekday}>{weekday}</Text>

                                    {/* Always render to keep height consistent */}
                                    <Text
                                        style={[
                                            timelineStyles.todayBadgeInline,
                                            !isSameDay(date, today) && timelineStyles.todayBadgeHidden,
                                        ]}
                                    >
                                        Today
                                    </Text>
                                </View>

                                <Text style={timelineStyles.columnDate}>{dayMonth}</Text>

                                {/* task count + completion progress */}
                                {tasks.length > 0 && (
                                    <View style={timelineStyles.columnStats}>
                                        <View style={timelineStyles.progressTrack}>
                                            <View style={[timelineStyles.progressFill, {
                                                width: `${Math.round((completedCount / tasks.length) * 100)}%` as any,
                                                backgroundColor: completedCount === tasks.length ? '#22c55e' : '#2563eb',
                                            }]} />
                                        </View>
                                        <Text style={timelineStyles.progressText}>
                                            {completedCount}/{tasks.length}
                                        </Text>
                                    </View>
                                )}

                                {/* time estimate total */}
                                {estimatedTotal > 0 && (
                                    <Text style={[timelineStyles.timeEstimateText, { color: timeColor }]}>
                                        ~{formatMinutes(estimatedTotal)}{dailyMinutes ? ` / ${formatMinutes(dailyMinutes)}` : ''}
                                    </Text>
                                )}
                            </View>

                            <View style={timelineStyles.columnBody}>
                                {tasks.length === 0 && (
                                    <View style={timelineStyles.emptyColumn}>
                                        <Text style={timelineStyles.emptyColumnText}>No tasks</Text>
                                    </View>
                                )}

                                <DraggableFlatList
                                    data={tasks}
                                    keyExtractor={(task) => task.id}
                                    renderItem={renderDateTaskItem}
                                    onDragEnd={({ data }) => onReorderTasks(data)}
                                    scrollEnabled={false}
                                />

                                <TouchableOpacity
                                    style={timelineStyles.addTaskButton}
                                    onPress={() => openAddModalForDate(date)}
                                    activeOpacity={0.8}
                                    delayPressIn={50}
                                >
                                    <Plus
                                        size={14}
                                        color="#6b7280"
                                        style={{ marginRight: 4 }}
                                    />
                                    <Text style={timelineStyles.addTaskText}>Add task</Text>
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
