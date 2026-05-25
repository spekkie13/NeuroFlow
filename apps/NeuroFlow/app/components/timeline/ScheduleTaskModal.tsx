import React, { useEffect, useState } from 'react'
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { List, Plus, X } from 'lucide-react-native'
import { ScheduleTaskModalProps } from "../../props/ui/ScheduleTaskModalProps"
import {Priority} from "../../models";
import {formatLocalDate, getDateInputPlaceholder, parseLocalDate, toIsoDateString} from "../../utils/dateUtils";
import {createTask} from "../../services/domain/TaskService";
import { scheduleTaskModalStyles } from '../../styles/timeline/scheduleTaskModal.styles'
import {AppButton, DateField, TextField} from "../ui";
import {getPriorityStyle} from "../../utils/priorityUtils";

type ModalTab = 'new' | 'existing'

export const ScheduleTaskModal: React.FC<ScheduleTaskModalProps> = ({
    visible,
    selectedDate,
    selectableExistingTasks,
    onAddNewTask,
    onUpdateTask,
    onClose,
}: ScheduleTaskModalProps) => {
    const [modalTab, setModalTab] = useState<ModalTab>('new')
    const [newTaskName, setNewTaskName] = useState('')
    const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium')
    const [taskDate, setTaskDate] = useState<string>('')
    const [selectedExistingTaskId, setSelectedExistingTaskId] = useState<string | null>(null)

    useEffect(() => {
        if (!visible) return
        const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }
        const formatted: string = selectedDate ? formatLocalDate(selectedDate, opts) : ''
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
            <View style={scheduleTaskModalStyles.modalOverlay}>
                <View style={scheduleTaskModalStyles.modalCard}>
                    <View style={scheduleTaskModalStyles.modalHeaderRow}>
                        <View>
                            <Text style={scheduleTaskModalStyles.modalTitle}>Schedule Task</Text>
                            {selectedDate && (
                                <Text style={scheduleTaskModalStyles.modalSubtitle}>
                                    {formatLocalDate(selectedDate)}
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity onPress={onClose} style={scheduleTaskModalStyles.modalCloseButton}>
                            <X size={18} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Tabs */}
                    <View style={scheduleTaskModalStyles.modalTabsRow}>
                        <TouchableOpacity
                            style={[
                                scheduleTaskModalStyles.modalTab,
                                modalTab === 'existing' && scheduleTaskModalStyles.modalTabActive,
                            ]}
                            onPress={() => setModalTab('existing')}
                            activeOpacity={0.8}
                        >
                            <View style={scheduleTaskModalStyles.modalTabInner}>
                                <List size={16} color="#2563eb" />
                                <Text
                                    style={[
                                        scheduleTaskModalStyles.modalTabText,
                                        modalTab === 'existing' && scheduleTaskModalStyles.modalTabTextActive,
                                    ]}
                                >
                                    Add Existing ({selectableExistingTasks.length})
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                scheduleTaskModalStyles.modalTab,
                                modalTab === 'new' && scheduleTaskModalStyles.modalTabActive,
                            ]}
                            onPress={() => setModalTab('new')}
                            activeOpacity={0.8}
                        >
                            <View style={scheduleTaskModalStyles.modalTabInner}>
                                <Plus size={16} color="#2563eb" />
                                <Text
                                    style={[
                                        scheduleTaskModalStyles.modalTabText,
                                        modalTab === 'new' && scheduleTaskModalStyles.modalTabTextActive,
                                    ]}
                                >
                                    Create New
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={scheduleTaskModalStyles.modalBody}>
                        {modalTab === 'new' ? (
                            <>
                                <View style={scheduleTaskModalStyles.fieldGroup}>
                                    <Text style={scheduleTaskModalStyles.fieldLabel}>Task Name</Text>
                                    <TextField
                                        value={newTaskName}
                                        onChangeText={setNewTaskName}
                                        placeholder="Enter task name..."
                                        returnKeyType="done"
                                        onSubmitEditing={handleAddNewTask}
                                    />
                                </View>

                                <View style={scheduleTaskModalStyles.fieldGroup}>
                                    <Text style={scheduleTaskModalStyles.fieldLabel}>Priority</Text>
                                    <View style={scheduleTaskModalStyles.priorityRow}>
                                        {(['low', 'medium', 'high'] as Priority[]).map((prio) => {
                                            const active = newTaskPriority === prio
                                            return (
                                                <TouchableOpacity
                                                    key={prio}
                                                    style={[
                                                        scheduleTaskModalStyles.priorityOption,
                                                        active && scheduleTaskModalStyles.priorityOptionActive,
                                                    ]}
                                                    onPress={() => setNewTaskPriority(prio)}
                                                >
                                                    <Text
                                                        style={[
                                                            scheduleTaskModalStyles.priorityOptionText,
                                                            active && scheduleTaskModalStyles.priorityOptionTextActive,
                                                        ]}
                                                    >
                                                        {prio}
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View>

                                <View style={scheduleTaskModalStyles.fieldGroup}>
                                    <Text style={scheduleTaskModalStyles.fieldLabel}>Date ({placeholder})</Text>
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
                                    <View style={scheduleTaskModalStyles.emptyExistingBox}>
                                        <List size={40} color="#9ca3af" />
                                        <Text style={scheduleTaskModalStyles.emptyExistingTitle}>
                                            No tasks need scheduling
                                        </Text>
                                        <Text style={scheduleTaskModalStyles.emptyExistingSubtitle}>
                                            All tasks are scheduled and up to date
                                        </Text>
                                    </View>
                                ) : (
                                    <>
                                        <View style={scheduleTaskModalStyles.fieldGroup}>
                                            <Text style={scheduleTaskModalStyles.fieldLabel}>Select Task</Text>
                                            <View style={scheduleTaskModalStyles.existingList}>
                                                {selectableExistingTasks.map((task) => {
                                                    const active = selectedExistingTaskId === task.id
                                                    return (
                                                        <TouchableOpacity
                                                            key={task.id}
                                                            style={[
                                                                scheduleTaskModalStyles.existingItem,
                                                                active && scheduleTaskModalStyles.existingItemActive,
                                                            ]}
                                                            onPress={() =>
                                                                setSelectedExistingTaskId(task.id)
                                                            }
                                                            activeOpacity={0.8}
                                                        >
                                                            <Text
                                                                style={scheduleTaskModalStyles.existingItemName}
                                                                numberOfLines={1}
                                                            >
                                                                {task.name}
                                                            </Text>
                                                            <View
                                                                style={[
                                                                    scheduleTaskModalStyles.priorityBadgeSmall,
                                                                    getPriorityStyle(task.priority, scheduleTaskModalStyles.priorityBadgeHigh, scheduleTaskModalStyles.priorityBadgeMedium, scheduleTaskModalStyles.priorityBadgeLow),
                                                                ]}
                                                            >
                                                                <Text style={scheduleTaskModalStyles.priorityBadgeText}>
                                                                    {task.priority}
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )
                                                })}
                                            </View>
                                        </View>

                                        <View style={scheduleTaskModalStyles.fieldGroup}>
                                            <Text style={scheduleTaskModalStyles.fieldLabel}>Date ({placeholder})</Text>
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

                    <View style={scheduleTaskModalStyles.modalFooter}>
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
