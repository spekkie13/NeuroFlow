export interface RescheduleModalProps {
    visible: boolean
    taskName?: string
    date: string
    onChangeDate: (value: string) => void
    onSave: () => void
    onCancel: () => void
}
