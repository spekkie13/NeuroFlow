export interface CreateProjectModalProps {
    visible: boolean
    projectName: string
    onChangeProjectName: (name: string) => void
    onCreate: () => void
    onCancel: () => void
}