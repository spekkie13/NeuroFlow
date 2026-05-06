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
    // undefined = inherit global, null = off, "HH:MM" = specific override
    reminderTime?: string | null
    globalReminderTime?: string | null
    onSetReminderTime?: (time: string | null | undefined) => void
}