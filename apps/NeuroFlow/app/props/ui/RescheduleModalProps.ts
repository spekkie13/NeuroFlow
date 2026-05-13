export interface RescheduleModalProps {
    visible: boolean
    taskName?: string
    date: string
    hasDate?: boolean
    onChangeDate: (value: string) => void
    onSave: () => void
    onClear?: () => void
    onCancel: () => void
}
