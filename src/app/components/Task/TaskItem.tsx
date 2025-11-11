import {Priority, Task} from "../../../app/utils/types";
import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import {
    ArrowDown as ArrowDownIcon,
    ArrowRight as ArrowRightIcon,
    ArrowUp as ArrowUpIcon, CheckCircleIcon, CheckIcon, CircleIcon, ClockIcon, EditIcon,
    TrashIcon, XIcon
} from "lucide-react-native";
import React from "react";
import {PriorityMenu} from "../../../app/components/Task/PriorityMenu";

function getPriorityIcon(priority: Priority) {
    switch (priority) {
        case 'high':
            return <ArrowUpIcon size={16} color="#EF4444" />;
        case 'medium':
            return <ArrowRightIcon size={16} color="#F59E0B" />;
        case 'low':
            return <ArrowDownIcon size={16} color="#10B981" />;
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
                  }: {
    task: Task;
    isEditing: boolean;
    isMenuOpen: boolean;
    editValue: string;
    onStartEdit: () => void;
    onChangeEdit: (text: string) => void;
    onSaveEdit: () => void;
    onDelete: () => void;
    onToggleComplete: () => void;
    onTogglePriorityMenu: () => void;
    onSetPriority: (priority: Priority) => void;
}) {
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

const styles = StyleSheet.create({
    taskCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
        position: 'relative',
        overflow: 'visible',
    },
    taskCardCompleted: {
        backgroundColor: '#F9FAFB',
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    checkButton: {
        marginTop: 2,
    },
    taskContent: {
        flex: 1,
        minWidth: 0,
    },
    nameRow: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
        marginBottom: 2,
        flexWrap: 'wrap',
    },
    taskName: {
        fontSize: 14,
        color: '#1F2937',
        flexShrink: 1,
    },
    taskNameCompleted: {
        color: '#6B7280',
        textDecorationLine: 'line-through',
    },
    priorityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 9999,
        borderWidth: 1,
    },
    priorityText: {
        fontSize: 11,
        textTransform: 'capitalize',
        fontWeight: '500',
    },
    dateRow: {
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
        marginTop: 4,
    },
    dateText: {
        fontSize: 11,
        color: '#6B7280',
    },
    actions: {
        flexDirection: 'row',
        gap: 4,
        marginLeft: 4,
    },
    priorityWrapper: {
        position: 'relative',
    },
    editRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    editInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: '#FFFFFF',
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
});
