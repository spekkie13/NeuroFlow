import React, { useEffect, useState } from 'react';
import { Project, Task, Account } from '../utils/types';
import { User } from '../utils/auth';
import { TaskView } from './TaskView';
import { Timeline } from './Timeline';
import { AccountView } from './AccountView';
import { BottomNav } from './BottomNav';
import { saveProjects, loadProjects, saveAccounts, loadAccounts, getCurrentAccount, setCurrentAccount } from '../utils/storage';
type View = 'tasks' | 'timeline' | 'account';
interface PlannerProps {
  user: User;
  onLogout: () => void;
}
export function Planner({
  user,
  onLogout
}: PlannerProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentAccountId, setCurrentAccountId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentView, setCurrentView] = useState<View>('tasks');
  useEffect(() => {
    const loadedAccounts = loadAccounts();
    setAccounts(loadedAccounts);
    const savedAccountId = getCurrentAccount();
    if (savedAccountId && loadedAccounts.find(a => a.id === savedAccountId)) {
      setCurrentAccountId(savedAccountId);
    } else if (loadedAccounts.length > 0) {
      setCurrentAccountId(loadedAccounts[0].id);
      setCurrentAccount(loadedAccounts[0].id);
    }
  }, []);
  useEffect(() => {
    if (currentAccountId) {
      const loadedProjects = loadProjects(currentAccountId);
      setProjects(loadedProjects);
    }
  }, [currentAccountId]);
  useEffect(() => {
    if (currentAccountId) {
      saveProjects(projects, currentAccountId);
    }
  }, [projects, currentAccountId]);
  const handleAddProject = (name: string, color: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      tasks: [],
      color
    };
    setProjects([...projects, newProject]);
  };
  const handleUpdateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(projects.map(p => p.id === projectId ? {
      ...p,
      ...updates
    } : p));
  };
  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };
  const handleAddTask = (projectId: string, task: Task) => {
    setProjects(projects.map(p => p.id === projectId ? {
      ...p,
      tasks: [...p.tasks, task]
    } : p));
  };
  const handleUpdateTask = (projectId: string, taskId: string, updates: Partial<Task>) => {
    setProjects(projects.map(p => p.id === projectId ? {
      ...p,
      tasks: p.tasks.map(t => t.id === taskId ? {
        ...t,
        ...updates
      } : t)
    } : p));
  };
  const handleDeleteTask = (projectId: string, taskId: string) => {
    setProjects(projects.map(p => p.id === projectId ? {
      ...p,
      tasks: p.tasks.filter(t => t.id !== taskId)
    } : p));
  };
  const handleAddAccount = (name: string) => {
    const newAccount: Account = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString()
    };
    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    saveAccounts(updatedAccounts);
  };
  const handleUpdateAccount = (accountId: string, name: string) => {
    const updatedAccounts = accounts.map(a => a.id === accountId ? {
      ...a,
      name
    } : a);
    setAccounts(updatedAccounts);
    saveAccounts(updatedAccounts);
  };
  const handleDeleteAccount = (accountId: string) => {
    if (accounts.length === 1) {
      alert('You must have at least one account');
      return;
    }
    const updatedAccounts = accounts.filter(a => a.id !== accountId);
    setAccounts(updatedAccounts);
    saveAccounts(updatedAccounts);
    if (currentAccountId === accountId) {
      const newAccountId = updatedAccounts[0].id;
      setCurrentAccountId(newAccountId);
      setCurrentAccount(newAccountId);
    }
  };
  const handleSwitchAccount = (accountId: string) => {
    setCurrentAccountId(accountId);
    setCurrentAccount(accountId);
  };
  return <div className="pb-20">
      {currentView === 'tasks' && <TaskView projects={projects} onAddProject={handleAddProject} onUpdateProject={handleUpdateProject} onDeleteProject={handleDeleteProject} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} />}
      {currentView === 'timeline' && <div className="max-w-7xl mx-auto px-6 py-8">
          {projects.map(project => <div key={project.id} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-4 h-4 rounded-full" style={{
            backgroundColor: project.color
          }}></div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {project.name}
                </h2>
              </div>
              <Timeline project={project} onAddTask={task => handleAddTask(project.id, task)} onUpdateTask={(taskId, updates) => handleUpdateTask(project.id, taskId, updates)} />
            </div>)}
          {projects.length === 0 && <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No projects yet</p>
              <p className="text-sm">
                Go to Tasks view to create your first project
              </p>
            </div>}
        </div>}
      {currentView === 'account' && <AccountView accounts={accounts} currentAccountId={currentAccountId} onAddAccount={handleAddAccount} onUpdateAccount={handleUpdateAccount} onDeleteAccount={handleDeleteAccount} onSwitchAccount={handleSwitchAccount} user={user} onLogout={onLogout} />}
      <BottomNav currentView={currentView} onViewChange={setCurrentView} />
    </div>;
}