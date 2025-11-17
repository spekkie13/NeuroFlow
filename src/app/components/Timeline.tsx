// src/components/Timeline.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { List } from 'lucide-react-native';

import { Task, Priority } from '../utils/types';
import { TimelineProps } from '@/props/TimelineProps';
import { styles } from '@/styles/timeline';
import { DayView } from '@/app/components/DayView';
import { TaskModal } from '@/app/components/Task/TaskModal';

export default function Timeline({ project, onAddTask, onUpdateTask }: TimelineProps) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [modalMode, setModalMode] = useState<'new' | 'existing'>('new');
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
    const [taskStartDate, setTaskStartDate] = useState('');
    const [taskEndDate, setTaskEndDate] = useState('');
    const [selectedExistingTaskId, setSelectedExistingTaskId] = useState<string | null>(null);

    // 14-dagen range
    const dates = useMemo(() => {
        const today = new Date();
        return Array.from({ length: 14 }, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            return d;
        });
    }, []);

    // ongeplande taken
    const unscheduledTasks = useMemo(
        () => project.tasks.filter((t) => !t.startDate || !t.endDate),
        [project.tasks],
    );

    // taken per dag
    const tasksByDate = useMemo(() => {
        return dates.map((date) => {
            const dateStr = date.toISOString().split('T')[0];
            const tasks = project.tasks.filter((task) => {
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
        setSelectedDate(dateStr);
        setTaskStartDate(dateStr);
        setTaskEndDate(dateStr);
        setNewTaskName('');
        setNewTaskPriority('medium');
        setSelectedExistingTaskId(null);

        setModalMode(unscheduledTasks.length > 0 ? 'existing' : 'new');
        setShowAddModal(true);
    };

    const toggleTaskComplete = (taskId: string, completed: boolean) => {
        onUpdateTask(taskId, { completed });
    };

    const handleConfirmNewTask = () => {
        if (!newTaskName.trim() || !taskStartDate || !taskEndDate) return;

        const newTask: Task = {
            id: Date.now().toString(),
            name: newTaskName.trim(),
            completed: false,
            priority: newTaskPriority,
            startDate: new Date(taskStartDate).toISOString(),
            endDate: new Date(taskEndDate).toISOString(),
            notes: '',
        };

        onAddTask(newTask);
        setShowAddModal(false);
    };

    const handleConfirmExistingTask = () => {
        if (!selectedExistingTaskId || !taskStartDate || !taskEndDate) return;

        onUpdateTask(selectedExistingTaskId, {
            startDate: new Date(taskStartDate).toISOString(),
            endDate: new Date(taskEndDate).toISOString(),
        });

        setShowAddModal(false);
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
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
            >
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

            {/* modal */}
            <TaskModal
                visible={showAddModal}
                mode={modalMode}
                onChangeMode={setModalMode}
                unscheduledTasks={unscheduledTasks}
                taskName={newTaskName}
                onChangeTaskName={setNewTaskName}
                priority={newTaskPriority}
                onChangePriority={setNewTaskPriority}
                startDate={taskStartDate}
                endDate={taskEndDate}
                onChangeStartDate={setTaskStartDate}
                onChangeEndDate={setTaskEndDate}
                selectedTaskId={selectedExistingTaskId}
                onChangeSelectedTaskId={setSelectedExistingTaskId}
                onClose={() => setShowAddModal(false)}
                onConfirmNew={handleConfirmNewTask}
                onConfirmExisting={handleConfirmExistingTask}
            />
        </View>
    );
}
