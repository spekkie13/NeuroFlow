import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ScrollView, Alert, SafeAreaView, Text, Pressable } from 'react-native';
import { Project, Task, Account } from '../utils/types';
import TaskView from './TaskView';
import Timeline from './Timeline';
import AccountView from './AccountView';
import BottomNav from './BottomNav';
import {
    saveProjects,
    loadProjects,
    saveAccounts,
    loadAccounts,
    getCurrentAccount,
    setCurrentAccount,
} from '../utils/storage';
import SettingsView from '../../app/components/SettingsView';
import {PlannerProps} from "@/props/PlannerProps";
import {styles} from "@/styles/planner";

type ViewType = 'tasks' | 'timeline' | 'account' | 'settings';

export default function Planner({ user, onLogout }: PlannerProps) {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [currentAccountId, setCurrentAccountId] = useState<string | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<ViewType>('tasks');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // 1) accounts + current account laden
    useEffect(() => {
        const init = async () => {
            const loadedAccounts = await loadAccounts();
            setAccounts(loadedAccounts);

            const savedAccountId = await getCurrentAccount();

            if (savedAccountId && loadedAccounts.find(a => a.id === savedAccountId)) {
                setCurrentAccountId(savedAccountId);
            } else if (loadedAccounts.length > 0) {
                const firstId = loadedAccounts[0].id;
                setCurrentAccountId(firstId);
                await setCurrentAccount(firstId);
            } else {
                setCurrentAccountId(null);
            }

            setIsLoading(false);
        };

        init();
    }, []);

    useEffect(() => {
        const loadForAccount = async () => {
            if (!currentAccountId) {
                setProjects([]);
                setSelectedProjectId(null);
                return;
            }

            const loadedProjects = await loadProjects(currentAccountId);

            const hasInbox = loadedProjects.some(p => p.id === 'inbox');
            let finalProjects = loadedProjects;
            if (!hasInbox) {
                const inbox: Project = {
                    id: 'inbox',
                    name: 'Inbox',
                    tasks: [],
                    color: '#6366F1',
                };
                finalProjects = [inbox, ...loadedProjects];
            }

            setProjects(finalProjects);

            try {
                const last = await AsyncStorage.getItem('lastProjectId');
                if (last && finalProjects.find(p => p.id === last)) {
                    setSelectedProjectId(last);
                } else if (finalProjects.length > 0) {
                    const inbox = finalProjects.find(p => p.id === 'inbox');
                    setSelectedProjectId(inbox ? inbox.id : finalProjects[0].id);
                } else {
                    setSelectedProjectId(null);
                }
            } catch {
                if (finalProjects.length > 0) {
                    const inbox = finalProjects.find(p => p.id === 'inbox');
                    setSelectedProjectId(inbox ? inbox.id : finalProjects[0].id);
                }
            }
        };

        loadForAccount();
    }, [currentAccountId]);

    useEffect(() => {
        const persist = async () => {
            if (currentAccountId) {
                await saveProjects(projects, currentAccountId);
            }
        };
        persist();
    }, [projects, currentAccountId]);

    useEffect(() => {
        if (!selectedProjectId) return;
        AsyncStorage.setItem('lastProjectId', selectedProjectId).catch(() => {});
    }, [selectedProjectId]);

    const selectedProject =
        selectedProjectId ? projects.find(p => p.id === selectedProjectId) ?? null : null;

    // ==== Project handlers =====
    const handleAddProject = (name: string, color: string) => {
        const newProject: Project = {
            id: Date.now().toString(),
            name,
            tasks: [],
            color,
        };
        setProjects(prev => [...prev, newProject]);
        setSelectedProjectId(newProject.id);
    };

    const handleUpdateProject = (projectId: string, updates: Partial<Project>) => {
        setProjects(prev =>
            prev.map(p => (p.id === projectId ? { ...p, ...updates } : p)),
        );
    };

    const handleDeleteProject = (projectId: string) => {
        if (projectId === 'inbox') {
            Alert.alert('Not allowed', 'Inbox cannot be deleted');
            return;
        }

        setProjects(prev => {
            const next = prev.filter(p => p.id !== projectId);

            if (projectId === selectedProjectId) {
                if (next.length > 0) {
                    const inbox = next.find(p => p.id === 'inbox');
                    setSelectedProjectId(inbox ? inbox.id : next[0].id);
                } else {
                    setSelectedProjectId(null);
                }
            }

            return next;
        });
    };

    // ==== Task handlers =====
    const handleAddTask = (projectId: string, task: Task) => {
        setProjects(prev =>
            prev.map(p =>
                p.id === projectId ? { ...p, tasks: [...p.tasks, task] } : p,
            ),
        );
    };

    const handleUpdateTask = (
        projectId: string,
        taskId: string,
        updates: Partial<Task>,
    ) => {
        setProjects(prev =>
            prev.map(p =>
                p.id === projectId
                    ? {
                        ...p,
                        tasks: p.tasks.map(t =>
                            t.id === taskId ? { ...t, ...updates } : t,
                        ),
                    }
                    : p,
            ),
        );
    };

    const handleDeleteTask = (projectId: string, taskId: string) => {
        setProjects(prev =>
            prev.map(p =>
                p.id === projectId
                    ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId) }
                    : p,
            ),
        );
    };

    // inbox-add direct
    const handleAddToInbox = (task: Task) => {
        setProjects(prev => {
            const inbox = prev.find(p => p.id === 'inbox');
            if (!inbox) {
                const newInbox: Project = {
                    id: 'inbox',
                    name: 'Inbox',
                    tasks: [task],
                    color: '#6366F1',
                };
                return [newInbox, ...prev];
            }

            return prev.map(p =>
                p.id === 'inbox' ? { ...p, tasks: [...p.tasks, task] } : p,
            );
        });

        setSelectedProjectId('inbox');
    };

    // ==== Account handlers =====
    const handleAddAccount = (name: string) => {
        const newAccount: Account = {
            id: Date.now().toString(),
            name,
            createdAt: new Date().toISOString(),
        };
        const updatedAccounts = [...accounts, newAccount];
        setAccounts(updatedAccounts);
        saveAccounts(updatedAccounts);

        if (!currentAccountId) {
            setCurrentAccountId(newAccount.id);
            setCurrentAccount(newAccount.id);
        }
    };

    const handleUpdateAccount = (accountId: string, name: string) => {
        const updatedAccounts = accounts.map(a =>
            a.id === accountId ? { ...a, name } : a,
        );
        setAccounts(updatedAccounts);
        saveAccounts(updatedAccounts);
    };

    const handleDeleteAccount = (accountId: string) => {
        if (accounts.length === 1) {
            Alert.alert('Not allowed', 'You must have at least one account');
            return;
        }
        const updatedAccounts = accounts.filter(a => a.id !== accountId);
        setAccounts(updatedAccounts);
        saveAccounts(updatedAccounts);

        if (currentAccountId === accountId) {
            const newAccountId = updatedAccounts[0].id;
            setCurrentAccountId(newAccountId);
            setCurrentAccount(newAccountId);
        }
    };

    const handleSwitchAccount = (accountId: string) => {
        setCurrentAccountId(accountId);
        setCurrentAccount(accountId);
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ color: '#6B7280' }}>Loading…</Text>
                </View>
            </SafeAreaView>
        );
    }

    const noWorkspace = !currentAccountId || accounts.length === 0;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                {noWorkspace ? (
                    <View style={styles.emptyWorkspace}>
                        <Text style={styles.wsTitle}>No workspace yet 🧩</Text>
                        <Text style={styles.wsSubtitle}>
                            Create a workspace to start organizing your projects.
                        </Text>

                        <Pressable
                            onPress={() => handleAddAccount('My First Workspace')}
                            style={styles.createWorkspaceBtn}
                        >
                            <Text style={styles.createWorkspaceBtnText}>+ Create workspace</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setCurrentView('account')}
                            style={[styles.createWorkspaceBtn, { backgroundColor: '#111827', marginTop: 10 }]}
                        >
                            <Text style={[styles.createWorkspaceBtnText, { color: '#FFFFFF' }]}>
                                Open Accounts
                            </Text>
                        </Pressable>
                    </View>
                ) : (
                    <>
                        {currentView === 'tasks' &&
                            (selectedProject ? (
                                <TaskView
                                    project={selectedProject}
                                    allProjects={projects}
                                    onSelectProject={setSelectedProjectId}
                                    onAddProject={handleAddProject}
                                    onAddTask={task => handleAddTask(selectedProject.id, task)}
                                    onUpdateTask={(taskId, updates) =>
                                        handleUpdateTask(selectedProject.id, taskId, updates)
                                    }
                                    onDeleteTask={taskId =>
                                        handleDeleteTask(selectedProject.id, taskId)
                                    }
                                    onAddToInbox={handleAddToInbox}
                                />
                            ) : (
                                <View style={styles.emptyTimeline}>
                                    <Text style={styles.emptyTitle}>Nog geen projecten</Text>
                                    <Text style={styles.emptySubtitle}>
                                        Maak er eentje aan en we gaan je helpen focussen ✨
                                    </Text>
                                </View>
                            ))}

                        {currentView === 'timeline' && (
                            <ScrollView
                                style={styles.timelineContainer}
                                contentContainerStyle={{ paddingBottom: 90 }}
                            >
                                {projects.map(project => (
                                    <View key={project.id} style={styles.timelineBlock}>
                                        <View style={styles.timelineHeader}>
                                            <View
                                                style={[styles.colorDot, { backgroundColor: project.color }]}
                                            />
                                            <Text style={styles.timelineTitle}>{project.name}</Text>
                                        </View>
                                        <Timeline
                                            project={project}
                                            onAddTask={task => handleAddTask(project.id, task)}
                                            onUpdateTask={(taskId, updates) =>
                                                handleUpdateTask(project.id, taskId, updates)
                                            }
                                        />
                                    </View>
                                ))}

                                {projects.length === 0 && (
                                    <View style={styles.emptyTimeline}>
                                        <Text style={styles.emptyTitle}>No projects yet</Text>
                                        <Text style={styles.emptySubtitle}>
                                            Go to Tasks view to create your first project
                                        </Text>
                                    </View>
                                )}
                            </ScrollView>
                        )}

                        {currentView === 'account' && (
                            <AccountView
                                accounts={accounts}
                                currentAccountId={currentAccountId}
                                onAddAccount={handleAddAccount}
                                onUpdateAccount={handleUpdateAccount}
                                onDeleteAccount={handleDeleteAccount}
                                onSwitchAccount={handleSwitchAccount}
                                user={user}
                                onLogout={onLogout}
                            />
                        )}

                        {currentView === 'settings' && (
                            <SettingsView user={user} onLogout={onLogout} />
                        )}
                    </>
                )}

                <BottomNav currentView={currentView} onViewChange={setCurrentView} />
            </View>
        </SafeAreaView>
    );
}
