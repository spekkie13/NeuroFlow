// TaskList.tsx
import React, { useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    Platform,
} from 'react-native';
import type {
    RenderItemParams,
} from 'react-native-draggable-flatlist';

import { Task } from '@/app/utils/types';
import { TaskItem } from '@/app/components/Task/TaskItem';
import { TaskListProps } from '@/props/TaskListProps';
import { styles } from '@/styles/taskList';

// Lazy load van de draggable list, alleen op native
let DraggableFlatListNative: any = null;
if (Platform.OS !== 'web') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    DraggableFlatListNative = require('react-native-draggable-flatlist').default;
}

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
                             onReorderTasks, // optioneel
                         }: TaskListProps) {
    const renderItem = useCallback(
        ({ item }: RenderItemParams<Task>) => (
            <TaskItem
                task={item}
                isEditing={editingTaskId === item.id}
                isMenuOpen={showPriorityMenu === item.id}
                editValue={editValue}
                onStartEdit={() => onStartEdit(item)}
                onChangeEdit={onChangeEdit}
                onSaveEdit={() => onSaveEdit(item.id)}
                onDelete={() => onDeleteTask(item.id)}
                onToggleComplete={() => onToggleComplete(item.id, !item.completed)}
                onTogglePriorityMenu={() => onTogglePriorityMenu(item.id)}
                onSetPriority={(priority) => onSetPriority(item.id, priority)}
            />
        ),
        [
            editingTaskId,
            showPriorityMenu,
            editValue,
            onStartEdit,
            onChangeEdit,
            onSaveEdit,
            onDeleteTask,
            onToggleComplete,
            onTogglePriorityMenu,
            onSetPriority,
        ],
    );

    // Geen taken: leeg bericht
    if (!tasks || tasks.length === 0) {
        return (
            <View style={styles.emptyBox}>
                <Text style={styles.emptyTitle}>Nog niets hier 👀</Text>
                <Text style={styles.emptySubtitle}>
                    Voeg een taak toe en we helpen je focussen.
                </Text>
            </View>
        );
    }

    // 🔹 Web fallback: géén draggable, gewoon ScrollView
    if (Platform.OS === 'web' || !DraggableFlatListNative || !onReorderTasks) {
        return (
            <ScrollView
                style={[styles.list, { overflow: 'visible' }]}
                contentContainerStyle={{ paddingBottom: 110, overflow: 'visible' }}
                onScroll={onScrollCloseMenu}
                scrollEventThrottle={16}
            >
                {tasks.map((task) => (
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
                        onToggleComplete={() =>
                            onToggleComplete(task.id, !task.completed)
                        }
                        onTogglePriorityMenu={() => onTogglePriorityMenu(task.id)}
                        onSetPriority={(priority) => onSetPriority(task.id, priority)}
                    />
                ))}
            </ScrollView>
        );
    }

    // 🔹 Native (iOS/Android): echte drag & drop lijst
    const DraggableFlatList = DraggableFlatListNative;

    return (
        <DraggableFlatList
            data={tasks}
            keyExtractor={(item: Task) => item.id}
            renderItem={renderItem}
            containerStyle={styles.list}
            contentContainerStyle={{ paddingBottom: 110 }}
            onScrollBeginDrag={onScrollCloseMenu}
            onDragBegin={onScrollCloseMenu}
            onDragEnd={({ data }: { data: Task[] }) => {
                if (onReorderTasks) {
                    onReorderTasks(data);
                }
            }}
        />
    );
}
