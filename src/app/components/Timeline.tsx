import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { List } from 'lucide-react-native';
import { Priority, Task } from '../utils/types';
import { TimelineProps } from '@/props/TimelineProps';
import { styles } from '@/styles/timeline';
import { DayView } from '@/app/components/DayView';
import { TaskModal } from '@/app/components/Task/TaskModal';

export default function Timeline({ project, onAddTask, onUpdateTask }: TimelineProps) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [initialTab, setInitialTab] = useState<'new' | 'existing'>('new');
    const [defaultStartDate, setDefaultStartDate] = useState<string>('');
    const [defaultEndDate, setDefaultEndDate] = useState<string>('');

    const dates = useMemo(() => {
        const today = new Date();
        return Array.from({ length: 14 }, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            return d;
        });
    }, []);

    const unscheduledTasks = useMemo(
        () => project.tasks.filter(t => !t.startDate || !t.endDate),
        [project.tasks]
    );

    const tasksByDate = useMemo(() => {
        return dates.map(date => {
            const dateStr = date.toISOString().split('T')[0];
            const tasks = project.tasks.filter(task => {
                if (!task.startDate || !task.endDate) return false;
                const start = new Date(task.startDate).toISOString().split('T')[0];
                const end = new Date(task.endDate).toISOString().split('T')[0];
                return dateStr >= start && dateStr <= end;
            });
            return { date, tasks };
        });
    }, [dates, project.tasks]);

    const openScheduleModalForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        setDefaultStartDate(dateStr);
        setDefaultEndDate(dateStr);
        setInitialTab(unscheduledTasks.length > 0 ? 'existing' : 'new');
        setShowAddModal(true);
    };

    const handleCreateNewFromModal = (input: {
        name: string;
        priority: Priority;
        startDate: string;
        endDate: string;
    }) => {
        const task: Task = {
            id: Date.now().toString(),
            name: input.name.trim(),
            completed: false,
            priority: input.priority,
            startDate: new Date(input.startDate).toISOString(),
            endDate: new Date(input.endDate).toISOString(),
            notes: '',
        };
        onAddTask(task);
        setShowAddModal(false);
    };

    const handleScheduleExistingFromModal = (input: {
        taskId: string;
        startDate: string;
        endDate: string;
    }) => {
        onUpdateTask(input.taskId, {
            startDate: new Date(input.startDate).toISOString(),
            endDate: new Date(input.endDate).toISOString(),
        });
        setShowAddModal(false);
    };

    const toggleTaskComplete = (taskId: string, completed: boolean) => {
        onUpdateTask(taskId, { completed });
    };

    return (
        <View>
            {/* header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Timeline View</Text>
                    <Text style={styles.subtitle}>Next 14 days</Text>
                </View>
                {unscheduledTasks.length > 0 && (
                    <View style={styles.unscheduledBadge}>
                        <List size={16} color="#B45309" />
                        <Text style={styles.unscheduledText}>
                            {unscheduledTasks.length} unscheduled task
                            {unscheduledTasks.length !== 1 ? 's' : ''}
                        </Text>
                    </View>
                )}
            </View>

            {/* horizontal timeline */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                <View style={styles.timelineRow}>
                    {dates.map((date, index) => (
                        <DayView
                            key={index}
                            date={date}
                            tasks={tasksByDate[index].tasks}
                            projectColor={project.color}
                            onToggleComplete={toggleTaskComplete}
                            onAddForDate={() => openScheduleModalForDate(date)}
                        />
                    ))}
                </View>
            </ScrollView>

            <TaskModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                unscheduledTasks={unscheduledTasks}
                initialTab={initialTab}
                defaultStartDate={defaultStartDate}
                defaultEndDate={defaultEndDate}
                onCreateNew={handleCreateNewFromModal}
                onScheduleExisting={handleScheduleExistingFromModal}
            />
        </View>
    );
}
