import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Plus, ChevronDown, Pencil } from 'lucide-react-native'
import { Project, Task } from '../../models'
import { styles } from '../../styles/planner'
import { AppButton } from '../ui/AppButton'
import { TaskView } from '../tasks/TaskView'
import { CreateProjectModal } from './CreateProjectModal'
import { ProjectPickerModal } from './ProjectPickerModal'
import { getNextProjectColor } from '../../services/domain/ProjectColorService'
import { requestPermissions } from '../../services/notifications/NotificationService'
import { Alert } from 'react-native'

interface TasksScreenProps {
    currentWorkspaceId: string | null
    projectsLoading: boolean
    projects: Project[]
    globalReminderTime: string | null
    onAddProject: (name: string, color?: string, reminderTime?: string | null) => Promise<void>
    onUpdateProject: (projectId: string, updates: Partial<Project>) => Promise<void>
    onDeleteProject: (projectId: string) => Promise<void>
    onAddTask: (projectId: string, task: Task) => Promise<void>
    onUpdateTask: (projectId: string, taskId: string, updates: Partial<Task>) => Promise<void>
    onDeleteTask: (projectId: string, taskId: string) => Promise<void>
    onMoveTask: (projectId: string, taskId: string, direction: 'up' | 'down' | 'top' | 'bottom') => Promise<void>
}

export const TasksScreen: React.FC<TasksScreenProps> = ({
                                                            currentWorkspaceId,
                                                            projectsLoading,
                                                            projects,
                                                            globalReminderTime,
                                                            onAddProject,
                                                            onUpdateProject,
                                                            onDeleteProject,
                                                            onAddTask,
                                                            onUpdateTask,
                                                            onDeleteTask,
                                                            onMoveTask,
                                                        }) => {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
        projects[0]?.id ?? null
    )
    const [isProjectModalVisible, setIsProjectModalVisible] = useState(false)
    const [isProjectPickerVisible, setIsProjectPickerVisible] = useState(false)
    const [isEditProjectModalVisible, setIsEditProjectModalVisible] = useState(false)
    const [newProjectName, setNewProjectName] = useState('')
    const [newProjectColor, setNewProjectColor] = useState('#2563eb')
    const [newProjectReminderTime, setNewProjectReminderTime] = useState<string | null | undefined>(undefined)
    const [editProjectName, setEditProjectName] = useState('')
    const [editProjectColor, setEditProjectColor] = useState('#2563eb')
    const [editProjectReminderTime, setEditProjectReminderTime] = useState<string | null | undefined>(undefined)

    const activeProject = projects.length === 0
        ? null
        : projects.find(p => p.id === selectedProjectId) ?? projects[0]

    const alertPermissionDenied = () => Alert.alert(
        'Notifications disabled',
        'Enable notifications for NeuroFlow in your device Settings to use reminders.',
    )

    const openProjectModal = () => {
        setNewProjectName('')
        setNewProjectColor(getNextProjectColor(projects))
        setNewProjectReminderTime(undefined)
        setIsProjectModalVisible(true)
    }

    const closeProjectModal = () => {
        setIsProjectModalVisible(false)
        setNewProjectName('')
        setNewProjectReminderTime(undefined)
    }

    const handleCreateProject = async () => {
        const name = newProjectName.trim()
        if (!name) { Alert.alert('No name provided'); return }
        if (typeof newProjectReminderTime === 'string') {
            const granted = await requestPermissions()
            if (!granted) { alertPermissionDenied(); return }
        }
        await onAddProject(name, newProjectColor, newProjectReminderTime)
        closeProjectModal()
    }

    const openEditProjectModal = () => {
        if (!activeProject) return
        setEditProjectName(activeProject.name)
        setEditProjectColor(activeProject.color)
        setEditProjectReminderTime(activeProject.reminderTime)
        setIsEditProjectModalVisible(true)
    }

    const handleSaveEditProject = async () => {
        if (!activeProject) { Alert.alert('No active project'); return }
        if (typeof editProjectReminderTime === 'string') {
            const granted = await requestPermissions()
            if (!granted) { alertPermissionDenied(); return }
        }
        await onUpdateProject(activeProject.id, {
            name: editProjectName.trim() || activeProject.name,
            color: editProjectColor,
            reminderTime: editProjectReminderTime,
        })
        setIsEditProjectModalVisible(false)
    }

    const handleDeleteProject = async () => {
        if (!activeProject) return
        await onDeleteProject(activeProject.id)
        setIsEditProjectModalVisible(false)
    }

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
                reminderTime={newProjectReminderTime}
                globalReminderTime={globalReminderTime}
                onSetReminderTime={setNewProjectReminderTime}
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
                reminderTime={editProjectReminderTime}
                globalReminderTime={globalReminderTime}
                onSetReminderTime={setEditProjectReminderTime}
            />
            <ProjectPickerModal
                visible={isProjectPickerVisible}
                projects={projects}
                activeProjectId={activeProject?.id ?? null}
                onSelectProject={(id) => { setSelectedProjectId(id); setIsProjectPickerVisible(false) }}
                onClose={() => setIsProjectPickerVisible(false)}
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

            <View style={styles.projectDropdownWrapper}>
                <Text style={styles.dropdownLabel}>Current project</Text>
                <View style={styles.projectDropdownRow}>
                    <TouchableOpacity
                        style={[styles.dropdownButton, { flex: 1 }]}
                        activeOpacity={0.8}
                        onPress={() => setIsProjectPickerVisible(true)}
                    >
                        <View style={styles.dropdownLeft}>
                            <View style={[styles.projectDot, { backgroundColor: activeProject.color }]} />
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

            <ScrollView
                style={styles.tasksScroll}
                contentContainerStyle={styles.tasksContent}
            >
                <TaskView
                    project={activeProject}
                    onAddTask={(task) => onAddTask(activeProject.id, task)}
                    onUpdateTask={(taskId, updates) => onUpdateTask(activeProject.id, taskId, updates)}
                    onDeleteTask={(taskId) => onDeleteTask(activeProject.id, taskId)}
                    onMoveTask={(taskId, direction) => onMoveTask(activeProject.id, taskId, direction)}
                />
            </ScrollView>

            {modals}
        </View>
    )
}
