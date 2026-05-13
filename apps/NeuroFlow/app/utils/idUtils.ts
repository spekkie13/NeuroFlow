/**
 * Generates a unique string ID.
 * Combines a base-36 timestamp with a random suffix to prevent collisions
 * when multiple IDs are created within the same millisecond.
 */
export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2)
}