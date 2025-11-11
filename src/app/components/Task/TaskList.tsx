import {Priority, Task} from "../../../app/utils/types";
import {ScrollView, View, Text, StyleSheet} from "react-native";
import {TaskItem} from "../../../app/components/Task/TaskItem";

export function TaskList({
                             tasks,
                             editingTaskId,
                             showPriorityMenu,
                             onScrollCloseMenu,
                             onStartEdit,
                             onChangeEdit,
                             editValue,
                             onSaveEdit,
                             onDeleteTask,
                             onToggleComplete,
                             onTogglePriorityMenu,
                             onSetPriority,
                         }: {
    tasks: Task[];
    editingTaskId: string | null;
    showPriorityMenu: string | null;
    onScrollCloseMenu: () => void;
    onStartEdit: (task: Task) => void;
    onChangeEdit: (value: string) => void;
    editValue: string;
    onSaveEdit: (taskId: string) => void;
    onDeleteTask: (taskId: string) => void;
    onToggleComplete: (taskId: string, completed: boolean) => void;
    onTogglePriorityMenu: (taskId: string) => void;
    onSetPriority: (taskId: string, priority: Priority) => void;
}) {
    return (
        <ScrollView
            style={[styles.list, { overflow: 'visible' }]}
            contentContainerStyle={{ paddingBottom: 110, overflow: 'visible' }}
            onScroll={onScrollCloseMenu}
            scrollEventThrottle={16}
        >
            {tasks.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyTitle}>Nog niets hier 👀</Text>
                    <Text style={styles.emptySubtitle}>
                        Voeg een taak toe en we helpen je focussen.
                    </Text>
                </View>
            ) : (
                tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        isEditing={editingTaskId === task.id}
                        isMenuOpen={showPriorityMenu === task.id}
                        editValue={editValue}
                        onStartEdit={() => onStartEdit(task)}
                        onChangeEdit={onChangeEdit}
                        onSaveEdit={() => onSaveEdit(task.id)}
                        onDelete={() => onDeleteTask(task.id)}
                        onToggleComplete={() => onToggleComplete(task.id, !task.completed)}
                        onTogglePriorityMenu={() => onTogglePriorityMenu(task.id)}
                        onSetPriority={(priority) => onSetPriority(task.id, priority)}
                    />
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    overlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        zIndex: 500,
    },
    toast: {
        position: 'absolute',
        top: 16,
        alignSelf: 'center',
        backgroundColor: '#2563EB',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 9999,
        zIndex: 2000,
    },
    toastText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    header: {
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    projectTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    metaText: {
        fontSize: 13,
        color: '#6B7280',
    },
    metaCount: {
        fontWeight: '600',
        color: '#374151',
    },
    dot: {
        color: '#9CA3AF',
    },
    focusBtn: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 9999,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: '#FFFFFF',
    },
    focusBtnActive: {
        backgroundColor: '#DBEAFE',
        borderColor: '#2563EB',
    },
    focusBtnText: {
        fontSize: 12,
        color: '#374151',
    },
    focusBtnTextActive: {
        color: '#1D4ED8',
    },
    addRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 14,
    },
    addInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        fontSize: 14,
    },
    addButton: {
        backgroundColor: '#2563EB',
        borderRadius: 10,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonDisabled: {
        backgroundColor: '#93C5FD',
    },
    list: {
        flex: 1,
    },
    emptyBox: {
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        borderRadius: 16,
        paddingVertical: 48,
        alignItems: 'center',
        marginTop: 8,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#4B5563',
        marginBottom: 4,
    },
    emptySubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
    },
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
    priorityMenu: {
        position: 'absolute',
        top: 36,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingVertical: 4,
        width: 150,
        zIndex: 1000,
        elevation: 12,
    },
    priorityMenuItem: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    priorityMenuText: {
        fontSize: 13,
        color: '#374151',
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
