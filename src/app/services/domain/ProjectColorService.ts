import { Project } from "@/app/models/Project";

export const PROJECT_COLOR_PALETTE = [
    '#2563eb', // blue
    '#10b981', // green
    '#f97316', // orange
    '#a855f7', // purple
    '#ec4899', // pink
    '#0ea5e9', // cyan
    '#f59e0b', // amber
]

export function getNextProjectColor(projects: Project[]): string {
    const index = projects.length % PROJECT_COLOR_PALETTE.length
    return PROJECT_COLOR_PALETTE[index]
}
