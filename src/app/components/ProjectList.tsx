import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from 'react-native';
import { Project } from '../utils/types';
import {
    Pencil as EditIcon,
    Trash2 as TrashIcon,
    Check as CheckIcon,
    X as XIcon,
} from 'lucide-react-native';

interface ProjectListProps {
    projects: Project[];
    selectedProjectId: string | null;
    onSelectProject: (projectId: string) => void;
    onUpdateProject: (project: Project) => void;
    onDeleteProject: (projectId: string) => void;
}

export default function ProjectList({
                                projects,
                                selectedProjectId,
                                onSelectProject,
                                onUpdateProject,
                                onDeleteProject,
                            }: ProjectListProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    const startEditing = (project: Project) => {
        setEditingId(project.id);
        setEditName(project.name);
    };

    const saveEdit = (project: Project) => {
        onUpdateProject({
            ...project,
            name: editName.trim() || 'Untitled Project',
        });
        setEditingId(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const confirmDelete = (projectId: string) => {
        Alert.alert('Delete project', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => onDeleteProject(projectId) },
        ]);
    };

    return (
        <ScrollView style={styles.wrapper}>
            {projects.map((project) => {
                const isSelected = selectedProjectId === project.id;
                const isEditing = editingId === project.id;

                return (
                    <View
                        key={project.id}
                        style={[styles.row, isSelected && styles.rowSelected]}
                    >
                        <View
                            style={[styles.colorDot, { backgroundColor: project.color }]}
                        />

                        <View style={styles.content}>
                            {isEditing ? (
                                <View style={styles.editRow}>
                                    <TextInput
                                        value={editName}
                                        onChangeText={setEditName}
                                        style={styles.input}
                                        autoFocus
                                        onSubmitEditing={() => saveEdit(project)}
                                    />
                                    <Pressable
                                        onPress={() => saveEdit(project)}
                                        style={styles.iconButtonSuccess}
                                    >
                                        <CheckIcon size={16} color="#16A34A" />
                                    </Pressable>
                                    <Pressable onPress={cancelEdit} style={styles.iconButton}>
                                        <XIcon size={16} color="#6B7280" />
                                    </Pressable>
                                </View>
                            ) : (
                                <Pressable
                                    onPress={() => onSelectProject(project.id)}
                                    style={{ flex: 1 }}
                                >
                                    <Text
                                        style={[styles.projectName, isSelected && styles.projectNameSelected]}
                                        numberOfLines={1}
                                    >
                                        {project.name}
                                    </Text>
                                </Pressable>
                            )}
                        </View>

                        {!isEditing && (
                            <View style={styles.actions}>
                                <Pressable
                                    onPress={() => startEditing(project)}
                                    style={styles.iconButton}
                                    accessibilityLabel="Edit project"
                                >
                                    <EditIcon size={16} color="#6B7280" />
                                </Pressable>
                                <Pressable
                                    onPress={() => confirmDelete(project.id)}
                                    style={styles.iconButton}
                                    accessibilityLabel="Delete project"
                                >
                                    <TrashIcon size={16} color="#DC2626" />
                                </Pressable>
                            </View>
                        )}
                    </View>
                );
            })}

            {projects.length === 0 && (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>No projects yet</Text>
                    <Text style={styles.emptySub}>Click + to create one</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flexGrow: 0,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderLeftWidth: 4,
        borderLeftColor: 'transparent',
    },
    rowSelected: {
        backgroundColor: '#EFF6FF',
        borderLeftColor: '#3B82F6',
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 9999,
        marginRight: 12,
    },
    content: {
        flex: 1,
        minWidth: 0,
    },
    projectName: {
        fontSize: 14,
        color: '#1F2937',
    },
    projectNameSelected: {
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        gap: 6,
        marginLeft: 8,
    },
    iconButton: {
        padding: 6,
        borderRadius: 9999,
    },
    iconButtonSuccess: {
        padding: 6,
        borderRadius: 9999,
        backgroundColor: '#ECFDF3',
    },
    editRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        fontSize: 14,
        backgroundColor: '#FFFFFF',
    },
    empty: {
        paddingVertical: 24,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    emptyText: {
        color: '#6B7280',
        fontSize: 13,
    },
    emptySub: {
        color: '#9CA3AF',
        fontSize: 11,
        marginTop: 4,
    },
});
