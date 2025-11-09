import React, { useState } from 'react';
import { Project } from '../utils/types';
import { EditIcon, TrashIcon, CheckIcon, XIcon } from 'lucide-react';
interface ProjectListProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}
export function ProjectList({
  projects,
  selectedProjectId,
  onSelectProject,
  onUpdateProject,
  onDeleteProject
}: ProjectListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const startEditing = (project: Project) => {
    setEditingId(project.id);
    setEditName(project.name);
  };
  const saveEdit = (project: Project) => {
    onUpdateProject({
      ...project,
      name: editName.trim() || 'Untitled Project'
    });
    setEditingId(null);
  };
  const cancelEdit = () => {
    setEditingId(null);
  };
  return <div className="py-2">
      {projects.map(project => <div key={project.id} className={`group flex items-center px-6 py-3 transition-colors ${selectedProjectId === project.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}>
          <div className="w-3 h-3 rounded-full mr-3 flex-shrink-0" style={{
        backgroundColor: project.color
      }}></div>
          <div className="flex-1 min-w-0">
            {editingId === project.id ? <div className="flex items-center gap-2">
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" autoFocus onKeyDown={e => e.key === 'Enter' && saveEdit(project)} />
                <button onClick={() => saveEdit(project)} className="p-1 text-green-600 hover:bg-green-50 rounded" aria-label="Save">
                  <CheckIcon size={16} />
                </button>
                <button onClick={cancelEdit} className="p-1 text-gray-500 hover:bg-gray-100 rounded" aria-label="Cancel">
                  <XIcon size={16} />
                </button>
              </div> : <button className="text-left w-full font-medium text-gray-800 truncate hover:text-gray-900" onClick={() => onSelectProject(project.id)}>
                {project.name}
              </button>}
          </div>
          {editingId !== project.id && <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => startEditing(project)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors" aria-label="Edit project">
                <EditIcon size={16} />
              </button>
              <button onClick={() => onDeleteProject(project.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" aria-label="Delete project">
                <TrashIcon size={16} />
              </button>
            </div>}
        </div>)}
      {projects.length === 0 && <div className="px-6 py-8 text-center text-sm text-gray-500">
          <p>No projects yet</p>
          <p className="text-xs mt-1">Click + to create one</p>
        </div>}
    </div>;
}