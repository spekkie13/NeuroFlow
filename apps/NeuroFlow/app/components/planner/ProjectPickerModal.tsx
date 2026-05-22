import React from 'react'
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { styles } from '../../styles/planner'
import {ProjectPickerModalProps} from "../../props/planner/ProjectPickerModalProps";
import {AppButton} from "../ui/AppButton";
import {Project} from "../../models";

export const ProjectPickerModal: React.FC<ProjectPickerModalProps> = ({
    visible,
    projects,
    activeProjectId,
    onSelectProject,
    onClose,
}: ProjectPickerModalProps) => (
    <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
    >
        <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
            <View style={styles.pickerCard}>
                <Text style={styles.pickerTitle}>Select project</Text>
                {projects.map((project: Project) => {
                    const isActive: boolean = project.id === activeProjectId
                    return (
                        <TouchableOpacity
                            key={project.id}
                            style={[styles.pickerItem, isActive && styles.pickerItemActive]}
                            onPress={() => onSelectProject(project.id)}
                        >
                            <View
                                style={[styles.projectDot, { backgroundColor: project.color }]}
                            />
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={[
                                        styles.pickerItemText,
                                        isActive && styles.pickerItemTextActive,
                                    ]}
                                    numberOfLines={1}
                                >
                                    {project.name}
                                </Text>
                                <Text style={styles.pickerItemMeta}>
                                    {project.tasks.length} task{project.tasks.length !== 1 ? 's' : ''} · {project.tasks.filter(t => t.completed).length} done
                                </Text>
                            </View>
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
            </TouchableWithoutFeedback>
        </View>
        </TouchableWithoutFeedback>
    </Modal>
)
