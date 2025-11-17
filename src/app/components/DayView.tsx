// src/app/components/DayView.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { CheckCircle, Circle, Plus } from 'lucide-react-native';
import { Task } from '@/app/utils/types';
import { styles } from '@/styles/timeline';

type DayViewProps = {
    date: Date;
    tasks: Task[];
    projectColor: string;
    onToggleComplete: (taskId: string, nextCompleted: boolean) => void;
    onAddForDate: () => void;
};

export const DayView: React.FC<DayViewProps> = ({
                                                    date,
                                                    tasks,
                                                    projectColor,
                                                    onToggleComplete,
                                                    onAddForDate,
                                                }) => {
    return (
        <View style={styles.dayColumn}>
            <View style={styles.dayHeader}>
                <Text style={styles.dayWeek}>
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </Text>
                <Text style={styles.dayDate}>
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
            </View>
            <View style={styles.dayBody}>
                {tasks.map((task) => (
                    <View
                        key={task.id}
                        style={[
                            styles.taskCard,
                            task.completed && styles.taskCardCompleted,
                            {
                                borderLeftColor: task.completed ? '#9CA3AF' : projectColor,
                            },
                        ]}
                    >
                        <Pressable
                            onPress={() =>
                                onToggleComplete(task.id, !task.completed)
                            }
                            style={styles.taskCheck}
                        >
                            {task.completed ? (
                                <CheckCircle size={16} color="#22C55E" />
                            ) : (
                                <Circle size={16} color="#9CA3AF" />
                            )}
                        </Pressable>
                        <View style={styles.taskInfo}>
                            <Text
                                numberOfLines={1}
                                style={[
                                    styles.taskName,
                                    task.completed && styles.taskNameDone,
                                ]}
                            >
                                {task.name}
                            </Text>
                            {task.startDate && task.endDate && (
                                <Text style={styles.taskDates}>
                                    {new Date(task.startDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    })}{' '}
                                    -{' '}
                                    {new Date(task.endDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </Text>
                            )}
                        </View>
                    </View>
                ))}

                <Pressable onPress={onAddForDate} style={styles.addDayButton}>
                    <Plus size={14} color="#6B7280" />
                    <Text style={styles.addDayText}>Add task</Text>
                </Pressable>
            </View>
        </View>
    );
};
