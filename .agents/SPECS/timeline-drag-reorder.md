# Timeline Task Drag-and-Drop Reorder — Spec

## Purpose
Allow users to drag individual task cards up and down within a single date column (or the overdue column) on the timeline to manually set their display order. The new order persists across sessions and syncs to Supabase.

## Non-Goals
- Cross-column drag (date changes) — use the reschedule modal for that.
- Drag between different projects' timelines.
- Drag reorder on the task backlog / project detail screen (separate feature).
- Animated placeholder preview beyond what `react-native-draggable-flatlist` provides out of the box.

## Interfaces

### Data model change — Task
```typescript
interface Task {
  // ...existing fields...
  sortOrder: number | null   // null only when task has no date (unscheduled); always a number for any dated task
}
```

### Supabase schema change
```sql
ALTER TABLE tasks ADD COLUMN sort_order integer DEFAULT NULL;
```

### New ProjectService helpers
```typescript
nextSortOrderForDate(project: Project, date: string): number
// Returns max(sortOrder of tasks on that date) + 1, or 0 if no dated tasks exist yet.
// Using max+1 (not count) means it is collision-safe even when gaps exist from prior deletions/reschedules.

compactSortOrderForDate(project: Project, date: string): Project
// Renumbers all tasks on `date` as 0, 1, 2... preserving their current relative sortOrder.
// Called after any task *leaves* a date (deletion or reschedule-away) to close gaps.
// Returns an updated project; also returns the list of affected tasks for Supabase batch update.

withTasksReordered(project: Project, reorderedTasks: Task[]): Project
// Writes sortOrder = array index (0, 1, 2...) for every task in reorderedTasks.
// This naturally compacts any gaps as a side effect of the drag operation.
// Only touches tasks present in reorderedTasks; all other tasks unchanged.
```

### Updated ProjectService: task creation, reschedule, and deletion
- `withTaskAdded(project, task)`: if `task.date` is set, assign `task.sortOrder = nextSortOrderForDate(project, task.date)` before appending. If no date, `sortOrder` is null.
- `withTaskUpdated(project, taskId, updates)`: if `updates.date` is set and differs from the current task date:
  1. Assign `updates.sortOrder = nextSortOrderForDate(project, updates.date)` (arrival at new date).
  2. Call `compactSortOrderForDate(project, oldDate)` on the task's previous date (departure gap cleanup).
- `withTaskDeleted(project, taskId)`: after removing the task, call `compactSortOrderForDate` on the deleted task's date (if it had one) to renumber the remaining tasks.

### Updated useProjects hook
```typescript
reorderTasks(projectId: string, reorderedTasks: Task[]): void
// Calls withTasksReordered, persists, syncs to Supabase
```

### Updated Timeline component
- Each date column renders a `DraggableFlatList<Task>` instead of `.map()` over tasks.
- Overdue column also uses `DraggableFlatList<Task>`.
- `keyExtractor`: `task.id`
- `onDragEnd({ data })`: calls `onReorderTasks(data)` (new prop on TimelineProps)
- Drag gesture config: `activeOffsetY={[-5, 5]}`, `failOffsetX={[-5, 5]}` to avoid conflicting with horizontal scroll.

### Updated TimelineProps
```typescript
interface TimelineProps {
  // ...existing...
  onReorderTasks: (projectId: string, reorderedTasks: Task[]) => void
}
```

### Column sort order
Tasks within a column are sorted by `sortOrder ASC`. Because all dated tasks always have a sortOrder, no priority fallback is needed. The insertion order (add-to-day order) is the natural initial ordering.

## Edge Cases and Failure Modes
- **Task added to a date:** gets `sortOrder = max(existing sortOrders on that date) + 1`, or 0 if the day is empty. Always appends at the bottom; never collides with existing tasks even if gaps exist.
- **Task rescheduled to a new date:** arrives with `sortOrder = max+1` on the destination day (bottom). The old day's remaining tasks are immediately compacted to `0, 1, 2...` to close the gap left behind.
- **Task deleted:** the day it was on is compacted immediately after removal.
- **Drag reorder:** `withTasksReordered` writes `sortOrder = array index`, so every drag naturally compacts its column to a clean `0, 1, 2...` sequence.
- **Unscheduled task (no date):** `sortOrder` remains null. Not displayed in any date column so sort order is irrelevant.
- **Legacy tasks (null sortOrder but has a date):** `sortTasksForColumn` places them after all numbered ones, stable-sorted by `createdAt`. They receive a proper sortOrder the first time their column is dragged (compacted by `withTasksReordered`).
- **Single task in column:** drag handle visible but reorder is a no-op.
- **Completed tasks:** draggable alongside incomplete tasks; completion state is irrelevant to ordering.
- **Supabase sync failure:** local order is already saved to AsyncStorage; sync retry happens on next update. No data loss.
- **Concurrent edit on two devices:** last-write-wins on sortOrder per task. Acceptable for v1.

## Acceptance Criteria
- [ ] A user can long-press (or use the drag handle) on a task card in any date column and drag it up/down to reorder within that column.
- [ ] The new order persists after closing and reopening the app.
- [ ] The new order syncs to Supabase and appears on a second device after reload.
- [ ] Horizontal scroll of the timeline is not blocked when the user swipes horizontally on a task card.
- [ ] A newly created task appears at the bottom of its date column (last in insertion order).
- [ ] A rescheduled task appears at the bottom of the destination day's column, regardless of its previous sortOrder.
- [ ] The overdue column supports the same drag reorder behaviour.
- [ ] No crash when a column has 0 or 1 task.

## Test Plan
- **Unit:** `nextSortOrderForDate()` — returns 0 for empty day; returns max+1 for day with gaps (e.g. sortOrders `0,2,5` → returns 6).
- **Unit:** `compactSortOrderForDate()` — tasks renumbered `0,1,2...` in their existing sortOrder order; tasks on other dates unchanged.
- **Unit:** `withTaskAdded()` — task added with a date gets `max+1` sortOrder; task without a date gets null.
- **Unit:** `withTaskUpdated()` — date change: sortOrder assigned on new date AND old date is compacted; date unchanged: sortOrder not touched.
- **Unit:** `withTaskDeleted()` — task's old date is compacted after removal.
- **Unit:** `withTasksReordered()` — writes sortOrder = 0,1,2... for every task in the input array; other tasks untouched.
- **Unit:** `sortTasksForColumn()` — numbered tasks sort by sortOrder ASC; null-sortOrder tasks append after, stable-sorted by createdAt.
- **Unit:** `reorderTasks()` in useProjects — persists and calls Supabase update for each reordered task.
- **Manual (UI):** add two tasks to Monday — second task appears below first.
- **Manual (UI):** delete the first task from Monday — remaining task has sortOrder 0 (no gap).
- **Manual (UI):** reschedule a task from Monday to Tuesday — it appears at the bottom of Tuesday; Monday's remaining tasks are renumbered from 0.
- **Manual (UI):** drag task in a column with 3+ tasks, close app, reopen — order preserved.
- **Manual (UI):** swipe horizontally on a task card — timeline scrolls, drag does not activate.
- **Manual (UI):** drag in overdue column — works same as date columns.
