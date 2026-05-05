import React, { useMemo, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { CheckCircle2, ChevronDown, ChevronRight, Circle } from 'lucide-react-native'
import { Project } from '@/app/models/Project'
import { Task } from '@/app/models/Task'
import { isOverdue } from '@/app/services/domain/TaskService'
import { getPriorityStyle } from '@/app/utils/priorityUtils'
import { formatLocalDate, parseLocalDate, toIsoDateString } from '@/app/utils/dateUtils'
import { RescheduleModal } from '@/app/components/tasks/RescheduleModal'
import { styles } from '@/app/styles/today'
import { Priority } from '@/app/models/Priority'

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

interface TodayViewProps {
    projects: Project[]
    onUpdateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void
}

export const TodayView: React.FC<TodayViewProps> = ({ projects, onUpdateTask }) => {
    const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())
    const [rescheduleTarget, setRescheduleTarget] = useState<{ projectId: string; task: Task } | null>(null)
    const [rescheduleDate, setRescheduleDate] = useState('')

    const todayStr = useMemo(() => toIsoDateString(new Date())!, [])

    const toggleSection = (id: string) => {
        setCollapsedSections(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const overdueItems = useMemo(() =>
        projects
            .flatMap(p => p.tasks.filter(isOverdue).map(t => ({ task: t, project: p })))
            .sort((a, b) => PRIORITY_ORDER[a.task.priority] - PRIORITY_ORDER[b.task.priority]),
        [projects]
    )

    const todayByProject = useMemo(() =>
        projects
            .map(p => ({
                project: p,
                tasks: p.tasks
                    .filter(t => t.date === todayStr)
                    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]),
            }))
            .filter(({ tasks }) => tasks.length > 0),
        [projects, todayStr]
    )

    const todayTotal = todayByProject.reduce((sum, { tasks }) => sum + tasks.length, 0)
    const todayDone = todayByProject.reduce((sum, { tasks }) => sum + tasks.filter(t => t.completed).length, 0)
    const overdueTotal = overdueItems.length
    const hasAnything = todayTotal > 0 || overdueTotal > 0

    const openReschedule = (projectId: string, task: Task) => {
        setRescheduleTarget({ projectId, task })
        setRescheduleDate(task.date ? formatLocalDate(task.date) : '')
    }

    const handleSaveReschedule = () => {
        if (!rescheduleTarget || !rescheduleDate) return
        const parsed = parseLocalDate(rescheduleDate)
        if (!parsed) return
        onUpdateTask(rescheduleTarget.projectId, rescheduleTarget.task.id, { date: toIsoDateString(parsed)! })
        setRescheduleTarget(null)
        setRescheduleDate('')
    }

    const renderTaskRow = (task: Task, projectId: string, projectColor?: string) => (
        <View key={task.id} style={styles.taskRow}>
            <TouchableOpacity
                style={styles.taskCheckbox}
                onPress={() => onUpdateTask(projectId, task.id, { completed: !task.completed })}
                activeOpacity={0.7}
            >
                {task.completed
                    ? <CheckCircle2 size={18} color="#22c55e" />
                    : <Circle size={18} color="#9ca3af" />
                }
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.taskContent}
                onPress={() => openReschedule(projectId, task)}
                activeOpacity={0.7}
            >
                <Text style={[styles.taskName, task.completed && styles.taskNameDone]} numberOfLines={2}>
                    {task.name}
                </Text>
            </TouchableOpacity>
            {projectColor && (
                <View style={[styles.projectDot, { backgroundColor: projectColor }]} />
            )}
            <View style={[styles.priorityBadge, getPriorityStyle(task.priority, styles.priorityHigh, styles.priorityMedium, styles.priorityLow)]}>
                <Text style={styles.priorityText}>{task.priority}</Text>
            </View>
        </View>
    )

    const renderSectionHeader = (id: string, label: string, count: string, color?: string, overdueStyle?: boolean) => {
        const isCollapsed = collapsedSections.has(id)
        return (
            <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(id)} activeOpacity={0.7}>
                <View style={styles.sectionHeaderLeft}>
                    {isCollapsed
                        ? <ChevronRight size={16} color="#6b7280" />
                        : <ChevronDown size={16} color="#6b7280" />
                    }
                    {color && <View style={[styles.sectionColorDot, { backgroundColor: color }]} />}
                    <Text style={[styles.sectionTitle, overdueStyle && styles.sectionTitleOverdue]}>
                        {label}
                    </Text>
                </View>
                <Text style={styles.sectionCount}>{count}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Today</Text>
                    <Text style={styles.headerSubtitle}>
                        {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </Text>
                </View>
                {hasAnything && (
                    <View style={styles.summaryBadge}>
                        {todayTotal > 0 && (
                            <Text style={styles.summaryText}>{todayDone}/{todayTotal} done today</Text>
                        )}
                        {overdueTotal > 0 && (
                            <Text style={[styles.summaryText, styles.summaryOverdue]}>
                                {overdueTotal} overdue
                            </Text>
                        )}
                    </View>
                )}
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {!hasAnything && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>You're all caught up!</Text>
                        <Text style={styles.emptySubtitle}>No tasks due today or overdue.</Text>
                    </View>
                )}

                {overdueTotal > 0 && (
                    <View style={styles.section}>
                        {renderSectionHeader(
                            'overdue',
                            'Overdue',
                            `${overdueTotal} task${overdueTotal !== 1 ? 's' : ''}`,
                            undefined,
                            true
                        )}
                        {!collapsedSections.has('overdue') && (
                            <View style={styles.sectionBody}>
                                {overdueItems.map(({ task, project }) =>
                                    renderTaskRow(task, project.id, project.color)
                                )}
                            </View>
                        )}
                    </View>
                )}

                {todayByProject.map(({ project, tasks }) => {
                    const done = tasks.filter(t => t.completed).length
                    return (
                        <View key={project.id} style={styles.section}>
                            {renderSectionHeader(project.id, project.name, `${done}/${tasks.length}`, project.color)}
                            {!collapsedSections.has(project.id) && (
                                <View style={styles.sectionBody}>
                                    {tasks.map(task => renderTaskRow(task, project.id))}
                                </View>
                            )}
                        </View>
                    )
                })}
            </ScrollView>

            <RescheduleModal
                visible={!!rescheduleTarget}
                taskName={rescheduleTarget?.task.name}
                date={rescheduleDate}
                onChangeDate={setRescheduleDate}
                onSave={handleSaveReschedule}
                onCancel={() => { setRescheduleTarget(null); setRescheduleDate('') }}
            />
        </View>
    )
}