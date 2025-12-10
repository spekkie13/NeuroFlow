import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, ScrollView, Text, Modal, TouchableOpacity } from 'react-native'
import { Plus, ChevronDown } from 'lucide-react-native'
import { useAccounts } from '../hooks/useAccounts'
import { useProjects } from '../hooks/useProjects'
import { BottomNav } from './BottomNav'
import { TaskView } from './tasks/TaskView'
import { Timeline } from './Timeline'
import { AccountView } from './account/AccountView'
import { TextField } from './ui/TextField'
import { AppButton } from './ui/AppButton'
import { styles } from "@/app/styles/planner";
import { PlannerView } from "@/app/props/PlannerProps";

export const Planner: React.FC = () => {
    const [currentView, setCurrentView] = useState<PlannerView>('tasks')
    const [newProjectName, setNewProjectName] = useState('')
    const [isProjectModalVisible, setIsProjectModalVisible] = useState(false)
    const [isProjectPickerVisible, setIsProjectPickerVisible] = useState(false)
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
        null,
    )

    const {
        accounts,
        currentAccountId,
        isLoading: accountsLoading,
        addAccount,
        updateAccount,
        deleteAccount,
        switchAccount,
    } = useAccounts()

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
    } = useProjects(currentAccountId)

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

    const renderProjectModal = () => (
        <Modal
            visible={isProjectModalVisible}
            transparent
            animationType="fade"
            onRequestClose={closeProjectModal}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                    <Text style={styles.modalTitle}>New Project</Text>
                    <Text style={styles.modalSubtitle}>
                        Group related tasks into a project to keep your planning focused.
                    </Text>

                    <TextField
                        label="Project name"
                        placeholder="e.g. Morning routine, Study, Work sprint"
                        value={newProjectName}
                        onChangeText={setNewProjectName}
                        autoCapitalize="sentences"
                        returnKeyType="done"
                        onSubmitEditing={handleCreateProject}
                    />

                    <View style={styles.modalButtonsRow}>
                        <AppButton
                            title="Cancel"
                            variant="outline"
                            onPress={closeProjectModal}
                            fullWidth
                        />
                        <AppButton
                            title="Create"
                            variant="primary"
                            onPress={handleCreateProject}
                            fullWidth
                            disabled={!newProjectName.trim()}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )

    const renderProjectPickerModal = () => (
        <Modal
            visible={isProjectPickerVisible}
            transparent
            animationType="fade"
            onRequestClose={closeProjectPicker}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.pickerCard}>
                    <Text style={styles.pickerTitle}>Select project</Text>
                    {projects.map((project) => {
                        const isActive = project.id === activeProject?.id
                        return (
                            <TouchableOpacity
                                key={project.id}
                                style={[
                                    styles.pickerItem,
                                    isActive && styles.pickerItemActive,
                                ]}
                                onPress={() => handleSelectProject(project.id)}
                            >
                                <View
                                    style={[
                                        styles.projectDot,
                                        { backgroundColor: project.color },
                                    ]}
                                />
                                <Text
                                    style={[
                                        styles.pickerItemText,
                                        isActive && styles.pickerItemTextActive,
                                    ]}
                                    numberOfLines={1}
                                >
                                    {project.name}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                    <AppButton
                        title="Close"
                        variant="outline"
                        onPress={closeProjectPicker}
                        fullWidth
                        style={{ marginTop: 8 }}
                    />
                </View>
            </View>
        </Modal>
    )

    const renderTasksView = () => {
        if (!currentAccountId) {
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
                    {renderProjectModal()}
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

                {renderProjectModal()}
                {renderProjectPickerModal()}
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

    const renderAccountView = () => (
        <AccountView
            accounts={accounts}
            currentAccountId={currentAccountId}
            onAddAccount={addAccount}
            onUpdateAccount={updateAccount}
            onDeleteAccount={deleteAccount}
            onSwitchAccount={switchAccount}
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
                return renderAccountView()
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
