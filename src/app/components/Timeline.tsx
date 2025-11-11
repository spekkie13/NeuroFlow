import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Modal, TextInput } from 'react-native';
import { Project, Task, Priority } from '../utils/types';
import {
    Plus as PlusIcon,
    X as XIcon,
    List as ListIcon,
    CheckCircle as CheckCircleIcon,
    Circle as CircleIcon,
} from 'lucide-react-native';

interface TimelineProps {
    project: Project;
    onAddTask: (task: Task) => void;
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export default function Timeline({ project, onAddTask, onUpdateTask }: TimelineProps) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [modalTab, setModalTab] = useState<'new' | 'existing'>('new');
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskPriority, setNewTaskPriority] =
        useState<Priority>('medium');
    const [taskStartDate, setTaskStartDate] = useState('');
    const [taskEndDate, setTaskEndDate] = useState('');
    const [selectedExistingTaskId, setSelectedExistingTaskId] = useState<
        string | null
    >(null);

    // ongeplande taken
    const unscheduledTasks = project.tasks.filter(
        (task) => !task.startDate || !task.endDate
    );

    const handleOpenAddModal = (date: Date) => {
        setSelectedDate(date);
        const dateStr = date.toISOString().split('T')[0];
        setTaskStartDate(dateStr);
        setTaskEndDate(dateStr);
        setNewTaskName('');
        setNewTaskPriority('medium');
        setSelectedExistingTaskId(null);
        setModalTab(unscheduledTasks.length > 0 ? 'existing' : 'new');
        setShowAddModal(true);
    };

    const handleAddNewTask = () => {
        if (!newTaskName.trim() || !taskStartDate || !taskEndDate) return;
        const newTask: Task = {
            id: Date.now().toString(),
            name: newTaskName.trim(),
            completed: false,
            priority: newTaskPriority,
            startDate: new Date(taskStartDate).toISOString(),
            endDate: new Date(taskEndDate).toISOString(),
            notes: '',
        };
        onAddTask(newTask);
        setShowAddModal(false);
        setNewTaskName('');
    };

    const handleAddExistingTask = () => {
        if (!selectedExistingTaskId || !taskStartDate || !taskEndDate) return;
        onUpdateTask(selectedExistingTaskId, {
            startDate: new Date(taskStartDate).toISOString(),
            endDate: new Date(taskEndDate).toISOString(),
        });
        setShowAddModal(false);
        setSelectedExistingTaskId(null);
    };

    const toggleTaskComplete = (taskId: string, completed: boolean) => {
        onUpdateTask(taskId, { completed });
    };

    // 14-dagen range
    const today = new Date();
    const dates = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        return d;
    });

    // taken per dag
    const tasksByDate = dates.map((date) => {
        const dateStr = date.toISOString().split('T')[0];
        return {
            date,
            tasks: project.tasks.filter((task) => {
                if (!task.startDate || !task.endDate) return false;
                const start = new Date(task.startDate).toISOString().split('T')[0];
                const end = new Date(task.endDate).toISOString().split('T')[0];
                return dateStr >= start && dateStr <= end;
            }),
        };
    });

    const getPriorityStyle = (priority: Priority) => {
        switch (priority) {
            case 'high':
                return {
                    backgroundColor: '#FEF2F2',
                    borderColor: '#FECACA',
                    color: '#B91C1C',
                };
            case 'medium':
                return {
                    backgroundColor: '#FFFBEB',
                    borderColor: '#FDE68A',
                    color: '#92400E',
                };
            case 'low':
                return {
                    backgroundColor: '#ECFDF3',
                    borderColor: '#BBF7D0',
                    color: '#166534',
                };
        }
    };

    return (
        <View>
            {/* header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Timeline View</Text>
                    <Text style={styles.subtitle}>Next 14 days</Text>
                </View>
                {unscheduledTasks.length > 0 && (
                    <View style={styles.unscheduledBadge}>
                        <ListIcon size={16} color="#B45309" />
                        <Text style={styles.unscheduledText}>
                            {unscheduledTasks.length} unscheduled task
                            {unscheduledTasks.length !== 1 ? 's' : ''}
                        </Text>
                    </View>
                )}
            </View>

            {/* horizontal timeline */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
            >
                <View style={styles.timelineRow}>
                    {dates.map((date, index) => (
                        <View key={index} style={styles.dayColumn}>
                            <View style={styles.dayHeader}>
                                <Text style={styles.dayWeek}>
                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                </Text>
                                <Text style={styles.dayDate}>
                                    {date.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </Text>
                            </View>
                            <View style={styles.dayBody}>
                                {tasksByDate[index].tasks.map((task) => (
                                    <View
                                        key={task.id}
                                        style={[
                                            styles.taskCard,
                                            task.completed && styles.taskCardCompleted,
                                            {
                                                borderLeftColor: task.completed
                                                    ? '#9CA3AF'
                                                    : project.color,
                                            },
                                        ]}
                                    >
                                        <Pressable
                                            onPress={() =>
                                                toggleTaskComplete(task.id, !task.completed)
                                            }
                                            style={styles.taskCheck}
                                        >
                                            {task.completed ? (
                                                <CheckCircleIcon size={16} color="#22C55E" />
                                            ) : (
                                                <CircleIcon size={16} color="#9CA3AF" />
                                            )}
                                        </Pressable>
                                        <View style={styles.taskInfo}>
                                            <Text
                                                numberOfLines={1}
                                                style={[
                                                    styles.taskName,
                                                    task.completed && styles.taskNameDone,
                                                ]}
                                            >
                                                {task.name}
                                            </Text>
                                            <Text style={styles.taskDates}>
                                                {new Date(task.startDate!).toLocaleDateString(
                                                    'en-US',
                                                    {
                                                        month: 'short',
                                                        day: 'numeric',
                                                    }
                                                )}{' '}
                                                -{' '}
                                                {new Date(task.endDate!).toLocaleDateString(
                                                    'en-US',
                                                    {
                                                        month: 'short',
                                                        day: 'numeric',
                                                    }
                                                )}
                                            </Text>
                                        </View>
                                    </View>
                                ))}

                                {/* add task for this day */}
                                <Pressable
                                    onPress={() => handleOpenAddModal(date)}
                                    style={styles.addDayButton}
                                >
                                    <PlusIcon size={14} color="#6B7280" />
                                    <Text style={styles.addDayText}>Add task</Text>
                                </Pressable>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* modal */}
            <Modal
                visible={showAddModal}
                animationType="fade"
                transparent
                onRequestClose={() => setShowAddModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        {/* header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Schedule Task</Text>
                            <Pressable
                                onPress={() => setShowAddModal(false)}
                                style={styles.closeButton}
                            >
                                <XIcon size={20} color="#6B7280" />
                            </Pressable>
                        </View>

                        {/* tabs */}
                        <View style={styles.tabRow}>
                            <Pressable
                                onPress={() => setModalTab('existing')}
                                style={[
                                    styles.tab,
                                    modalTab === 'existing' && styles.tabActive,
                                ]}
                            >
                                <View style={styles.tabInnerRow}>
                                    <ListIcon
                                        size={16}
                                        color={modalTab === 'existing' ? '#2563EB' : '#6B7280'}
                                    />
                                    <Text
                                        style={[
                                            styles.tabText,
                                            modalTab === 'existing' && styles.tabTextActive,
                                        ]}
                                    >
                                        Add Existing ({unscheduledTasks.length})
                                    </Text>
                                </View>
                            </Pressable>
                            <Pressable
                                onPress={() => setModalTab('new')}
                                style={[
                                    styles.tab,
                                    modalTab === 'new' && styles.tabActive,
                                ]}
                            >
                                <View style={styles.tabInnerRow}>
                                    <PlusIcon
                                        size={16}
                                        color={modalTab === 'new' ? '#2563EB' : '#6B7280'}
                                    />
                                    <Text
                                        style={[
                                            styles.tabText,
                                            modalTab === 'new' && styles.tabTextActive,
                                        ]}
                                    >
                                        Create New
                                    </Text>
                                </View>
                            </Pressable>
                        </View>

                        {/* body */}
                        <ScrollView style={styles.modalBody}>
                            {modalTab === 'new' ? (
                                <View style={{ gap: 12 }}>
                                    <View>
                                        <Text style={styles.label}>Task Name</Text>
                                        <TextInput
                                            value={newTaskName}
                                            onChangeText={setNewTaskName}
                                            placeholder="Enter task name..."
                                            style={styles.input}
                                            placeholderTextColor="#9CA3AF"
                                        />
                                    </View>
                                    <View>
                                        <Text style={styles.label}>Priority</Text>
                                        <View style={styles.priorityRow}>
                                            <Pressable
                                                onPress={() => setNewTaskPriority('low')}
                                                style={[
                                                    styles.priorityButton,
                                                    newTaskPriority === 'low' &&
                                                    styles.priorityButtonActiveLow,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.priorityButtonText,
                                                        newTaskPriority === 'low' &&
                                                        styles.priorityButtonTextActive,
                                                    ]}
                                                >
                                                    Low
                                                </Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => setNewTaskPriority('medium')}
                                                style={[
                                                    styles.priorityButton,
                                                    newTaskPriority === 'medium' &&
                                                    styles.priorityButtonActiveMedium,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.priorityButtonText,
                                                        newTaskPriority === 'medium' &&
                                                        styles.priorityButtonTextActive,
                                                    ]}
                                                >
                                                    Medium
                                                </Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => setNewTaskPriority('high')}
                                                style={[
                                                    styles.priorityButton,
                                                    newTaskPriority === 'high' &&
                                                    styles.priorityButtonActiveHigh,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.priorityButtonText,
                                                        newTaskPriority === 'high' &&
                                                        styles.priorityButtonTextActive,
                                                    ]}
                                                >
                                                    High
                                                </Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                    <View style={styles.dateRow}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.label}>Start Date</Text>
                                            <TextInput
                                                value={taskStartDate}
                                                onChangeText={setTaskStartDate}
                                                placeholder="YYYY-MM-DD"
                                                style={styles.input}
                                                placeholderTextColor="#9CA3AF"
                                            />
                                        </View>
                                        <View style={{ width: 12 }} />
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.label}>End Date</Text>
                                            <TextInput
                                                value={taskEndDate}
                                                onChangeText={setTaskEndDate}
                                                placeholder="YYYY-MM-DD"
                                                style={styles.input}
                                                placeholderTextColor="#9CA3AF"
                                            />
                                        </View>
                                    </View>
                                </View>
                            ) : (
                                <View style={{ gap: 12 }}>
                                    {unscheduledTasks.length === 0 ? (
                                        <View style={styles.emptyUnscheduled}>
                                            <ListIcon size={48} color="#9CA3AF" />
                                            <Text style={styles.emptyUnscheduledTitle}>
                                                No unscheduled tasks
                                            </Text>
                                            <Text style={styles.emptyUnscheduledSubtitle}>
                                                All tasks have been scheduled
                                            </Text>
                                        </View>
                                    ) : (
                                        <>
                                            <View>
                                                <Text style={styles.label}>Select Task</Text>
                                                <View style={styles.existingList}>
                                                    {unscheduledTasks.map((task) => {
                                                        const pStyle = getPriorityStyle(task.priority);
                                                        return (
                                                            <Pressable
                                                                key={task.id}
                                                                onPress={() =>
                                                                    setSelectedExistingTaskId(task.id)
                                                                }
                                                                style={[
                                                                    styles.existingItem,
                                                                    selectedExistingTaskId === task.id &&
                                                                    styles.existingItemActive,
                                                                ]}
                                                            >
                                                                <View style={{ flex: 1 }}>
                                                                    <Text
                                                                        style={styles.existingItemText}
                                                                        numberOfLines={1}
                                                                    >
                                                                        {task.name}
                                                                    </Text>
                                                                </View>
                                                                <View
                                                                    style={[
                                                                        styles.priorityPill,
                                                                        {
                                                                            backgroundColor: pStyle.backgroundColor,
                                                                            borderColor: pStyle.borderColor,
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Text
                                                                        style={[
                                                                            styles.priorityPillText,
                                                                            { color: pStyle.color },
                                                                        ]}
                                                                    >
                                                                        {task.priority}
                                                                    </Text>
                                                                </View>
                                                            </Pressable>
                                                        );
                                                    })}
                                                </View>
                                            </View>
                                            <View style={styles.dateRow}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.label}>Start Date</Text>
                                                    <TextInput
                                                        value={taskStartDate}
                                                        onChangeText={setTaskStartDate}
                                                        placeholder="YYYY-MM-DD"
                                                        style={styles.input}
                                                        placeholderTextColor="#9CA3AF"
                                                    />
                                                </View>
                                                <View style={{ width: 12 }} />
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.label}>End Date</Text>
                                                    <TextInput
                                                        value={taskEndDate}
                                                        onChangeText={setTaskEndDate}
                                                        placeholder="YYYY-MM-DD"
                                                        style={styles.input}
                                                        placeholderTextColor="#9CA3AF"
                                                    />
                                                </View>
                                            </View>
                                        </>
                                    )}
                                </View>
                            )}
                        </ScrollView>

                        {/* footer */}
                        <View style={styles.modalFooter}>
                            <Pressable
                                onPress={() => setShowAddModal(false)}
                                style={styles.secondaryBtn}
                            >
                                <Text style={styles.secondaryBtnText}>Cancel</Text>
                            </Pressable>
                            {modalTab === 'new' ? (
                                <Pressable
                                    onPress={handleAddNewTask}
                                    disabled={
                                        !newTaskName.trim() || !taskStartDate || !taskEndDate
                                    }
                                    style={[
                                        styles.primaryBtn,
                                        (!newTaskName.trim() || !taskStartDate || !taskEndDate) &&
                                        styles.primaryBtnDisabled,
                                    ]}
                                >
                                    <Text style={styles.primaryBtnText}>
                                        Create & Schedule
                                    </Text>
                                </Pressable>
                            ) : (
                                <Pressable
                                    onPress={handleAddExistingTask}
                                    disabled={
                                        !selectedExistingTaskId ||
                                        !taskStartDate ||
                                        !taskEndDate
                                    }
                                    style={[
                                        styles.primaryBtn,
                                        (!selectedExistingTaskId ||
                                            !taskStartDate ||
                                            !taskEndDate) &&
                                        styles.primaryBtnDisabled,
                                    ]}
                                >
                                    <Text style={styles.primaryBtnText}>Schedule Task</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
    subtitle: { fontSize: 13, color: '#6B7280', marginTop: 2 },
    unscheduledBadge: {
        flexDirection: 'row',
        gap: 6,
        backgroundColor: '#FFFBEB',
        borderWidth: 1,
        borderColor: '#FDE68A',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
        alignItems: 'center',
    },
    unscheduledText: {
        color: '#B45309',
        fontSize: 12,
        fontWeight: '500',
    },
    horizontalScroll: {
        marginHorizontal: -16,
        paddingHorizontal: 16,
    },
    timelineRow: {
        flexDirection: 'row',
        gap: 0,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        overflow: 'hidden',
    },
    dayColumn: {
        width: 160,
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    dayHeader: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    dayWeek: {
        fontSize: 11,
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    dayDate: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginTop: 2,
    },
    dayBody: {
        padding: 10,
        minHeight: 200,
    },
    taskCard: {
        flexDirection: 'row',
        gap: 6,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 10,
        marginBottom: 6,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
    },
    taskCardCompleted: {
        backgroundColor: '#F3F4F6',
    },
    taskCheck: {
        padding: 6,
    },
    taskInfo: {
        flex: 1,
        paddingVertical: 6,
    },
    taskName: {
        fontSize: 12,
        fontWeight: '500',
        color: '#1F2937',
        marginBottom: 2,
    },
    taskNameDone: {
        color: '#6B7280',
        textDecorationLine: 'line-through',
    },
    taskDates: {
        fontSize: 11,
        color: '#6B7280',
    },
    addDayButton: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#D1D5DB',
        borderRadius: 10,
        paddingVertical: 8,
        marginTop: 6,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 4,
    },
    addDayText: {
        fontSize: 11,
        color: '#6B7280',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.4)',
        justifyContent: 'center',
        padding: 16,
    },
    modalCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    closeButton: {
        padding: 4,
        borderRadius: 9999,
    },
    tabRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: '#DBEAFE',
        borderBottomWidth: 2,
        borderBottomColor: '#2563EB',
    },
    tabInnerRow: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 13,
        color: '#6B7280',
    },
    tabTextActive: {
        color: '#2563EB',
        fontWeight: '600',
    },
    modalBody: {
        maxHeight: 360,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 4,
        color: '#374151',
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
        fontSize: 13,
    },
    priorityRow: {
        flexDirection: 'row',
        gap: 8,
    },
    priorityButton: {
        flex: 1,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingVertical: 8,
        alignItems: 'center',
    },
    priorityButtonActiveLow: {
        borderColor: '#22C55E',
        backgroundColor: '#ECFDF3',
    },
    priorityButtonActiveMedium: {
        borderColor: '#F97316',
        backgroundColor: '#FFEDD5',
    },
    priorityButtonActiveHigh: {
        borderColor: '#EF4444',
        backgroundColor: '#FEE2E2',
    },
    priorityButtonText: {
        color: '#374151',
        fontWeight: '500',
    },
    priorityButtonTextActive: {
        color: '#111827',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    secondaryBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: '#E5E7EB',
    },
    secondaryBtnText: {
        fontWeight: '500',
        color: '#374151',
    },
    primaryBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: '#2563EB',
    },
    primaryBtnDisabled: {
        backgroundColor: '#93C5FD',
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    existingList: {
        maxHeight: 160,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        padding: 6,
        gap: 6,
    },
    existingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 8,
    },
    existingItemActive: {
        borderColor: '#2563EB',
        backgroundColor: '#DBEAFE',
    },
    existingItemText: {
        fontSize: 13,
        color: '#111827',
    },
    priorityPill: {
        borderWidth: 1,
        borderRadius: 9999,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    priorityPillText: {
        fontSize: 10,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    emptyUnscheduled: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 24,
        gap: 6,
    },
    emptyUnscheduledTitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
    },
    emptyUnscheduledSubtitle: {
        fontSize: 11,
        color: '#6B7280',
    },
});
