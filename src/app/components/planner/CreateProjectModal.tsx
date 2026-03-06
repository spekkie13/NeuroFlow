import React from 'react'
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native'
import { AppButton } from '@/app/components/ui/AppButton'
import { TextField } from '@/app/components/ui/TextField'
import { CreateProjectModalProps } from '@/app/props/planner/CreateProjectModalProps'
import { PROJECT_COLOR_PALETTE } from '@/app/services/domain/ProjectColorService'
import { styles } from '@/app/styles/planner'

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
}) => {
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