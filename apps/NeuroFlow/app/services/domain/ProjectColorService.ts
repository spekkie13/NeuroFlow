import {Project} from "../../models";

export const PROJECT_COLOR_PALETTE: readonly string[] = [
    '#2563eb', // blue
    '#10b981', // green
    '#f97316', // orange
    '#a855f7', // purple
    '#ec4899', // pink
    '#0ea5e9', // cyan
    '#f59e0b', // amber
]

/**
 * Returns the next color from the palette using round-robin assignment
 * based on the current number of projects.
 */
export function getNextProjectColor(projects: Project[]): string {
    const index = projects.length % PROJECT_COLOR_PALETTE.length
    return PROJECT_COLOR_PALETTE[index]
}
