import React, { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Task, Priority } from '../utils/types';
import { ToastOverlay } from '@/app/components/ToastOverlay';
import { TaskViewProps } from '@/props/TaskViewProps';
import { TaskHeader } from '@/app/components/Task/TaskHeader';
import { TaskInput } from '@/app/components/Task/TaskInput';
import { TaskList } from '@/app/components/Task/TaskList';
import { styles } from '@/styles/taskView';

export default function TaskView({
                                     project,
                                     allProjects,
                                     onSelectProject,
                                     onAddProject,
                                     onAddTask,
                                     onUpdateTask,
                                     onDeleteTask,
                                     onAddToInbox,
                                     onReorderTasks,
                                 }: TaskViewProps) {
    const [newTaskName, setNewTaskName] = useState('');
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editTaskName, setEditTaskName] = useState('');
    const [showPriorityMenu, setShowPriorityMenu] = useState<string | null>(null);
    const [focusMode, setFocusMode] = useState(false);
    const [celebrate, setCelebrate] = useState(false);

    const isInbox = project.id === 'inbox';
    const visibleTasks = focusMode ? project.tasks.slice(0, 1) : project.tasks;

    const handleCreateTask = () => {
        if (!newTaskName.trim()) return;
        const task: Task = {
            id: Date.now().toString(),
            name: newTaskName.trim(),
            completed: false,
            priority: 'medium',
            startDate: null,
            endDate: null,
            notes: '',
        };
        if (!isInbox && onAddToInbox) onAddToInbox(task);
        else onAddTask(task);
        setNewTaskName('');
    };

    const handleToggleComplete = (taskId: string, completed: boolean) => {
        onUpdateTask(taskId, { completed });
        if (completed) {
            setCelebrate(true);
            setTimeout(() => setCelebrate(false), 900);
        }
    };

    const handleSaveEdit = (taskId: string) => {
        onUpdateTask(taskId, { name: editTaskName.trim() || 'Untitled Task' });
        setEditingTaskId(null);
    };

    const handleSetPriority = (taskId: string, priority: Priority) => {
        onUpdateTask(taskId, { priority });
        setShowPriorityMenu(null);
    };

    /**
     * Reorder binnen dezelfde prioriteit
     */
    const handleMoveTask = (taskId: string, direction: 'up' | 'down') => {
        if (!onReorderTasks) return;

        const tasks = project.tasks;
        const index = tasks.findIndex(t => t.id === taskId);
        if (index === -1) return;

        const priority = tasks[index].priority;

        // alle indices met dezelfde priority
        const samePriorityIndices = tasks
            .map((t, i) => (t.priority === priority ? i : -1))
            .filter(i => i !== -1);

        const posInGroup = samePriorityIndices.indexOf(index);
        if (posInGroup === -1) return;

        const newPosInGroup =
            direction === 'up' ? posInGroup - 1 : posInGroup + 1;

        // buiten bereik van deze priority groep? -> niks doen
        if (newPosInGroup < 0 || newPosInGroup >= samePriorityIndices.length) {
            return;
        }

        const swapIndex = samePriorityIndices[newPosInGroup];

        const newTasks = [...tasks];
        const temp = newTasks[index];
        newTasks[index] = newTasks[swapIndex];
        newTasks[swapIndex] = temp;

        onReorderTasks(newTasks);
    };

    return (
        <View style={styles.wrapper}>
            {showPriorityMenu && (
                <Pressable
                    style={styles.overlay}
                    onPress={() => setShowPriorityMenu(null)}
                >
                    <View />
                </Pressable>
            )}

            <ToastOverlay visible={celebrate} />

            <View style={styles.topBar}>
                <Text style={styles.screenTitle}>Projects</Text>
                <Pressable
                    onPress={() => {
                        const name = `Project ${Date.now()}`;
                        const color = '#3B82F6';
                        onAddProject?.(name, color);
                    }}
                    style={styles.addProjectBtn}
                >
                    <Text style={styles.addProjectBtnText}>+ New Project</Text>
                </Pressable>
            </View>

            {/* Project selector + focus */}
            <View style={styles.headerBlock}>
                <TaskHeader
                    project={project}
                    focusMode={focusMode}
                    onToggleFocus={() => setFocusMode(p => !p)}
                    allProjects={allProjects}
                    onSelectProject={onSelectProject}
                />

                {focusMode && (
                    <View style={styles.focusBanner}>
                        <Text style={styles.focusTitle}>Focusmodus aan</Text>
                        <Text style={styles.focusText}>
                            Je ziet nu maar één taak. Werk deze af en zet focus uit of
                            voltooi de taak.
                        </Text>
                        {visibleTasks.length > 0 && (
                            <Text style={styles.focusCurrent}>
                                Huidige taak:{' '}
                                <Text style={styles.focusCurrentName}>
                                    {visibleTasks[0].name}
                                </Text>
                            </Text>
                        )}
                        <Pressable
                            onPress={() => setFocusMode(false)}
                            style={styles.focusExitBtn}
                        >
                            <Text style={styles.focusExitText}>Focus uit</Text>
                        </Pressable>
                    </View>
                )}
            </View>

            {/* Taak invoer */}
            <View style={styles.inputBlock}>
                <TaskInput
                    value={newTaskName}
                    onChange={setNewTaskName}
                    onSubmit={handleCreateTask}
                    placeholder={
                        isInbox
                            ? 'Dump je taak...'
                            : `Taak voor ${project.name}...`
                    }
                />
            </View>

            {/* Lijst */}
            <TaskList
                tasks={visibleTasks}
                editingTaskId={editingTaskId}
                showPriorityMenu={showPriorityMenu}
                onScrollCloseMenu={() => setShowPriorityMenu(null)}
                onStartEdit={(task) => {
                    setEditingTaskId(task.id);
                    setEditTaskName(task.name);
                }}
                onChangeEdit={setEditTaskName}
                editValue={editTaskName}
                onSaveEdit={handleSaveEdit}
                onDeleteTask={onDeleteTask}
                onToggleComplete={handleToggleComplete}
                onTogglePriorityMenu={(taskId) =>
                    setShowPriorityMenu((current) => (current === taskId ? null : taskId))
                }
                onSetPriority={handleSetPriority}
                onReorderTasks={(orderedTasks) => {
                    // Alleen doorgeven naar boven — geen eigen state hier
                    // We willen de volgorde ook persist in Planner, dus:
                    orderedTasks.forEach((t, index) => {
                        // hier niks doen; de echte reorder gebeurt in Planner
                    });
                }}
            />
        </View>
    );
}
