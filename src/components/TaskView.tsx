import React, { useState } from 'react';
import { Project, Task, Priority } from '../utils/types';
import { PlusIcon, CheckCircleIcon, CircleIcon, ClockIcon, ArrowUpIcon, ArrowRightIcon, ArrowDownIcon, TrashIcon, EditIcon, XIcon, CheckIcon } from 'lucide-react';
interface TaskViewProps {
  project: Project;
  onAddTask: (task: Task) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}
export function TaskView({
  project,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}: TaskViewProps) {
  const [newTaskName, setNewTaskName] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskName, setEditTaskName] = useState('');
  const [showPriorityMenu, setShowPriorityMenu] = useState<string | null>(null);
  const handleAddTask = () => {
    if (newTaskName.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        name: newTaskName.trim(),
        completed: false,
        priority: 'medium',
        startDate: null,
        endDate: null,
        notes: ''
      };
      onAddTask(newTask);
      setNewTaskName('');
    }
  };
  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTaskName(task.name);
  };
  const saveEdit = (taskId: string) => {
    onUpdateTask(taskId, {
      name: editTaskName.trim() || 'Untitled Task'
    });
    setEditingTaskId(null);
  };
  const toggleCompleted = (taskId: string, completed: boolean) => {
    onUpdateTask(taskId, {
      completed
    });
  };
  const setPriority = (taskId: string, priority: Priority) => {
    onUpdateTask(taskId, {
      priority
    });
  };
  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return <ArrowUpIcon size={16} className="text-red-500" />;
      case 'medium':
        return <ArrowRightIcon size={16} className="text-yellow-500" />;
      case 'low':
        return <ArrowDownIcon size={16} className="text-green-500" />;
    }
  };
  const getPriorityClass = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-100';
    }
  };
  return <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3" style={{
        color: project.color
      }}>
          {project.name}
        </h2>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="font-medium">{project.tasks.length}</span> tasks
          </span>
          <span className="text-gray-400">•</span>
          <span className="flex items-center gap-1.5">
            <span className="font-medium">
              {project.tasks.filter(t => t.completed).length}
            </span>{' '}
            completed
          </span>
        </div>
      </div>
      {/* Add task form */}
      <div className="mb-8">
        <div className="flex gap-2">
          <input type="text" value={newTaskName} onChange={e => setNewTaskName(e.target.value)} placeholder="Add a new task..." className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" onKeyDown={e => e.key === 'Enter' && handleAddTask()} />
          <button onClick={handleAddTask} disabled={!newTaskName.trim()} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium">
            <PlusIcon size={20} />
          </button>
        </div>
      </div>
      {/* Tasks list */}
      <div className="space-y-3">
        {project.tasks.length === 0 ? <div className="text-center py-16 text-gray-500 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-lg mb-2">No tasks yet</p>
            <p className="text-sm">Add your first task to get started</p>
          </div> : project.tasks.map(task => <div key={task.id} className={`border rounded-xl p-4 transition-all ${task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>
              <div className="flex items-start gap-3">
                <button onClick={() => toggleCompleted(task.id, !task.completed)} className="mt-0.5 text-gray-400 hover:text-blue-600 focus:outline-none transition-colors" aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}>
                  {task.completed ? <CheckCircleIcon size={22} className="text-green-500" /> : <CircleIcon size={22} />}
                </button>
                <div className="flex-1 min-w-0">
                  {editingTaskId === task.id ? <div className="flex items-center gap-2">
                      <input type="text" value={editTaskName} onChange={e => setEditTaskName(e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" autoFocus onKeyDown={e => e.key === 'Enter' && saveEdit(task.id)} />
                      <button onClick={() => saveEdit(task.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" aria-label="Save">
                        <CheckIcon size={18} />
                      </button>
                      <button onClick={() => setEditingTaskId(null)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Cancel">
                        <XIcon size={18} />
                      </button>
                    </div> : <>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                          {task.name}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getPriorityClass(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      {task.startDate && task.endDate && <div className="flex items-center text-xs text-gray-500 mt-2">
                          <ClockIcon size={14} className="mr-1.5" />
                          <span>
                            {new Date(task.startDate).toLocaleDateString()} -{' '}
                            {new Date(task.endDate).toLocaleDateString()}
                          </span>
                        </div>}
                    </>}
                </div>
                {editingTaskId !== task.id && <div className="flex items-center gap-1">
                    <div className="relative">
                      <button onClick={() => setShowPriorityMenu(showPriorityMenu === task.id ? null : task.id)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Set priority" title="Set priority">
                        {getPriorityIcon(task.priority)}
                      </button>
                      {showPriorityMenu === task.id && <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[140px]">
                          <button onClick={() => {
                  setPriority(task.id, 'high');
                  setShowPriorityMenu(null);
                }} className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors">
                            <ArrowUpIcon size={16} className="mr-2 text-red-500" />
                            High
                          </button>
                          <button onClick={() => {
                  setPriority(task.id, 'medium');
                  setShowPriorityMenu(null);
                }} className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors">
                            <ArrowRightIcon size={16} className="mr-2 text-yellow-500" />
                            Medium
                          </button>
                          <button onClick={() => {
                  setPriority(task.id, 'low');
                  setShowPriorityMenu(null);
                }} className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors">
                            <ArrowDownIcon size={16} className="mr-2 text-green-500" />
                            Low
                          </button>
                        </div>}
                    </div>
                    <button onClick={() => startEditing(task)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Edit task" title="Edit task">
                      <EditIcon size={18} />
                    </button>
                    <button onClick={() => onDeleteTask(task.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" aria-label="Delete task" title="Delete task">
                      <TrashIcon size={18} />
                    </button>
                  </div>}
              </div>
            </div>)}
      </div>
    </div>;
}