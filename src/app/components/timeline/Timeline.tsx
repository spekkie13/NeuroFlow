import React, { useMemo, useRef, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Plus, List, CheckCircle2, Circle } from 'lucide-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { ScheduleTaskModal } from '@/app/components/timeline/ScheduleTaskModal'
import { startOfDay, formatLocalDateRange } from '../../utils/dateUtils'
import { getPriorityStyle } from '@/app/utils/priorityUtils'
import { Priority } from "@/app/models/Priority";
import { Task } from "@/app/models/Task";
import { TimelineProps } from "@/app/props/timeline/TimelineProps";
import { styles } from '@/app/styles/timeline'

export const Timeline: React.FC<TimelineProps> = ({
                                                      project,
                                                      onAddTask,
                                                      onUpdateTask,
                                                  }) => {
    const [showModal, setShowModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const scrollViewRef = useRef<ScrollView>(null)
    const isDragging = useRef(false)
    const dragStartX = useRef(0)
    const dragStartScrollLeft = useRef(0)
    const [isGrabbing, setIsGrabbing] = useState(false)

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
        if (!task.date || task.completed) return false
        return startOfDay(new Date(task.date)) < startOfDay(today)
    }

    const selectableExistingTasks = useMemo(
        () => project.tasks.filter((task) => !task.date || isOverdue(task)),
        [project.tasks],
    )

    const tasksByDate = useMemo(() => {
        return dates.map((date) => {
            const dateStr = date.toISOString().split('T')[0]
            const tasksForDay = project.tasks.filter((task) => {
                if (!task.date) return false
                return new Date(task.date).toISOString().split('T')[0] === dateStr
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
        setShowModal(true)
    }

    const handleToggleComplete = (task: Task) => {
        onUpdateTask(task.id, { completed: !task.completed })
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
            <View
                style={{ position: 'relative', cursor: isGrabbing ? 'grabbing' : 'grab' } as any}
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
                                                            getPriorityStyle(task.priority, styles.priorityBadgeHigh, styles.priorityBadgeMedium, styles.priorityBadgeLow),
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
            <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.95)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 48, pointerEvents: 'none' }}
            />
            </View>

            <ScheduleTaskModal
                visible={showModal}
                selectedDate={selectedDate}
                selectableExistingTasks={selectableExistingTasks}
                onAddNewTask={onAddTask}
                onUpdateTask={onUpdateTask}
                onClose={() => setShowModal(false)}
            />
        </View>
    )
}
