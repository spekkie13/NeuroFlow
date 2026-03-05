import React from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'
import { AppButton } from '@/app/components/ui/AppButton'
import { ProjectPickerModalProps } from '@/app/props/planner/ProjectPickerModalProps'
import { styles } from '@/app/styles/planner'

export const ProjectPickerModal: React.FC<ProjectPickerModalProps> = ({
    visible,
    projects,
    activeProjectId,
    onSelectProject,
    onClose,
}) => (
    <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
    >
        <View style={styles.modalOverlay}>
            <View style={styles.pickerCard}>
                <Text style={styles.pickerTitle}>Select project</Text>
                {projects.map((project) => {
                    const isActive = project.id === activeProjectId
                    return (
                        <TouchableOpacity
                            key={project.id}
                            style={[styles.pickerItem, isActive && styles.pickerItemActive]}
                            onPress={() => onSelectProject(project.id)}
                        >
                            <View
                                style={[styles.projectDot, { backgroundColor: project.color }]}
                            />
                            <Text
                                style={[
                                    styles.pickerItemText,
                                    isActive && styles.pickerItemTextActive,
                                ]}
                                numberOfLines={1}
                            >
                                {project.name}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
                <AppButton
                    title="Close"
                    variant="outline"
                    onPress={onClose}
                    fullWidth
                    style={{ marginTop: 8 }}
                />
            </View>
        </View>
    </Modal>
)