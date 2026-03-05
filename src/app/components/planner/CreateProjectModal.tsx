import React from 'react'
import { Modal, Text, View } from 'react-native'
import { AppButton } from '@/app/components/ui/AppButton'
import { TextField } from '@/app/components/ui/TextField'
import { styles } from '@/app/styles/planner'

interface CreateProjectModalProps {
    visible: boolean
    projectName: string
    onChangeProjectName: (name: string) => void
    onCreate: () => void
    onCancel: () => void
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
    visible,
    projectName,
    onChangeProjectName,
    onCreate,
    onCancel,
}) => (
    <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onCancel}
    >
        <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>New Project</Text>
                <Text style={styles.modalSubtitle}>
                    Group related tasks into a project to keep your planning focused.
                </Text>

                <TextField
                    label="Project name"
                    placeholder="e.g. Morning routine, Study, Work sprint"
                    value={projectName}
                    onChangeText={onChangeProjectName}
                    autoCapitalize="sentences"
                    returnKeyType="done"
                    onSubmitEditing={onCreate}
                />

                <View style={styles.modalButtonsRow}>
                    <AppButton
                        title="Cancel"
                        variant="outline"
                        onPress={onCancel}
                        fullWidth
                    />
                    <AppButton
                        title="Create"
                        variant="primary"
                        onPress={onCreate}
                        fullWidth
                        disabled={!projectName.trim()}
                    />
                </View>
            </View>
        </View>
    </Modal>
)