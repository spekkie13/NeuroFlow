# Decision: Timeline Task Drag-and-Drop Reorder

## Chosen Approach
`react-native-draggable-flatlist` + `sortOrder` field on Task model.

## Rejected Options

### Option B: splice array index (no model change)
Rejected because `project.tasks` holds tasks from all dates in one array. Isolating and splicing only the tasks belonging to one date column without disturbing relative positions of tasks from other dates is fragile and hard to test. A `sortOrder` field is the correct abstraction.

### Option C: Manual Reanimated 3 implementation
Rejected as premature. `react-native-draggable-flatlist` already handles placeholder animation, scroll-while-dragging, and haptic feedback. Building this from scratch adds 3–5x the effort with no meaningful benefit at this stage.

## Key Assumptions
- Drag reorder is **within a single date column only** (same date). Cross-column drag = rescheduling, already handled via the reschedule modal.
- Overdue column tasks are also draggable within that column.
- `sortOrder` is an integer. **Every task that has a date always has a sortOrder** — it is assigned at the moment the task is given a date (creation or reschedule). Null only means the task has no date at all (unscheduled backlog).
- `nextSortOrderForDate` uses `max(sortOrder on that date) + 1`, not `count`. Using count would collide after gaps caused by deletions or reschedules (e.g. day has sortOrders `[0,2]`, count=2 collides with existing 2; max+1=3 is safe).
- **Compaction on departure**: whenever a task leaves a day (deleted or rescheduled away), the remaining tasks on that day are renumbered `0,1,2...` via `compactSortOrderForDate`. This keeps sortOrder values as a consecutive list on every day, which is what the user wants.
- **Drag reorder** writes `sortOrder = arrayIndex` (0,1,2...) for the whole column, so it also compacts as a side effect.
- When a task is rescheduled to a new date, its `sortOrder` is reassigned to `nextSortOrderForDate(newDate)` so it always arrives at the bottom of the destination day.
- `sortTasksForColumn` always sorts by `sortOrder ASC`. The old priority-sort fallback is removed for dated tasks. Legacy tasks with null sortOrder (existing data before this feature) are appended at the end sorted by `createdAt`.
- `react-native-draggable-flatlist` and `react-native-gesture-handler` + `GestureHandlerRootView` are already installed at the correct versions.

## Risks
- **Nested gesture conflict**: horizontal `ScrollView` in `Timeline.tsx` vs. vertical drag in `DraggableFlatList`. Fix: set `activeOffsetY={[-5, 5]}` and `failOffsetX={[-5, 5]}` on the drag gesture config so horizontal swipes pass through to the parent scroll view.
- **Supabase schema**: requires `sort_order integer` column on `tasks` table (nullable). Default null = unordered (falls back to priority).
- **Sync race**: if two clients reorder the same column simultaneously, last-write-wins on sortOrder. Acceptable for v1.
