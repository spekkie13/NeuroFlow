import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { Project } from '../utils/types';
import { Pencil, Trash2, Check, X } from 'lucide-react-native';
import {ProjectListProps} from "@/props/ProjectListProps";
import {styles} from "@/styles/projectList";

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
                                        <Check size={16} color="#16A34A" />
                                    </Pressable>
                                    <Pressable onPress={cancelEdit} style={styles.iconButton}>
                                        <X size={16} color="#6B7280" />
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
                                    <Pencil size={16} color="#6B7280" />
                                </Pressable>
                                <Pressable
                                    onPress={() => confirmDelete(project.id)}
                                    style={styles.iconButton}
                                    accessibilityLabel="Delete project"
                                >
                                    <Trash2 size={16} color="#DC2626" />
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
