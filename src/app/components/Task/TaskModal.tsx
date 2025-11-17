import React from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Plus, X, List } from 'lucide-react-native';
import { Priority, Task } from '@/app/utils/types';
import { getPriorityStyle } from '@/helpers/TimelineHelpers';
import { styles } from '@/styles/taskModal';

type TaskModalProps = {
    visible: boolean;
    mode: 'new' | 'existing';
    onChangeMode: (mode: 'new' | 'existing') => void;

    unscheduledTasks: Task[];

    taskName: string;
    onChangeTaskName: (value: string) => void;

    priority: Priority;
    onChangePriority: (p: Priority) => void;

    startDate: string;
    endDate: string;
    onChangeStartDate: (value: string) => void;
    onChangeEndDate: (value: string) => void;

    selectedTaskId: string | null;
    onChangeSelectedTaskId: (id: string | null) => void;

    onClose: () => void;
    onConfirmNew: () => void;
    onConfirmExisting: () => void;
};

export const TaskModal: React.FC<TaskModalProps> = ({
                                                        visible,
                                                        mode,
                                                        onChangeMode,
                                                        unscheduledTasks,
                                                        taskName,
                                                        onChangeTaskName,
                                                        priority,
                                                        onChangePriority,
                                                        startDate,
                                                        endDate,
                                                        onChangeStartDate,
                                                        onChangeEndDate,
                                                        selectedTaskId,
                                                        onChangeSelectedTaskId,
                                                        onClose,
                                                        onConfirmNew,
                                                        onConfirmExisting,
                                                    }) => {
    const disableNew = !taskName.trim() || !startDate || !endDate;
    const disableExisting = !selectedTaskId || !startDate || !endDate;

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
            onRequestClose={onClose}
        >
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
                        <Pressable
                            onPress={() => onChangeMode('existing')}
                            style={[styles.tab, mode === 'existing' && styles.tabActive]}
                        >
                            <View style={styles.tabInnerRow}>
                                <List
                                    size={16}
                                    color={mode === 'existing' ? '#2563EB' : '#6B7280'}
                                />
                                <Text
                                    style={[
                                        styles.tabText,
                                        mode === 'existing' && styles.tabTextActive,
                                    ]}
                                >
                                    Add Existing ({unscheduledTasks.length})
                                </Text>
                            </View>
                        </Pressable>
                        <Pressable
                            onPress={() => onChangeMode('new')}
                            style={[styles.tab, mode === 'new' && styles.tabActive]}
                        >
                            <View style={styles.tabInnerRow}>
                                <Plus
                                    size={16}
                                    color={mode === 'new' ? '#2563EB' : '#6B7280'}
                                />
                                <Text
                                    style={[
                                        styles.tabText,
                                        mode === 'new' && styles.tabTextActive,
                                    ]}
                                >
                                    Create New
                                </Text>
                            </View>
                        </Pressable>
                    </View>

                    {/* body */}
                    <ScrollView style={styles.modalBody}>
                        {mode === 'new' ? (
                            <View style={{ gap: 12 }}>
                                <View>
                                    <Text style={styles.label}>Task Name</Text>
                                    <TextInput
                                        value={taskName}
                                        onChangeText={onChangeTaskName}
                                        placeholder="Enter task name..."
                                        style={styles.input}
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>

                                <View>
                                    <Text style={styles.label}>Priority</Text>
                                    <View style={styles.priorityRow}>
                                        <Pressable
                                            onPress={() => onChangePriority('low')}
                                            style={[
                                                styles.priorityButton,
                                                priority === 'low' &&
                                                styles.priorityButtonActiveLow,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.priorityButtonText,
                                                    priority === 'low' &&
                                                    styles.priorityButtonTextActive,
                                                ]}
                                            >
                                                Low
                                            </Text>
                                        </Pressable>
                                        <Pressable
                                            onPress={() => onChangePriority('medium')}
                                            style={[
                                                styles.priorityButton,
                                                priority === 'medium' &&
                                                styles.priorityButtonActiveMedium,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.priorityButtonText,
                                                    priority === 'medium' &&
                                                    styles.priorityButtonTextActive,
                                                ]}
                                            >
                                                Medium
                                            </Text>
                                        </Pressable>
                                        <Pressable
                                            onPress={() => onChangePriority('high')}
                                            style={[
                                                styles.priorityButton,
                                                priority === 'high' &&
                                                styles.priorityButtonActiveHigh,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.priorityButtonText,
                                                    priority === 'high' &&
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
                                            value={startDate}
                                            onChangeText={onChangeStartDate}
                                            placeholder="YYYY-MM-DD"
                                            style={styles.input}
                                            placeholderTextColor="#9CA3AF"
                                        />
                                    </View>
                                    <View style={{ width: 12 }} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.label}>End Date</Text>
                                        <TextInput
                                            value={endDate}
                                            onChangeText={onChangeEndDate}
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
                                                                onChangeSelectedTaskId(task.id)
                                                            }
                                                            style={[
                                                                styles.existingItem,
                                                                selectedTaskId === task.id &&
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
                                                                        backgroundColor:
                                                                        pStyle.backgroundColor,
                                                                        borderColor:
                                                                        pStyle.borderColor,
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
                                                    value={startDate}
                                                    onChangeText={onChangeStartDate}
                                                    placeholder="YYYY-MM-DD"
                                                    style={styles.input}
                                                    placeholderTextColor="#9CA3AF"
                                                />
                                            </View>
                                            <View style={{ width: 12 }} />
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.label}>End Date</Text>
                                                <TextInput
                                                    value={endDate}
                                                    onChangeText={onChangeEndDate}
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
                        {mode === 'new' ? (
                            <Pressable
                                onPress={onConfirmNew}
                                disabled={disableNew}
                                style={[
                                    styles.primaryBtn,
                                    disableNew && styles.primaryBtnDisabled,
                                ]}
                            >
                                <Text style={styles.primaryBtnText}>
                                    Create &amp; Schedule
                                </Text>
                            </Pressable>
                        ) : (
                            <Pressable
                                onPress={onConfirmExisting}
                                disabled={disableExisting}
                                style={[
                                    styles.primaryBtn,
                                    disableExisting && styles.primaryBtnDisabled,
                                ]}
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
