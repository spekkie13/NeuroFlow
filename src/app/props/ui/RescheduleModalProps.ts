export interface RescheduleModalProps {
    visible: boolean
    taskName?: string
    startDate: string
    onChangeStartDate: (value: string) => void
    onChangeEndDate: (value: string) => void
    onSave: () => void
    onCancel: () => void
}
