import React from 'react';
import { ListTodoIcon, CalendarIcon, UserIcon } from 'lucide-react';
type View = 'tasks' | 'timeline' | 'account';
interface BottomNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
}
export function BottomNav({
  currentView,
  onViewChange
}: BottomNavProps) {
  const navItems = [{
    id: 'tasks' as View,
    label: 'Tasks',
    icon: ListTodoIcon
  }, {
    id: 'timeline' as View,
    label: 'Timeline',
    icon: CalendarIcon
  }, {
    id: 'account' as View,
    label: 'Account',
    icon: UserIcon
  }];
  return <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto px-4">
        {navItems.map(item => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return <button key={item.id} onClick={() => onViewChange(item.id)} className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} aria-label={item.label}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </button>;
      })}
      </div>
    </nav>;
}