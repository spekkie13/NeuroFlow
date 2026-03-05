import {TimelineTaskItemProps} from "@/app/props/timeline/TimelineItemTaskProps";
import React, {useMemo} from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { ArrowDown, ArrowUp, CheckCircle2, Circle } from "lucide-react-native";
import { IconButton } from "@/app/components/ui/IconButton";
import { styles } from "@/app/styles/timelineTaskItem";

export const TimelineTaskItem: React.FC<TimelineTaskItemProps> = ({
                                                               task,
                                                               dateLabel,
                                                               projectColor,
                                                               onToggleComplete,
                                                               onMoveUp,
                                                               onMoveDown,
                                                               canMoveUp,
                                                               canMoveDown,
                                                           }) => {
    const priorityStyles = useMemo(() => {
        switch (task.priority) {
            case 'high':
                return styles.priorityHigh
            case 'medium':
                return styles.priorityMedium
            case 'low':
                return styles.priorityLow
            default:
                return {}
        }
    }, [task.priority])

    return (
        <View
            style={[
                styles.taskCard,
                task.completed ? styles.taskCardCompleted : styles.taskCardActive,
                { borderLeftColor: task.completed ? '#9ca3af' : projectColor },
            ]}
        >
            <View style={styles.taskRow}>
                {/* Checkbox */}
                <TouchableOpacity
                    onPress={onToggleComplete}
                    style={styles.taskCheckButton}
                    activeOpacity={0.7}
                >
                    {task.completed ? (
                        <CheckCircle2 size={18} color="#22c55e" />
                    ) : (
                        <Circle size={18} color="#9ca3af" />
                    )}
                </TouchableOpacity>

                {/* Content */}
                <View style={styles.taskMain}>
                    {/* Titel */}
                    <Text
                        numberOfLines={2}
                        style={[
                            styles.taskTitle,
                            task.completed && styles.taskTitleCompleted,
                        ]}
                    >
                        {task.name}
                    </Text>

                    {/* Meta: priority + range */}
                    <View style={styles.taskMetaRow}>
                        <View style={[styles.priorityBadge, priorityStyles]}>
                            <Text style={styles.priorityBadgeText}>{task.priority}</Text>
                        </View>
                        {!!dateLabel && (
                            <Text style={styles.taskDateText}>{dateLabel}</Text>
                        )}
                    </View>
                </View>

                {/* Reorder controls */}
                <View style={styles.taskReorder}>
                    <IconButton
                        icon={
                            <ArrowUp
                                size={14}
                                color={canMoveUp ? '#6b7280' : '#d1d5db'}
                            />
                        }
                        variant="neutral"
                        onPress={canMoveUp && onMoveUp ? onMoveUp : undefined}
                        disabled={!canMoveUp}
                        accessibilityLabel="Move task up"
                    />
                    <IconButton
                        icon={
                            <ArrowDown
                                size={14}
                                color={canMoveDown ? '#6b7280' : '#d1d5db'}
                            />
                        }
                        variant="neutral"
                        onPress={canMoveDown && onMoveDown ? onMoveDown : undefined}
                        disabled={!canMoveDown}
                        accessibilityLabel="Move task down"
                    />
                </View>
            </View>
        </View>
    )
}
