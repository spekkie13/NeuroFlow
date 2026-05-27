import React, { useState } from 'react'
import { Modal, Platform, Text, TouchableOpacity, View } from 'react-native'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { AppButton } from '../ui/AppButton'
import { TextField } from '../ui/TextField'
import { CreateProjectModalProps } from '../../props/planner/CreateProjectModalProps'
import { PROJECT_COLOR_PALETTE } from '../../services/domain/ProjectColorService'
import { createProjectModalStyles } from '../../styles/planner/createProjectModal.styles'
import {dateToHHMM, formatTime, timeToDate} from "../../utils/dateUtils";

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
    visible,
    projectName,
    onChangeProjectName,
    onCreate,
    onCancel,
    selectedColor,
    onSelectColor,
    editMode = false,
    onDelete,
    reminderTime,
    globalReminderTime,
    onSetReminderTime,
}: CreateProjectModalProps) => {
    const [showTimePicker, setShowTimePicker] = useState(false)
    const [confirmingDelete, setConfirmingDelete] = useState(false)

    const pickerSeedTime: string = typeof reminderTime === 'string'
        ? reminderTime
        : typeof globalReminderTime === 'string'
            ? globalReminderTime
            : '09:00'
    const pickerDate: Date = timeToDate(pickerSeedTime)

    const isDefault: boolean = reminderTime === undefined
    const isOff: boolean = reminderTime === null
    const customTime: string = typeof reminderTime === 'string' ? reminderTime : null

    const handleDelete = () => {
        setConfirmingDelete(true)
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
            onDismiss={() => setConfirmingDelete(false)}
        >
            <View style={createProjectModalStyles.modalOverlay}>
                <View style={createProjectModalStyles.modalCard}>
                    <Text style={createProjectModalStyles.modalTitle}>
                        {editMode ? 'Edit Project' : 'New Project'}
                    </Text>
                    {!editMode && (
                        <Text style={createProjectModalStyles.modalSubtitle}>
                            Group related tasks into a project to keep your planning focused.
                        </Text>
                    )}

                    <TextField
                        label="Project name"
                        placeholder="e.g. Morning routine, Study, Work sprint"
                        value={projectName}
                        onChangeText={onChangeProjectName}
                        autoCapitalize="sentences"
                        returnKeyType="done"
                        onSubmitEditing={onCreate}
                    />

                    <Text style={createProjectModalStyles.colorPickerLabel}>Color</Text>
                    <View style={createProjectModalStyles.colorDotsRow}>
                        {PROJECT_COLOR_PALETTE.map((color) => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    createProjectModalStyles.colorDot,
                                    { backgroundColor: color },
                                    selectedColor === color && createProjectModalStyles.colorDotSelected,
                                ]}
                                onPress={() => onSelectColor(color)}
                                activeOpacity={0.8}
                            />
                        ))}
                    </View>

                    {onSetReminderTime && (
                        <>
                            <Text style={createProjectModalStyles.reminderLabel}>Reminder</Text>
                            <View style={createProjectModalStyles.modalReminderRow}>
                                <TouchableOpacity
                                    style={[createProjectModalStyles.reminderChip, isDefault && createProjectModalStyles.reminderChipActive]}
                                    onPress={() => { onSetReminderTime(undefined); setShowTimePicker(false) }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[createProjectModalStyles.reminderChipText, isDefault && createProjectModalStyles.reminderChipTextActive]}>
                                        {globalReminderTime
                                            ? `Default (${formatTime(globalReminderTime)})`
                                            : 'Default (none)'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[createProjectModalStyles.reminderChip, isOff && createProjectModalStyles.reminderChipDanger]}
                                    onPress={() => { onSetReminderTime(null); setShowTimePicker(false) }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[createProjectModalStyles.reminderChipText, isOff && createProjectModalStyles.reminderChipTextDanger]}>
                                        Off
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[createProjectModalStyles.reminderChip, !!customTime && createProjectModalStyles.reminderChipActive]}
                                    onPress={() => setShowTimePicker(true)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[createProjectModalStyles.reminderChipText, !!customTime && createProjectModalStyles.reminderChipTextActive]}>
                                        {customTime ? formatTime(customTime) : 'Custom time…'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {showTimePicker && (
                                <DateTimePicker
                                    mode="time"
                                    value={pickerDate}
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event: DateTimePickerEvent, date?: Date) => {
                                        if (Platform.OS !== 'ios') setShowTimePicker(false)
                                        if (event.type === 'dismissed') { setShowTimePicker(false); return }
                                        if (date) onSetReminderTime(dateToHHMM(date))
                                    }}
                                />
                            )}
                            {Platform.OS === 'ios' && showTimePicker && (
                                <TouchableOpacity
                                    style={createProjectModalStyles.reminderDoneButton}
                                    onPress={() => setShowTimePicker(false)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={createProjectModalStyles.reminderDoneText}>Done</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}

                    <View style={createProjectModalStyles.modalButtonsRow}>
                        <AppButton title="Cancel" variant="outline" onPress={onCancel} fullWidth />
                        <AppButton
                            title={editMode ? 'Save' : 'Create'}
                            variant="primary"
                            onPress={onCreate}
                            fullWidth
                            disabled={!projectName.trim()}
                        />
                    </View>

                    {editMode && onDelete && (
                        confirmingDelete ? (
                            <View style={createProjectModalStyles.deleteConfirmRow}>
                                <Text style={createProjectModalStyles.deleteConfirmText}>
                                    Delete "{projectName}"? This removes all tasks inside it.
                                </Text>
                                <View style={createProjectModalStyles.deleteConfirmButtons}>
                                    <AppButton
                                        title="Cancel"
                                        variant="outline"
                                        size="sm"
                                        onPress={() => setConfirmingDelete(false)}
                                        fullWidth
                                    />
                                    <AppButton
                                        title="Delete"
                                        variant="danger"
                                        size="sm"
                                        onPress={onDelete}
                                        fullWidth
                                    />
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={createProjectModalStyles.deleteProjectButton}
                                onPress={handleDelete}
                                activeOpacity={0.7}
                            >
                                <Text style={createProjectModalStyles.deleteProjectButtonText}>Delete project</Text>
                            </TouchableOpacity>
                        )
                    )}
                </View>
            </View>
        </Modal>
    )
}
