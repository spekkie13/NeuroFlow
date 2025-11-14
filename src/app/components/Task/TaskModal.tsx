import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Plus, X, List } from 'lucide-react-native';
import { Priority } from '@/app/utils/types';
import { getPriorityStyle } from '@/helpers/TimelineHelpers';
import { styles } from '@/styles/taskModal';
import { TaskModalProps } from "@/props/TaskModalProps";

export const TaskModal: React.FC<TaskModalProps> = ({
                                                        visible,
                                                        onClose,
                                                        unscheduledTasks,
                                                        initialTab,
                                                        defaultStartDate,
                                                        defaultEndDate,
                                                        onCreateNew,
                                                        onScheduleExisting,
                                                    }: TaskModalProps) => {
    const [modalTab, setModalTab] = useState<'new' | 'existing'>(initialTab);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
    const [taskStartDate, setTaskStartDate] = useState(defaultStartDate);
    const [taskEndDate, setTaskEndDate] = useState(defaultEndDate);
    const [selectedExistingTaskId, setSelectedExistingTaskId] = useState<string | null>(null);

    useEffect(() => {
        if (!visible) return;
        setModalTab(initialTab);
        setNewTaskName('');
        setNewTaskPriority('medium');
        setTaskStartDate(defaultStartDate);
        setTaskEndDate(defaultEndDate);
        setSelectedExistingTaskId(null);
    }, [visible, initialTab, defaultStartDate, defaultEndDate]);

    const handleAddNewTask = () => {
        if (!newTaskName.trim() || !taskStartDate || !taskEndDate) return;
        onCreateNew({
            name: newTaskName.trim(),
            priority: newTaskPriority,
            startDate: taskStartDate,
            endDate: taskEndDate,
        });
    };

    const handleAddExistingTask = () => {
        if (!selectedExistingTaskId || !taskStartDate || !taskEndDate) return;
        onScheduleExisting({
            taskId: selectedExistingTaskId,
            startDate: taskStartDate,
            endDate: taskEndDate,
        });
    };

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                    {/* header */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Schedule Task</Text>
                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <X size={20} color="#6B7280" />
                        </Pressable>
                    </View>

                    {/* tabs */}
                    <View style={styles.tabRow}>
                        <Pressable onPress={() => setModalTab('existing')} style={[styles.tab, modalTab === 'existing' && styles.tabActive]}>
                            <View style={styles.tabInnerRow}>
                                <List size={16} color={modalTab === 'existing' ? '#2563EB' : '#6B7280'} />
                                <Text style={[styles.tabText, modalTab === 'existing' && styles.tabTextActive]}>
                                    Add Existing ({unscheduledTasks.length})
                                </Text>
                            </View>
                        </Pressable>
                        <Pressable onPress={() => setModalTab('new')} style={[styles.tab, modalTab === 'new' && styles.tabActive]}>
                            <View style={styles.tabInnerRow}>
                                <Plus size={16} color={modalTab === 'new' ? '#2563EB' : '#6B7280'} />
                                <Text style={[styles.tabText, modalTab === 'new' && styles.tabTextActive]}>Create New</Text>
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
                                            style={[styles.priorityButton, newTaskPriority === 'low' && styles.priorityButtonActiveLow]}
                                        >
                                            <Text style={[styles.priorityButtonText, newTaskPriority === 'low' && styles.priorityButtonTextActive]}>
                                                Low
                                            </Text>
                                        </Pressable>
                                        <Pressable
                                            onPress={() => setNewTaskPriority('medium')}
                                            style={[styles.priorityButton, newTaskPriority === 'medium' && styles.priorityButtonActiveMedium]}
                                        >
                                            <Text style={[styles.priorityButtonText, newTaskPriority === 'medium' && styles.priorityButtonTextActive]}>
                                                Medium
                                            </Text>
                                        </Pressable>
                                        <Pressable
                                            onPress={() => setNewTaskPriority('high')}
                                            style={[styles.priorityButton, newTaskPriority === 'high' && styles.priorityButtonActiveHigh]}
                                        >
                                            <Text style={[styles.priorityButtonText, newTaskPriority === 'high' && styles.priorityButtonTextActive]}>
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
                                        <List size={48} color="#9CA3AF" />
                                        <Text style={styles.emptyUnscheduledTitle}>No unscheduled tasks</Text>
                                        <Text style={styles.emptyUnscheduledSubtitle}>All tasks have been scheduled</Text>
                                    </View>
                                ) : (
                                    <>
                                        <View>
                                            <Text style={styles.label}>Select Task</Text>
                                            <View style={styles.existingList}>
                                                {unscheduledTasks.map(task => {
                                                    const pStyle = getPriorityStyle(task.priority);
                                                    return (
                                                        <Pressable
                                                            key={task.id}
                                                            onPress={() => setSelectedExistingTaskId(task.id)}
                                                            style={[
                                                                styles.existingItem,
                                                                selectedExistingTaskId === task.id && styles.existingItemActive,
                                                            ]}
                                                        >
                                                            <View style={{ flex: 1 }}>
                                                                <Text style={styles.existingItemText} numberOfLines={1}>
                                                                    {task.name}
                                                                </Text>
                                                            </View>
                                                            <View
                                                                style={[
                                                                    styles.priorityPill,
                                                                    { backgroundColor: pStyle.backgroundColor, borderColor: pStyle.borderColor },
                                                                ]}
                                                            >
                                                                <Text style={[styles.priorityPillText, { color: pStyle.color }]}>{task.priority}</Text>
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
                        <Pressable onPress={onClose} style={styles.secondaryBtn}>
                            <Text style={styles.secondaryBtnText}>Cancel</Text>
                        </Pressable>
                        {modalTab === 'new' ? (
                            <Pressable
                                onPress={handleAddNewTask}
                                disabled={!newTaskName.trim() || !taskStartDate || !taskEndDate}
                                style={[styles.primaryBtn, (!newTaskName.trim() || !taskStartDate || !taskEndDate) && styles.primaryBtnDisabled]}
                            >
                                <Text style={styles.primaryBtnText}>Create & Schedule</Text>
                            </Pressable>
                        ) : (
                            <Pressable
                                onPress={handleAddExistingTask}
                                disabled={!selectedExistingTaskId || !taskStartDate || !taskEndDate}
                                style={[styles.primaryBtn, (!selectedExistingTaskId || !taskStartDate || !taskEndDate) && styles.primaryBtnDisabled]}
                            >
                                <Text style={styles.primaryBtnText}>Schedule Task</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};
