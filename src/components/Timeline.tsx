import React, { useState } from 'react';
import { Project, Task, Priority } from '../utils/types';
import { CalendarIcon, PlusIcon, XIcon, ListIcon, CheckCircleIcon, CircleIcon } from 'lucide-react';
interface TimelineProps {
  project: Project;
  onAddTask: (task: Task) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}
export function Timeline({
  project,
  onAddTask,
  onUpdateTask
}: TimelineProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalTab, setModalTab] = useState<'new' | 'existing'>('new');
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
  const [taskStartDate, setTaskStartDate] = useState('');
  const [taskEndDate, setTaskEndDate] = useState('');
  const [selectedExistingTaskId, setSelectedExistingTaskId] = useState<string | null>(null);
  // Get unscheduled tasks (tasks without dates)
  const unscheduledTasks = project.tasks.filter(task => !task.startDate || !task.endDate);
  const handleOpenAddModal = (date: Date) => {
    setSelectedDate(date);
    const dateStr = date.toISOString().split('T')[0];
    setTaskStartDate(dateStr);
    setTaskEndDate(dateStr);
    setNewTaskName('');
    setNewTaskPriority('medium');
    setSelectedExistingTaskId(null);
    setModalTab(unscheduledTasks.length > 0 ? 'existing' : 'new');
    setShowAddModal(true);
  };
  const handleAddNewTask = () => {
    if (!newTaskName.trim() || !taskStartDate || !taskEndDate) return;
    const newTask: Task = {
      id: Date.now().toString(),
      name: newTaskName.trim(),
      completed: false,
      priority: newTaskPriority,
      startDate: new Date(taskStartDate).toISOString(),
      endDate: new Date(taskEndDate).toISOString(),
      notes: ''
    };
    onAddTask(newTask);
    setShowAddModal(false);
    setNewTaskName('');
  };
  const handleAddExistingTask = () => {
    if (!selectedExistingTaskId || !taskStartDate || !taskEndDate) return;
    onUpdateTask(selectedExistingTaskId, {
      startDate: new Date(taskStartDate).toISOString(),
      endDate: new Date(taskEndDate).toISOString()
    });
    setShowAddModal(false);
    setSelectedExistingTaskId(null);
  };
  const toggleTaskComplete = (taskId: string, completed: boolean) => {
    onUpdateTask(taskId, {
      completed
    });
  };
  // Get date range for the timeline view
  const today = new Date();
  const dates = Array.from({
    length: 14
  }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });
  // Group tasks by their dates
  const tasksByDate = dates.map(date => {
    const dateStr = date.toISOString().split('T')[0];
    return {
      date,
      tasks: project.tasks.filter(task => {
        if (!task.startDate || !task.endDate) return false;
        const start = new Date(task.startDate).toISOString().split('T')[0];
        const end = new Date(task.endDate).toISOString().split('T')[0];
        return dateStr >= start && dateStr <= end;
      })
    };
  });
  const getPriorityClass = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
    }
  };
  return <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Timeline View</h3>
          <p className="text-sm text-gray-500 mt-1">Next 14 days</p>
        </div>
        {unscheduledTasks.length > 0 && <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
            <ListIcon size={16} className="text-amber-600" />
            <span className="text-sm text-amber-700 font-medium">
              {unscheduledTasks.length} unscheduled task
              {unscheduledTasks.length !== 1 ? 's' : ''}
            </span>
          </div>}
      </div>
      <div className="overflow-x-auto -mx-6 px-6">
        <div className="inline-flex min-w-full gap-0 border border-gray-200 rounded-lg overflow-hidden">
          {dates.map((date, index) => <div key={index} className="w-44 flex-shrink-0 border-r border-gray-200 last:border-r-0 bg-white">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {date.toLocaleDateString('en-US', {
                weekday: 'short'
              })}
                </div>
                <div className="text-base font-semibold text-gray-800 mt-0.5">
                  {date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
                </div>
              </div>
              <div className="p-3 min-h-[200px]">
                <div className="space-y-2">
                  {tasksByDate[index].tasks.map(task => <div key={task.id} className={`group rounded-lg border-l-4 shadow-sm transition-all hover:shadow-md ${task.completed ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-300 hover:border-opacity-80'}`} style={{
                borderLeftColor: task.completed ? '#9CA3AF' : project.color
              }}>
                      <div className="p-3 flex items-start gap-2">
                        <button onClick={e => {
                    e.stopPropagation();
                    toggleTaskComplete(task.id, !task.completed);
                  }} className="flex-shrink-0 mt-0.5 text-gray-400 hover:text-blue-600 focus:outline-none transition-colors" aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}>
                          {task.completed ? <CheckCircleIcon size={16} className="text-green-500" /> : <CircleIcon size={16} />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium text-xs truncate mb-1 ${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                            {task.name}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {new Date(task.startDate!).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}{' '}
                            -{' '}
                            {new Date(task.endDate!).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>
                {/* Add task to this date button */}
                <button className="w-full flex items-center justify-center p-3 mt-2 text-xs text-gray-500 hover:bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:text-blue-600 transition-colors" onClick={() => handleOpenAddModal(date)}>
                  <PlusIcon size={14} className="mr-1" />
                  Add task
                </button>
              </div>
            </div>)}
        </div>
      </div>
      {/* Add Task Modal */}
      {showAddModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Schedule Task
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Close">
                <XIcon size={20} />
              </button>
            </div>
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button onClick={() => setModalTab('existing')} className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${modalTab === 'existing' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`}>
                <div className="flex items-center justify-center gap-2">
                  <ListIcon size={16} />
                  Add Existing ({unscheduledTasks.length})
                </div>
              </button>
              <button onClick={() => setModalTab('new')} className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${modalTab === 'new' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`}>
                <div className="flex items-center justify-center gap-2">
                  <PlusIcon size={16} />
                  Create New
                </div>
              </button>
            </div>
            <div className="px-6 py-5">
              {modalTab === 'new' ? <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task Name
                    </label>
                    <input type="text" value={newTaskName} onChange={e => setNewTaskName(e.target.value)} placeholder="Enter task name..." className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" autoFocus onKeyDown={e => e.key === 'Enter' && handleAddNewTask()} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <div className="flex gap-2">
                      <button onClick={() => setNewTaskPriority('low')} className={`flex-1 px-4 py-2.5 rounded-lg border-2 transition-all font-medium text-sm ${newTaskPriority === 'low' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        Low
                      </button>
                      <button onClick={() => setNewTaskPriority('medium')} className={`flex-1 px-4 py-2.5 rounded-lg border-2 transition-all font-medium text-sm ${newTaskPriority === 'medium' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        Medium
                      </button>
                      <button onClick={() => setNewTaskPriority('high')} className={`flex-1 px-4 py-2.5 rounded-lg border-2 transition-all font-medium text-sm ${newTaskPriority === 'high' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        High
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input type="date" value={taskStartDate} onChange={e => setTaskStartDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input type="date" value={taskEndDate} onChange={e => setTaskEndDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>
                </div> : <div className="space-y-4">
                  {unscheduledTasks.length === 0 ? <div className="text-center py-8 text-gray-500">
                      <ListIcon size={48} className="mx-auto mb-3 text-gray-400" />
                      <p className="text-sm font-medium">
                        No unscheduled tasks
                      </p>
                      <p className="text-xs mt-1">
                        All tasks have been scheduled
                      </p>
                    </div> : <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Task
                        </label>
                        <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
                          {unscheduledTasks.map(task => <button key={task.id} onClick={() => setSelectedExistingTaskId(task.id)} className={`w-full text-left px-3 py-2.5 rounded-lg border-2 transition-all ${selectedExistingTaskId === task.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-800 text-sm truncate">
                                    {task.name}
                                  </div>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${getPriorityClass(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                            </button>)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date
                          </label>
                          <input type="date" value={taskStartDate} onChange={e => setTaskStartDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date
                          </label>
                          <input type="date" value={taskEndDate} onChange={e => setTaskEndDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                      </div>
                    </>}
                </div>}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
              <button onClick={() => setShowAddModal(false)} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                Cancel
              </button>
              {modalTab === 'new' ? <button onClick={handleAddNewTask} disabled={!newTaskName.trim() || !taskStartDate || !taskEndDate} className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors">
                  Create & Schedule
                </button> : <button onClick={handleAddExistingTask} disabled={!selectedExistingTaskId || !taskStartDate || !taskEndDate} className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors">
                  Schedule Task
                </button>}
            </div>
          </div>
        </div>}
    </div>;
}