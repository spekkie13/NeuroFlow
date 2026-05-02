import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity } from 'react-native'
import { Plus, ChevronDown, List, Pencil } from 'lucide-react-native'
import { TaskView } from '@/app/components/tasks/TaskView'
import { AppButton } from '@/app/components/ui/AppButton'
import { Timeline, TimelineHandle } from '@/app/components/timeline/Timeline'
import { getNextProjectColor } from '@/app/services/domain/ProjectColorService'
import { isOverdue } from '@/app/services/domain/TaskService'
import { Task } from '@/app/models/Task'
import { BottomNav } from '@/app/components/ui/BottomNav'
import { SettingsView } from '@/app/components/account/SettingsView'
import { CreateProjectModal } from '@/app/components/planner/CreateProjectModal'
import { ProjectPickerModal } from '@/app/components/planner/ProjectPickerModal'
import { useWorkspaces } from "@/app/hooks/useWorkspaces";
import { useProjects } from '@/app/hooks/useProjects'
import { PlannerProps, PlannerView } from "@/app/props/planner/PlannerProps";
import { styles } from "@/app/styles/planner";
import { WorkspaceSwitcherBar } from '@/app/components/workspace/WorkspaceSwitcherBar'
import { WorkspaceSwitcherModal } from '@/app/components/workspace/WorkspaceSwitcherModal'

export const Planner: React.FC<PlannerProps> = ({ user, onSignOut }) => {
    const [currentView, setCurrentView] = useState<PlannerView>('tasks')
    const [newProjectName, setNewProjectName] = useState('')
    const [newProjectColor, setNewProjectColor] = useState('#2563eb')
    const [isProjectModalVisible, setIsProjectModalVisible] = useState(false)
    const [isProjectPickerVisible, setIsProjectPickerVisible] = useState(false)
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

    const [isEditProjectModalVisible, setIsEditProjectModalVisible] = useState(false)
    const [editProjectName, setEditProjectName] = useState('')
    const [editProjectColor, setEditProjectColor] = useState('#2563eb')
    const [isWorkspaceSwitcherVisible, setIsWorkspaceSwitcherVisible] = useState(false)

    const {
        workspaces,
        currentWorkspaceId,
        isLoading: accountsLoading,
        addWorkspace,
        updateWorkspace,
        deleteWorkspace,
        switchWorkspace,
        setDailyBudget,
    } = useWorkspaces(user.id)

    const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId) ?? null
    const dailyMinutes = currentWorkspace?.dailyMinutes ?? null

    const {
        projects,
        isLoading: projectsLoading,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
    } = useProjects(currentWorkspaceId, user.id)

    useEffect(() => {
        if (!projects.length) {
            setSelectedProjectId(null)
            return
        }
        if (!selectedProjectId || !projects.some((p) => p.id === selectedProjectId)) {
            setSelectedProjectId(projects[0].id)
        }
    }, [projects, selectedProjectId])

    const openProjectModal = () => {
        setNewProjectName('')
        setNewProjectColor(getNextProjectColor(projects))
        setIsProjectModalVisible(true)
    }

    const closeProjectModal = () => {
        setIsProjectModalVisible(false)
        setNewProjectName('')
    }

    const handleCreateProject = async () => {
        const name = newProjectName.trim()
        if (!name) return
        await addProject(name, newProjectColor)
        closeProjectModal()
    }

    const openEditProjectModal = () => {
        if (!activeProject) return
        setEditProjectName(activeProject.name)
        setEditProjectColor(activeProject.color)
        setIsEditProjectModalVisible(true)
    }

    const handleSaveEditProject = async () => {
        if (!activeProject) return
        await updateProject(activeProject.id, {
            name: editProjectName.trim() || activeProject.name,
            color: editProjectColor,
        })
        setIsEditProjectModalVisible(false)
    }

    const handleDeleteProject = async () => {
        if (!activeProject) return
        await deleteProject(activeProject.id)
        setIsEditProjectModalVisible(false)
    }

    const timelineRefs = useRef<Record<string, React.RefObject<TimelineHandle | null>>>({})
    const getTimelineRef = (projectId: string): React.RefObject<TimelineHandle | null> => {
        if (!timelineRefs.current[projectId]) {
            timelineRefs.current[projectId] = React.createRef<TimelineHandle>()
        }
        return timelineRefs.current[projectId]
    }

    const getUnscheduledCount = (tasks: Task[]) =>
        tasks.filter(t => !t.date || isOverdue(t)).length

    const activeProject =
        projects.length === 0
            ? null
            : projects.find((p) => p.id === selectedProjectId) ?? projects[0]

    const openProjectPicker = () => {
        if (!projects.length) return
        setIsProjectPickerVisible(true)
    }

    const closeProjectPicker = () => {
        setIsProjectPickerVisible(false)
    }

    const handleSelectProject = (projectId: string) => {
        setSelectedProjectId(projectId)
        closeProjectPicker()
    }

    const renderTasksView = () => {
        if (!currentWorkspaceId) {
            return (
                <View style={styles.center}>
                    <Text style={styles.emptyTitle}>No active workspace</Text>
                    <Text style={styles.emptySubtitle}>
                        Go to the Account tab to create or select a workspace.
                    </Text>
                </View>
            )
        }

        if (projectsLoading) {
            return (
                <View style={styles.center}>
                    <Text>Loading projects...</Text>
                </View>
            )
        }

        const modals = (
            <>
                <CreateProjectModal
                    visible={isProjectModalVisible}
                    projectName={newProjectName}
                    onChangeProjectName={setNewProjectName}
                    onCreate={handleCreateProject}
                    onCancel={closeProjectModal}
                    selectedColor={newProjectColor}
                    onSelectColor={setNewProjectColor}
                />
                <CreateProjectModal
                    visible={isEditProjectModalVisible}
                    projectName={editProjectName}
                    onChangeProjectName={setEditProjectName}
                    onCreate={handleSaveEditProject}
                    onCancel={() => setIsEditProjectModalVisible(false)}
                    selectedColor={editProjectColor}
                    onSelectColor={setEditProjectColor}
                    editMode
                    onDelete={handleDeleteProject}
                />
                <ProjectPickerModal
                    visible={isProjectPickerVisible}
                    projects={projects}
                    activeProjectId={activeProject?.id ?? null}
                    onSelectProject={handleSelectProject}
                    onClose={closeProjectPicker}
                />
            </>
        )

        if (!projects.length || !activeProject) {
            return (
                <View style={styles.center}>
                    <Text style={styles.emptyTitle}>No projects yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Create your first project to start organizing your tasks.
                    </Text>
                    <AppButton
                        title="Create first project"
                        variant="primary"
                        onPress={openProjectModal}
                        style={{ marginTop: 16 }}
                        leftIcon={<Plus size={18} color="#ffffff" />}
                    />
                    {modals}
                </View>
            )
        }

        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.tasksHeader}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.tasksHeaderTitle}>Tasks</Text>
                        <Text style={styles.tasksHeaderSubtitle}>
                            Plan tasks inside the selected project.
                        </Text>
                    </View>
                    <AppButton
                        title="New"
                        variant="outline"
                        size="sm"
                        onPress={openProjectModal}
                        leftIcon={<Plus size={16} color="#2563eb" />}
                    />
                </View>

                {/* Project dropdown */}
                <View style={styles.projectDropdownWrapper}>
                    <Text style={styles.dropdownLabel}>Current project</Text>
                    <View style={styles.projectDropdownRow}>
                        <TouchableOpacity
                            style={[styles.dropdownButton, { flex: 1 }]}
                            activeOpacity={0.8}
                            onPress={openProjectPicker}
                        >
                            <View style={styles.dropdownLeft}>
                                <View
                                    style={[
                                        styles.projectDot,
                                        { backgroundColor: activeProject.color },
                                    ]}
                                />
                                <Text style={styles.dropdownText} numberOfLines={1}>
                                    {activeProject.name}
                                </Text>
                            </View>
                            <ChevronDown size={16} color="#6b7280" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.projectEditButton}
                            onPress={openEditProjectModal}
                            activeOpacity={0.7}
                        >
                            <Pencil size={15} color="#6b7280" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Active project tasks */}
                <ScrollView
                    style={styles.tasksScroll}
                    contentContainerStyle={styles.tasksContent}
                >
                    <TaskView
                        project={activeProject}
                        onAddTask={(task) => addTask(activeProject.id, task)}
                        onUpdateTask={(taskId, updates) =>
                            updateTask(activeProject.id, taskId, updates)
                        }
                        onDeleteTask={(taskId) => deleteTask(activeProject.id, taskId)}
                        onMoveTask={(taskId, direction) =>
                            moveTask(activeProject.id, taskId, direction)
                        }
                    />
                </ScrollView>

                {modals}
            </View>
        )
    }

    const renderTimelineView = () => {
        if (projects.length === 0) {
            return (
                <View style={styles.center}>
                    <Text style={styles.emptyTitle}>No projects yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Go to the Tasks tab to create your first project.
                    </Text>
                </View>
            )
        }

        return (
            <View style={{ flex: 1 }}>
                {/* Shared header */}
                <View style={styles.timelineHeader}>
                    <View>
                        <Text style={styles.timelineHeaderTitle}>Timeline View</Text>
                        <Text style={styles.timelineHeaderSubtitle}>Next 14 days</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.projectTodayButton}
                        onPress={() => Object.values(timelineRefs.current).forEach(r => r.current?.scrollToToday())}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.projectTodayButtonText}>Today</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.timelineScroll}
                    contentContainerStyle={styles.timelineContent}
                >
                    {projects.map((project) => {
                        const unscheduledCount = getUnscheduledCount(project.tasks)
                        return (
                            <View key={project.id} style={styles.projectSection}>
                                <View style={styles.projectHeader}>
                                    <View style={styles.projectHeaderLeft}>
                                        <View style={[styles.projectColorDot, { backgroundColor: project.color }]} />
                                        <Text style={styles.projectTitle}>{project.name}</Text>
                                    </View>
                                    {unscheduledCount > 0 && (
                                        <View style={styles.projectUnscheduledBadge}>
                                            <List size={13} color="#92400e" />
                                            <Text style={styles.projectUnscheduledText}>
                                                {unscheduledCount} need scheduling
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <Timeline
                                    ref={getTimelineRef(project.id)}
                                    project={project}
                                    dailyMinutes={dailyMinutes}
                                    onAddTask={(task) => addTask(project.id, task)}
                                    onUpdateTask={(taskId, updates) =>
                                        updateTask(project.id, taskId, updates)
                                    }
                                />
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
        )
    }

    const renderSettingsView = () => (
        <SettingsView
            user={user}
            workspaces={workspaces}
            currentWorkspaceId={currentWorkspaceId}
            onAddWorkspace={addWorkspace}
            onUpdateWorkspace={updateWorkspace}
            onDeleteWorkspace={deleteWorkspace}
            onSwitchWorkspace={switchWorkspace}
            onSetDailyBudget={setDailyBudget}
            onSignOut={onSignOut}
        />
    )

    const renderContent = () => {
        if (accountsLoading) {
            return (
                <View style={styles.center}>
                    <Text>Loading workspaces...</Text>
                </View>
            )
        }

        switch (currentView) {
            case 'tasks':
                return renderTasksView()
            case 'timeline':
                return renderTimelineView()
            case 'settings':
                return renderSettingsView()
            default:
                return null
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {currentWorkspace && (
                <WorkspaceSwitcherBar
                    workspaceName={currentWorkspace.name}
                    onPress={() => setIsWorkspaceSwitcherVisible(true)}
                />
            )}
            <View style={styles.container}>{renderContent()}</View>
            <BottomNav currentView={currentView} onViewChange={setCurrentView} />
            <WorkspaceSwitcherModal
                visible={isWorkspaceSwitcherVisible}
                workspaces={workspaces}
                currentWorkspaceId={currentWorkspaceId}
                onSwitch={switchWorkspace}
                onAdd={addWorkspace}
                onClose={() => setIsWorkspaceSwitcherVisible(false)}
            />
        </SafeAreaView>
    )
}

export default Planner;
