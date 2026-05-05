export interface BottomNavProps {
    currentView: ViewType
    onViewChange: (view: ViewType) => void
}

export type ViewType = 'tasks' | 'today' | 'timeline' | 'settings'
