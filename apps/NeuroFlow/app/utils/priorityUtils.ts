import {Priority} from "../models";

export function getPriorityStyle<T>(priority: Priority, high: T, medium: T, low: T): T {
    switch (priority) {
        case 'high': return high
        case 'medium': return medium
        case 'low': return low
    }
}
