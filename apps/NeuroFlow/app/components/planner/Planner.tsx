import React, { useEffect, useState } from 'react'
import {SafeAreaView, View, Text, Alert } from 'react-native'
import {PlannerProps, PlannerView} from "../../props/planner/PlannerProps";
import {useWorkspaces} from "../../hooks/useWorkspaces";
import {useProjects} from "../../hooks/useProjects";
import {useGlobalSettings} from "../../hooks/useGlobalSettings";
import {initNotificationHandler, requestPermissions, scheduleAllReminders} from "../../services/notifications/NotificationService";
import {plannerStyles} from "../../styles/planner/planner.styles";
import {TodayView} from "../today/TodayView";
import {SettingsView} from "../account/SettingsView";
import {WorkspaceSwitcherBar} from "../workspace/WorkspaceSwitcherBar";
import BottomNav from "../ui/BottomNav";
import {WorkspaceSwitcherModal} from "../workspace/WorkspaceSwitcherModal";
import {SyncErrorBanner} from "../ui/SyncErrorBanner";
import {TasksScreen} from "./TaskScreen";
import {TimelineScreen} from "./TimelineScreen";
import {Workspace} from "../../models/Workspace";

export const Planner: React.FC<PlannerProps> = ({ user, onSignOut }: PlannerProps) => {
    const [currentView, setCurrentView] = useState<PlannerView>('tasks')
    const [isWorkspaceSwitcherVisible, setIsWorkspaceSwitcherVisible] = useState(false)

    const {
        workspaces,
        currentWorkspaceId,
        isLoading: accountsLoading,
        syncError: syncWorkspaceError,
        addWorkspace,
        updateWorkspace,
        deleteWorkspace,
        switchWorkspace,
        setDailyBudget,
    } = useWorkspaces(user.id)

    const {
        projects,
        isLoading: projectsLoading,
        syncError: syncProjectsError,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        addRoutine,
        updateRoutine,
        deleteRoutine,
    } = useProjects(currentWorkspaceId, user.id)

    const currentWorkspace: Workspace | null = workspaces.find((w: Workspace) => w.id === currentWorkspaceId) ?? null
    const dailyMinutes: number | null = currentWorkspace?.dailyMinutes ?? null

    const { globalReminderTime, setGlobalReminder } = useGlobalSettings(user.id)

    useEffect(() => { initNotificationHandler() }, [])

    useEffect(() => {
        scheduleAllReminders(projects, globalReminderTime)
    }, [projects, globalReminderTime])

    const alertPermissionDenied = () => Alert.alert(
        'Notifications disabled',
        'Enable notifications for NeuroFlow in your device Settings to use reminders.',
    )

    const handleSetGlobalReminder = async (time: string | null) => {
        if (time !== null) {
            const granted: boolean = await requestPermissions()
            if (!granted) { alertPermissionDenied(); return }
        }
        await setGlobalReminder(time)
    }

    const renderContent = () => {
        if (accountsLoading) {
            return (
                <View style={plannerStyles.center}>
                    <Text>Loading workspaces...</Text>
                </View>
            )
        }

        switch (currentView) {
            case 'tasks':
                return (
                    <TasksScreen
                        currentWorkspaceId={currentWorkspaceId}
                        projectsLoading={projectsLoading}
                        projects={projects}
                        globalReminderTime={globalReminderTime}
                        onAddProject={addProject}
                        onUpdateProject={updateProject}
                        onDeleteProject={deleteProject}
                        onAddTask={addTask}
                        onUpdateTask={updateTask}
                        onDeleteTask={deleteTask}
                        onMoveTask={moveTask}
                        onAddRoutine={addRoutine}
                        onUpdateRoutine={updateRoutine}
                        onDeleteRoutine={deleteRoutine}
                    />
                )
            case 'today':
                return (
                    <TodayView
                        projects={projects}
                        onUpdateTask={(projectId, taskId, updates) => updateTask(projectId, taskId, updates)}
                    />
                )
            case 'timeline':
                return (
                    <TimelineScreen
                        projects={projects}
                        dailyMinutes={dailyMinutes}
                        onAddTask={addTask}
                        onUpdateTask={updateTask}
                    />
                )
            case 'settings':
                return (
                    <SettingsView
                        user={user}
                        workspaces={workspaces}
                        currentWorkspaceId={currentWorkspaceId}
                        globalReminderTime={globalReminderTime}
                        onAddWorkspace={addWorkspace}
                        onUpdateWorkspace={updateWorkspace}
                        onDeleteWorkspace={deleteWorkspace}
                        onSwitchWorkspace={switchWorkspace}
                        onSetDailyBudget={setDailyBudget}
                        onSetGlobalReminder={handleSetGlobalReminder}
                        onSignOut={onSignOut}
                    />
                )
            default:
                return null
        }
    }

    return (
        <SafeAreaView style={plannerStyles.safeArea}>
            {currentWorkspace && (
                <WorkspaceSwitcherBar
                    workspaceName={currentWorkspace.name}
                    onPress={() => setIsWorkspaceSwitcherVisible(true)}
                />
            )}
            <SyncErrorBanner
                workspaceError={syncWorkspaceError}
                projectError={syncProjectsError}
            />
            <View style={plannerStyles.container}>{renderContent()}</View>
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
