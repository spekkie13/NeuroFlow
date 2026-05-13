export interface EstimateModalProps {
    visible: boolean
    taskName?: string
    currentMinutes?: number
    onSetEstimate: (minutes: number | null) => void
    onClose: () => void
}