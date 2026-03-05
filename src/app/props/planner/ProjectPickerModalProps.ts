import { Project } from '@/app/models/Project'

export interface ProjectPickerModalProps {
    visible: boolean
    projects: Project[]
    activeProjectId: string | null
    onSelectProject: (projectId: string) => void
    onClose: () => void
}