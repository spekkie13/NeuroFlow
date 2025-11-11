export type Priority = 'high' | 'medium' | 'low';
export interface Task {
  id: string;
  name: string;
  completed: boolean;
  priority: Priority;
  startDate: string | null;
  endDate: string | null;
  notes: string;
}
export interface Project {
  id: string;
  name: string;
  tasks: Task[];
  color: string;
}
export interface Account {
  id: string;
  name: string;
  createdAt: string;
}