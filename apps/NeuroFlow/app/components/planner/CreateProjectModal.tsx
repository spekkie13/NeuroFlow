import React, { useState } from 'react'
import { Alert, Modal, Platform, Text, TouchableOpacity, View } from 'react-native'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { AppButton } from '../ui/AppButton'
import { TextField } from '../ui/TextField'
import { CreateProjectModalProps } from '../../props/planner/CreateProjectModalProps'
import { PROJECT_COLOR_PALETTE } from '../../services/domain/ProjectColorService'
import { styles } from '../../styles/planner'
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
}) => {
    const [showTimePicker, setShowTimePicker] = useState(false)

    const pickerSeedTime = typeof reminderTime === 'string'
        ? reminderTime
        : typeof globalReminderTime === 'string'
            ? globalReminderTime
            : '09:00'
    const pickerDate = timeToDate(pickerSeedTime)

    const isDefault = reminderTime === undefined
    const isOff = reminderTime === null
    const customTime = typeof reminderTime === 'string' ? reminderTime : null

    const handleDelete = () => {
        Alert.alert(
            'Delete project',
            `Delete "${projectName}"? This will permanently remove all tasks inside it.`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: onDelete },
            ],
        )
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                    <Text style={styles.modalTitle}>
                        {editMode ? 'Edit Project' : 'New Project'}
                    </Text>
                    {!editMode && (
                        <Text style={styles.modalSubtitle}>
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

                    <Text style={styles.colorPickerLabel}>Color</Text>
                    <View style={styles.colorDotsRow}>
                        {PROJECT_COLOR_PALETTE.map((color) => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    styles.colorDot,
                                    { backgroundColor: color },
                                    selectedColor === color && styles.colorDotSelected,
                                ]}
                                onPress={() => onSelectColor(color)}
                                activeOpacity={0.8}
                            />
                        ))}
                    </View>

                    {onSetReminderTime && (
                        <>
                            <Text style={styles.reminderLabel}>Reminder</Text>
                            <View style={styles.modalReminderRow}>
                                <TouchableOpacity
                                    style={[styles.reminderChip, isDefault && styles.reminderChipActive]}
                                    onPress={() => { onSetReminderTime(undefined); setShowTimePicker(false) }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.reminderChipText, isDefault && styles.reminderChipTextActive]}>
                                        {globalReminderTime
                                            ? `Default (${formatTime(globalReminderTime)})`
                                            : 'Default (none)'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.reminderChip, isOff && styles.reminderChipDanger]}
                                    onPress={() => { onSetReminderTime(null); setShowTimePicker(false) }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.reminderChipText, isOff && styles.reminderChipTextDanger]}>
                                        Off
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.reminderChip, !!customTime && styles.reminderChipActive]}
                                    onPress={() => setShowTimePicker(true)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.reminderChipText, !!customTime && styles.reminderChipTextActive]}>
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
                                    style={styles.reminderDoneButton}
                                    onPress={() => setShowTimePicker(false)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.reminderDoneText}>Done</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}

                    <View style={styles.modalButtonsRow}>
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
                        <TouchableOpacity
                            style={styles.deleteProjectButton}
                            onPress={handleDelete}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.deleteProjectButtonText}>Delete project</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    )
}
