export interface CreateProjectModalProps {
    visible: boolean
    projectName: string
    onChangeProjectName: (name: string) => void
    onCreate: () => void
    onCancel: () => void
    selectedColor: string
    onSelectColor: (color: string) => void
    editMode?: boolean
    onDelete?: () => void
}