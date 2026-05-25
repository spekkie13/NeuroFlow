export const BUDGET_PRESETS: { label: string; minutes: number | null }[] = [
    { label: 'No limit', minutes: null },
    { label: '1h', minutes: 60 },
    { label: '2h', minutes: 120 },
    { label: '3h', minutes: 180 },
    { label: '4h', minutes: 240 },
    { label: '6h', minutes: 360 },
    { label: '8h', minutes: 480 },
]

export const PRESETS: number[] = [15, 30, 45, 60, 90, 120, 180, 240]

export const DAY_LABELS: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
export const ESTIMATE_PRESETS: number[] = [5, 10, 15, 30, 45, 60]
export const MONTH_DAYS: number[] = Array.from({ length: 28 }, (_, i) => i + 1)
