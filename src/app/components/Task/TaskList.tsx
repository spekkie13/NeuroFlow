import { ScrollView, View, Text } from "react-native";
import { TaskItem } from "../../../app/components/Task/TaskItem";
import { TaskListProps}  from "@/props/TaskListProps";
import { styles } from "@/styles/taskList";

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
                         }: TaskListProps) {
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

