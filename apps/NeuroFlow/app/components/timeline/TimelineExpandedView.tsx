import React, { useMemo, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { CheckCircle2, ChevronDown, ChevronRight, Circle } from 'lucide-react-native'
import { Priority, Task } from '../../models'
import { Workspace } from '../../models/Workspace'
import { ProjectWithWorkspace, useAllWorkspacesProjects } from '../../hooks/useAllWorkspacesProjects'
import { isOverdue } from '../../services/domain/TaskService'
import { formatLocalDate, parseLocalDate, toIsoDateString } from '../../utils/dateUtils'
import { getPriorityStyle } from '../../utils/priorityUtils'
import { RescheduleModal } from '../tasks/RescheduleModal'
import { expandedStyles as s } from '../../styles/timeline/timelineExpandedView.styles'

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

interface TimelineExpandedViewProps {
    workspaces: Workspace[]
    userId: string | null
}

export const TimelineExpandedView: React.FC<TimelineExpandedViewProps> = ({ workspaces, userId }) => {
    const { allProjects, isLoading, updateTask } = useAllWorkspacesProjects(workspaces, userId, true)
    const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set(['overdue']))
    const [rescheduleTarget, setRescheduleTarget] = useState<{ entry: ProjectWithWorkspace; task: Task } | null>(null)
    const [rescheduleDate, setRescheduleDate] = useState('')

    const todayStr = useMemo(() => toIsoDateString(new Date())!, [])
    const showWorkspaceBadge = workspaces.length > 1

    const toggleSection = (id: string) => {
        setCollapsedSections(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const overdueItems = useMemo(() =>
        allProjects
            .flatMap(entry => entry.project.tasks.filter(isOverdue).map(task => ({ task, entry })))
            .sort((a, b) => PRIORITY_ORDER[a.task.priority] - PRIORITY_ORDER[b.task.priority]),
        [allProjects]
    )

    const todayByProject = useMemo(() =>
        allProjects
            .map(entry => ({
                entry,
                tasks: entry.project.tasks
                    .filter(t => t.date === todayStr)
                    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]),
            }))
            .filter(({ tasks }) => tasks.length > 0),
        [allProjects, todayStr]
    )

    const todayTotal = todayByProject.reduce((sum, { tasks }) => sum + tasks.length, 0)
    const todayDone = todayByProject.reduce((sum, { tasks }) => sum + tasks.filter(t => t.completed).length, 0)
    const overdueTotal = overdueItems.length
    const hasAnything = todayTotal > 0 || overdueTotal > 0

    const openReschedule = (entry: ProjectWithWorkspace, task: Task) => {
        setRescheduleTarget({ entry, task })
        setRescheduleDate(task.date ? formatLocalDate(task.date) : '')
    }

    const handleSaveReschedule = () => {
        if (!rescheduleTarget || !rescheduleDate) return
        const parsed = parseLocalDate(rescheduleDate)
        if (!parsed) return
        const { entry, task } = rescheduleTarget
        updateTask(entry.workspaceId, entry.project.id, task.id, { date: toIsoDateString(parsed)! })
        setRescheduleTarget(null)
        setRescheduleDate('')
    }

    const renderTaskRow = (task: Task, entry: ProjectWithWorkspace) => (
        <View key={task.id} style={s.taskRow}>
            <TouchableOpacity
                style={s.taskCheckbox}
                onPress={() => updateTask(entry.workspaceId, entry.project.id, task.id, { completed: !task.completed })}
                activeOpacity={0.7}
            >
                {task.completed
                    ? <CheckCircle2 size={18} color="#22c55e" />
                    : <Circle size={18} color="#9ca3af" />
                }
            </TouchableOpacity>
            <TouchableOpacity style={s.taskContent} onPress={() => openReschedule(entry, task)} activeOpacity={0.7}>
                <Text style={[s.taskName, task.completed && s.taskNameDone]} numberOfLines={2}>
                    {task.name}
                </Text>
            </TouchableOpacity>
            <View style={[s.priorityBadge, getPriorityStyle(task.priority, s.priorityHigh, s.priorityMedium, s.priorityLow)]}>
                <Text style={s.priorityText}>{task.priority}</Text>
            </View>
        </View>
    )

    const renderSectionHeader = (
        id: string,
        label: string,
        count: string,
        color?: string,
        workspaceName?: string,
        overdueStyle?: boolean,
    ) => {
        const isCollapsed = collapsedSections.has(id)
        return (
            <TouchableOpacity style={s.sectionHeader} onPress={() => toggleSection(id)} activeOpacity={0.7}>
                <View style={s.sectionHeaderLeft}>
                    {isCollapsed
                        ? <ChevronRight size={16} color="#6b7280" />
                        : <ChevronDown size={16} color="#6b7280" />
                    }
                    {color && <View style={[s.sectionColorDot, { backgroundColor: color }]} />}
                    <View style={s.sectionTitleRow}>
                        <Text style={[s.sectionTitle, overdueStyle && s.sectionTitleOverdue]}>{label}</Text>
                        {workspaceName && (
                            <View style={s.workspaceBadge}>
                                <Text style={s.workspaceBadgeText}>{workspaceName}</Text>
                            </View>
                        )}
                    </View>
                </View>
                <Text style={s.sectionCount}>{count}</Text>
            </TouchableOpacity>
        )
    }

    if (isLoading) {
        return (
            <View style={s.loadingContainer}>
                <Text style={s.loadingText}>Loading all workspaces…</Text>
            </View>
        )
    }

    return (
        <View style={s.container}>
            <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
                {!hasAnything && (
                    <View style={s.emptyState}>
                        <Text style={s.emptyTitle}>Nothing planned for today</Text>
                        <Text style={s.emptySubtitle}>No tasks scheduled today or overdue across any workspace.</Text>
                    </View>
                )}

                {overdueTotal > 0 && (
                    <View style={s.section}>
                        {renderSectionHeader(
                            'overdue',
                            'Overdue',
                            `${overdueTotal} task${overdueTotal !== 1 ? 's' : ''}`,
                            undefined,
                            undefined,
                            true,
                        )}
                        {!collapsedSections.has('overdue') && (
                            <View style={s.sectionBody}>
                                {overdueItems.map(({ task, entry }) => renderTaskRow(task, entry))}
                            </View>
                        )}
                    </View>
                )}

                {todayByProject.map(({ entry, tasks }) => {
                    const done = tasks.filter(t => t.completed).length
                    return (
                        <View key={`${entry.workspaceId}-${entry.project.id}`} style={s.section}>
                            {renderSectionHeader(
                                `${entry.workspaceId}-${entry.project.id}`,
                                entry.project.name,
                                `${done}/${tasks.length}`,
                                entry.project.color,
                                showWorkspaceBadge ? entry.workspaceName : undefined,
                            )}
                            {!collapsedSections.has(`${entry.workspaceId}-${entry.project.id}`) && (
                                <View style={s.sectionBody}>
                                    {tasks.map(task => renderTaskRow(task, entry))}
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
                hasDate={!!rescheduleTarget?.task.date}
                onChangeDate={setRescheduleDate}
                onSave={handleSaveReschedule}
                onClear={() => {
                    if (!rescheduleTarget) return
                    const { entry, task } = rescheduleTarget
                    updateTask(entry.workspaceId, entry.project.id, task.id, { date: null })
                    setRescheduleTarget(null)
                    setRescheduleDate('')
                }}
                onCancel={() => { setRescheduleTarget(null); setRescheduleDate('') }}
            />
        </View>
    )
}
