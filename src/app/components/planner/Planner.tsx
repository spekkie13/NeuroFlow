import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity } from 'react-native'
import { Plus, ChevronDown } from 'lucide-react-native'
import { TaskView } from '@/app/components/tasks/TaskView'
import { AppButton } from '@/app/components/ui/AppButton'
import { Timeline } from '@/app/components/Timeline'
import { BottomNav } from '@/app/components/BottomNav'
import { SettingsView } from '@/app/components/account/SettingsView'
import { CreateProjectModal } from '@/app/components/planner/CreateProjectModal'
import { ProjectPickerModal } from '@/app/components/planner/ProjectPickerModal'
import { useWorkspaces } from "@/app/hooks/useWorkspaces";
import { useProjects } from '@/app/hooks/useProjects'
import { PlannerView } from "@/app/props/planner/PlannerProps";
import { styles } from "@/app/styles/planner";

export const Planner: React.FC = () => {
    const [currentView, setCurrentView] = useState<PlannerView>('tasks')
    const [newProjectName, setNewProjectName] = useState('')
    const [isProjectModalVisible, setIsProjectModalVisible] = useState(false)
    const [isProjectPickerVisible, setIsProjectPickerVisible] = useState(false)
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

    const {
        workspaces,
        currentWorkspaceId,
        isLoading: accountsLoading,
        addWorkspace,
        updateWorkspace,
        deleteWorkspace,
        switchWorkspace,
    } = useWorkspaces()

    const {
        projects,
        isLoading: projectsLoading,
        addProject,
        // updateProject,
        // deleteProject,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
    } = useProjects()

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
        setIsProjectModalVisible(true)
    }

    const closeProjectModal = () => {
        setIsProjectModalVisible(false)
        setNewProjectName('')
    }

    const handleCreateProject = async () => {
        const name = newProjectName.trim()
        if (!name) return
        await addProject(name)
        closeProjectModal()
    }

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
                    <TouchableOpacity
                        style={styles.dropdownButton}
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
            <ScrollView
                style={styles.timelineScroll}
                contentContainerStyle={styles.timelineContent}
            >
                {projects.map((project) => (
                    <View key={project.id} style={styles.projectSection}>
                        <View style={styles.projectHeader}>
                            <View
                                style={[
                                    styles.projectColorDot,
                                    { backgroundColor: project.color },
                                ]}
                            />
                            <Text style={styles.projectTitle}>{project.name}</Text>
                        </View>
                        <Timeline
                            project={project}
                            onAddTask={(task) => addTask(project.id, task)}
                            onUpdateTask={(taskId, updates) =>
                                updateTask(project.id, taskId, updates)
                            }
                        />
                    </View>
                ))}
            </ScrollView>
        )
    }

    const renderSettingsView = () => (
        <SettingsView
            workspaces={workspaces}
            currentWorkspaceId={currentWorkspaceId}
            onAddWorkspace={addWorkspace}
            onUpdateWorkspace={updateWorkspace}
            onDeleteWorkspace={deleteWorkspace}
            onSwitchWorkspace={switchWorkspace}
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
            <View style={styles.container}>{renderContent()}</View>
            <BottomNav currentView={currentView} onViewChange={setCurrentView} />
        </SafeAreaView>
    )
}

export default Planner;
