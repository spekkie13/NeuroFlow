import React from "react";
import { Priority } from "../../../app/utils/types";
import { Pressable, Text, TextInput, View} from "react-native";
import { ArrowDown, ArrowRight, ArrowUp, CheckCircleIcon, CheckIcon, CircleIcon, ClockIcon, EditIcon, TrashIcon, XIcon} from "lucide-react-native";
import { PriorityMenu } from "../../../app/components/Task/PriorityMenu";
import { TaskItemProps } from "@/props/TaskItemProps";
import {styles} from "@/styles/taskItem";

function getPriorityIcon(priority: Priority) {
    switch (priority) {
        case 'high':
            return <ArrowUp size={16} color="#EF4444" />;
        case 'medium':
            return <ArrowRight size={16} color="#F59E0B" />;
        case 'low':
            return <ArrowDown size={16} color="#10B981" />;
        default:
            return null;
    }
}

function getPriorityStyle(priority: Priority) {
    switch (priority) {
        case 'high':
            return {
                backgroundColor: '#FEF2F2',
                borderColor: '#FCA5A5',
                color: '#B91C1C',
            };
        case 'medium':
            return {
                backgroundColor: '#FFFBEB',
                borderColor: '#FCD34D',
                color: '#92400E',
            };
        case 'low':
            return {
                backgroundColor: '#ECFDF3',
                borderColor: '#BBF7D0',
                color: '#166534',
            };
    }
}

export function TaskItem({
                      task,
                      isEditing,
                      isMenuOpen,
                      editValue,
                      onStartEdit,
                      onChangeEdit,
                      onSaveEdit,
                      onDelete,
                      onToggleComplete,
                      onTogglePriorityMenu,
                      onSetPriority,
                  }: TaskItemProps) {
    const priorityStyle = getPriorityStyle(task.priority);

    return (
        <View
            style={[
                styles.taskCard,
                task.completed && styles.taskCardCompleted,
                isMenuOpen && { zIndex: 999, elevation: 999 },
            ]}
        >
            <View style={styles.taskRow}>
                <Pressable onPress={onToggleComplete} style={styles.checkButton}>
                    {task.completed ? (
                        <CheckCircleIcon size={22} color="#22C55E" />
                    ) : (
                        <CircleIcon size={22} color="#9CA3AF" />
                    )}
                </Pressable>

                <View style={styles.taskContent}>
                    {isEditing ? (
                        <View style={styles.editRow}>
                            <TextInput
                                value={editValue}
                                onChangeText={onChangeEdit}
                                style={styles.editInput}
                                autoFocus
                                onSubmitEditing={onSaveEdit}
                            />
                            <Pressable onPress={onSaveEdit} style={styles.iconButtonSuccess}>
                                <CheckIcon size={18} color="#16A34A" />
                            </Pressable>
                            <Pressable onPress={onStartEdit} style={styles.iconButton}>
                                <XIcon size={18} color="#6B7280" />
                            </Pressable>
                        </View>
                    ) : (
                        <>
                            <View style={styles.nameRow}>
                                <Text
                                    style={[
                                        styles.taskName,
                                        task.completed && styles.taskNameCompleted,
                                    ]}
                                    numberOfLines={2}
                                >
                                    {task.name}
                                </Text>

                                <Pressable
                                    onPress={onTogglePriorityMenu}
                                    style={[
                                        styles.priorityBadge,
                                        {
                                            backgroundColor: priorityStyle.backgroundColor,
                                            borderColor: priorityStyle.borderColor,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.priorityText,
                                            { color: priorityStyle.color },
                                        ]}
                                    >
                                        {task.priority}
                                    </Text>
                                </Pressable>
                            </View>
                            {task.startDate && task.endDate && (
                                <View style={styles.dateRow}>
                                    <ClockIcon size={14} color="#6B7280" />
                                    <Text style={styles.dateText}>
                                        {new Date(task.startDate).toLocaleDateString()} -{' '}
                                        {new Date(task.endDate).toLocaleDateString()}
                                    </Text>
                                </View>
                            )}
                        </>
                    )}
                </View>

                {!isEditing && (
                    <View style={styles.actions}>
                        <View style={styles.priorityWrapper}>
                            <Pressable onPress={onTogglePriorityMenu} style={styles.iconButton}>
                                {getPriorityIcon(task.priority)}
                            </Pressable>
                            {isMenuOpen && (
                                <PriorityMenu
                                    onSelect={(p) => {
                                        onSetPriority(p);
                                    }}
                                />
                            )}
                        </View>
                        <Pressable onPress={onStartEdit} style={styles.iconButton}>
                            <EditIcon size={18} color="#6B7280" />
                        </Pressable>
                        <Pressable onPress={onDelete} style={styles.iconButton}>
                            <TrashIcon size={18} color="#DC2626" />
                        </Pressable>
                    </View>
                )}
            </View>
        </View>
    );
}
