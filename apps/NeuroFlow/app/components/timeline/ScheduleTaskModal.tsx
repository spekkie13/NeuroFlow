import React, { useEffect, useState } from 'react'
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { List, Plus, X } from 'lucide-react-native'
import { ScheduleTaskModalProps } from "../../props/ui/ScheduleTaskModalProps"
import {Priority} from "../../models";
import {formatLocalDate, getDateInputPlaceholder, parseLocalDate, toIsoDateString} from "../../utils/dateUtils";
import {createTask} from "../../services/domain/TaskService";
import { styles } from '../../styles/timeline'
import {AppButton} from "../ui/AppButton";
import {TextField} from "../ui/TextField";
import {DateField} from "../ui/DateField";
import {getPriorityStyle} from "../../utils/priorityUtils";

type ModalTab = 'new' | 'existing'

export const ScheduleTaskModal: React.FC<ScheduleTaskModalProps> = ({
    visible,
    selectedDate,
    selectableExistingTasks,
    onAddNewTask,
    onUpdateTask,
    onClose,
}) => {
    const [modalTab, setModalTab] = useState<ModalTab>('new')
    const [newTaskName, setNewTaskName] = useState('')
    const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium')
    const [taskDate, setTaskDate] = useState('')
    const [selectedExistingTaskId, setSelectedExistingTaskId] = useState<string | null>(null)

    useEffect(() => {
        if (!visible) return
        const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }
        const formatted = selectedDate ? formatLocalDate(selectedDate, opts) : ''
        setTaskDate(formatted)
        setNewTaskName('')
        setNewTaskPriority('medium')
        setSelectedExistingTaskId(null)
        setModalTab(selectableExistingTasks.length > 0 ? 'existing' : 'new')
    }, [visible])

    const handleAddNewTask = (): void => {
        if (!newTaskName.trim() || !taskDate) return
        const start : Date = parseLocalDate(taskDate)
        if (!start) return
        onAddNewTask(createTask({
            name: newTaskName.trim(),
            priority: newTaskPriority,
            date: toIsoDateString(start)!,
        }))
        onClose()
    }

    const handleAddExistingTask = (): void => {
        if (!selectedExistingTaskId || !taskDate) return
        const start : Date = parseLocalDate(taskDate)
        if (!start) return
        onUpdateTask(selectedExistingTaskId, {
            date: toIsoDateString(start)!,
        })
        onClose()
    }

    const placeholder : string = getDateInputPlaceholder()

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                    <View style={styles.modalHeaderRow}>
                        <View>
                            <Text style={styles.modalTitle}>Schedule Task</Text>
                            {selectedDate && (
                                <Text style={styles.modalSubtitle}>
                                    {formatLocalDate(selectedDate)}
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
                            <X size={18} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Tabs */}
                    <View style={styles.modalTabsRow}>
                        <TouchableOpacity
                            style={[
                                styles.modalTab,
                                modalTab === 'existing' && styles.modalTabActive,
                            ]}
                            onPress={() => setModalTab('existing')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.modalTabInner}>
                                <List size={16} color="#2563eb" />
                                <Text
                                    style={[
                                        styles.modalTabText,
                                        modalTab === 'existing' && styles.modalTabTextActive,
                                    ]}
                                >
                                    Add Existing ({selectableExistingTasks.length})
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.modalTab,
                                modalTab === 'new' && styles.modalTabActive,
                            ]}
                            onPress={() => setModalTab('new')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.modalTabInner}>
                                <Plus size={16} color="#2563eb" />
                                <Text
                                    style={[
                                        styles.modalTabText,
                                        modalTab === 'new' && styles.modalTabTextActive,
                                    ]}
                                >
                                    Create New
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalBody}>
                        {modalTab === 'new' ? (
                            <>
                                <View style={styles.fieldGroup}>
                                    <Text style={styles.fieldLabel}>Task Name</Text>
                                    <TextField
                                        value={newTaskName}
                                        onChangeText={setNewTaskName}
                                        placeholder="Enter task name..."
                                        returnKeyType="done"
                                        onSubmitEditing={handleAddNewTask}
                                    />
                                </View>

                                <View style={styles.fieldGroup}>
                                    <Text style={styles.fieldLabel}>Priority</Text>
                                    <View style={styles.priorityRow}>
                                        {(['low', 'medium', 'high'] as Priority[]).map((prio) => {
                                            const active = newTaskPriority === prio
                                            return (
                                                <TouchableOpacity
                                                    key={prio}
                                                    style={[
                                                        styles.priorityOption,
                                                        active && styles.priorityOptionActive,
                                                    ]}
                                                    onPress={() => setNewTaskPriority(prio)}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.priorityOptionText,
                                                            active && styles.priorityOptionTextActive,
                                                        ]}
                                                    >
                                                        {prio}
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View>

                                <View style={styles.fieldGroup}>
                                    <Text style={styles.fieldLabel}>Date ({placeholder})</Text>
                                    <DateField
                                        value={taskDate}
                                        onChangeText={setTaskDate}
                                        placeholder={placeholder}
                                    />
                                </View>
                            </>
                        ) : (
                            <>
                                {selectableExistingTasks.length === 0 ? (
                                    <View style={styles.emptyExistingBox}>
                                        <List size={40} color="#9ca3af" />
                                        <Text style={styles.emptyExistingTitle}>
                                            No tasks need scheduling
                                        </Text>
                                        <Text style={styles.emptyExistingSubtitle}>
                                            All tasks are scheduled and up to date
                                        </Text>
                                    </View>
                                ) : (
                                    <>
                                        <View style={styles.fieldGroup}>
                                            <Text style={styles.fieldLabel}>Select Task</Text>
                                            <View style={styles.existingList}>
                                                {selectableExistingTasks.map((task) => {
                                                    const active = selectedExistingTaskId === task.id
                                                    return (
                                                        <TouchableOpacity
                                                            key={task.id}
                                                            style={[
                                                                styles.existingItem,
                                                                active && styles.existingItemActive,
                                                            ]}
                                                            onPress={() =>
                                                                setSelectedExistingTaskId(task.id)
                                                            }
                                                            activeOpacity={0.8}
                                                        >
                                                            <Text
                                                                style={styles.existingItemName}
                                                                numberOfLines={1}
                                                            >
                                                                {task.name}
                                                            </Text>
                                                            <View
                                                                style={[
                                                                    styles.priorityBadgeSmall,
                                                                    getPriorityStyle(task.priority, styles.priorityBadgeHigh, styles.priorityBadgeMedium, styles.priorityBadgeLow),
                                                                ]}
                                                            >
                                                                <Text style={styles.priorityBadgeText}>
                                                                    {task.priority}
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )
                                                })}
                                            </View>
                                        </View>

                                        <View style={styles.fieldGroup}>
                                            <Text style={styles.fieldLabel}>Date ({placeholder})</Text>
                                            <DateField
                                                value={taskDate}
                                                onChangeText={setTaskDate}
                                                placeholder={placeholder}
                                            />
                                        </View>
                                    </>
                                )}
                            </>
                        )}
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <AppButton title="Cancel" variant="outline" onPress={onClose} fullWidth />
                        {modalTab === 'new' ? (
                            <AppButton
                                title="Create & Schedule"
                                variant="primary"
                                onPress={handleAddNewTask}
                                fullWidth
                                disabled={!newTaskName.trim() || !taskDate}
                            />
                        ) : (
                            <AppButton
                                title="Schedule Task"
                                variant="primary"
                                onPress={handleAddExistingTask}
                                fullWidth
                                disabled={!selectedExistingTaskId || !taskDate}
                            />
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    )
}
