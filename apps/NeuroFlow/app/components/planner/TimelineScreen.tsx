import React, { useRef } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { List } from 'lucide-react-native'
import { Project, Task } from '../../models'
import { timelineScreenStyles } from '../../styles/planner/timelineScreen.styles'
import { Timeline, TimelineHandle } from '../timeline/Timeline'
import { isOverdue } from '../../services/domain/TaskService'

interface TimelineScreenProps {
    projects: Project[]
    dailyMinutes: number | null
    onAddTask: (projectId: string, task: Task) => Promise<void>
    onUpdateTask: (projectId: string, taskId: string, updates: Partial<Task>) => Promise<void>
}

export const TimelineScreen: React.FC<TimelineScreenProps> = ({
                                                                  projects,
                                                                  dailyMinutes,
                                                                  onAddTask,
                                                                  onUpdateTask,
                                                              }) => {
    const timelineRefs = useRef<Record<string, React.RefObject<TimelineHandle | null>>>({})

    const getTimelineRef = (projectId: string): React.RefObject<TimelineHandle | null> => {
        if (!timelineRefs.current[projectId]) {
            timelineRefs.current[projectId] = React.createRef<TimelineHandle>()
        }
        return timelineRefs.current[projectId]
    }

    const getUnscheduledCount = (tasks: Task[]) =>
        tasks.filter(t => !t.completed && (!t.date || isOverdue(t))).length

    if (projects.length === 0) {
        return (
            <View style={timelineScreenStyles.center}>
                <Text style={timelineScreenStyles.emptyTitle}>No projects yet</Text>
                <Text style={timelineScreenStyles.emptySubtitle}>
                    Go to the Tasks tab to create your first project.
                </Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={timelineScreenStyles.timelineHeader}>
                <View>
                    <Text style={timelineScreenStyles.timelineHeaderTitle}>Timeline View</Text>
                    <Text style={timelineScreenStyles.timelineHeaderSubtitle}>Next 14 days</Text>
                </View>
                <TouchableOpacity
                    style={timelineScreenStyles.projectTodayButton}
                    onPress={() => Object.values(timelineRefs.current).forEach(r => r.current?.scrollToToday())}
                    activeOpacity={0.7}
                >
                    <Text style={timelineScreenStyles.projectTodayButtonText}>Today</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={timelineScreenStyles.timelineScroll}
                contentContainerStyle={timelineScreenStyles.timelineContent}
            >
                {projects.map((project) => {
                    const unscheduledCount = getUnscheduledCount(project.tasks)
                    return (
                        <View key={project.id} style={timelineScreenStyles.projectSection}>
                            <View style={timelineScreenStyles.projectHeader}>
                                <View style={timelineScreenStyles.projectHeaderLeft}>
                                    <View style={[timelineScreenStyles.projectColorDot, { backgroundColor: project.color }]} />
                                    <Text style={timelineScreenStyles.projectTitle}>{project.name}</Text>
                                </View>
                                {unscheduledCount > 0 && (
                                    <View style={timelineScreenStyles.projectUnscheduledBadge}>
                                        <List size={13} color="#92400e" />
                                        <Text style={timelineScreenStyles.projectUnscheduledText}>
                                            {unscheduledCount} need scheduling
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <Timeline
                                ref={getTimelineRef(project.id)}
                                project={project}
                                dailyMinutes={dailyMinutes}
                                onAddTask={(task) => onAddTask(project.id, task)}
                                onUpdateTask={(taskId, updates) => onUpdateTask(project.id, taskId, updates)}
                            />
                        </View>
                    )
                })}
            </ScrollView>
        </View>
    )
}
