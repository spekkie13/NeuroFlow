# Timeline Task Drag-and-Drop Reorder — TODO

## Steps

- [ ] **1. Add `sortOrder` to Task model**
  File: `app/models/Task.ts`
  Add `sortOrder: number | null` field.
  Verify: TypeScript build passes — `npx tsc --noEmit`

- [ ] **2. Add Supabase migration**
  Add `sort_order integer DEFAULT NULL` column to `tasks` table.
  Update Supabase types if auto-generated (or patch manually).
  Verify: Supabase Studio shows column; existing rows have `sort_order = null`.

- [ ] **3. Add `nextSortOrderForDate()` to ProjectService**
  File: `app/services/domain/ProjectService.ts`
  `nextSortOrderForDate(project, date): number` — finds all tasks on that date with a non-null sortOrder, returns `max(sortOrder) + 1`, or `0` if none exist.
  Verify: Unit tests — empty day → 0; day with sortOrders `[0,1,2]` → 3; day with gaps `[0,2,5]` → 6.

- [ ] **4. Add `compactSortOrderForDate()` to ProjectService**
  File: `app/services/domain/ProjectService.ts`
  `compactSortOrderForDate(project, date): Project` — takes all tasks on `date`, sorts them by their current sortOrder (nulls last, then by createdAt), assigns `sortOrder = 0,1,2...`, returns updated project. Also returns the affected tasks for Supabase batch update.
  Verify: Unit tests — day with sortOrders `[0,2,5]` → compacted to `[0,1,2]`; tasks on other dates unchanged; null-sortOrder tasks get assigned at the end.

- [ ] **5. Update `withTaskAdded()` to assign `sortOrder`**
  File: `app/services/domain/ProjectService.ts`
  Before appending the task, if `task.date` is set assign `task.sortOrder = nextSortOrderForDate(project, task.date)`. If no date, leave `sortOrder` null.
  Verify: Unit test — add task to day with gaps → gets max+1; add task without date → sortOrder null.

- [ ] **6. Update `withTaskUpdated()` to reassign `sortOrder` on date change and compact old date**
  File: `app/services/domain/ProjectService.ts`
  If `updates.date` is provided and differs from the current task's date:
  1. Set `updates.sortOrder = nextSortOrderForDate(project, updates.date)`.
  2. Call `compactSortOrderForDate(project, oldDate)` and merge those changes into the returned project.
  If date is unchanged, do not touch sortOrder.
  Verify: Unit test — reschedule Monday→Tuesday: task gets max+1 on Tuesday; Monday remaining tasks compacted to 0,1,2...; priority-only update leaves sortOrder untouched.

- [ ] **7. Update `withTaskDeleted()` to compact the old date**
  File: `app/services/domain/ProjectService.ts`
  After removing the task, if it had a date call `compactSortOrderForDate(project, deletedTask.date)` and merge changes. Persist affected tasks to Supabase.
  Verify: Unit test — delete middle task from a 3-task day → remaining two compacted to `[0,1]`; tasks on other dates unchanged.

- [ ] **8. Implement `withTasksReordered()` in ProjectService**
  File: `app/services/domain/ProjectService.ts`
  Takes `(project, reorderedTasks: Task[])` — writes `sortOrder = arrayIndex` (0,1,2...) for every task in `reorderedTasks`. This both persists the new order and compacts any gaps as a side effect.
  Verify: Unit test — 5-task project, drag-reorder 3 of them: those 3 get sortOrder 0,1,2; the other 2 are unchanged.

- [ ] **9. Add column sort helper**
  File: `app/utils/taskSortUtils.ts` (new or extend existing)
  `sortTasksForColumn(tasks: Task[]): Task[]` — sort by `sortOrder ASC`; null-sortOrder tasks append after numbered ones, stable-sorted among themselves by `createdAt`.
  Verify: Unit tests — all numbered, mixed null/numbered, all null.

- [ ] **10. Add `reorderTasks()` to useProjects hook**
  File: `app/hooks/useProjects.ts`
  Calls `withTasksReordered`, persists to AsyncStorage, patches each reordered task in Supabase (`update tasks set sort_order = $1 where id = $2`).
  Verify: Unit test — mock storage + Supabase, confirm both called with correct args.

- [ ] **11. Add `onReorderTasks` prop to TimelineProps**
  File: `app/props/timeline/TimelineProps.ts`
  Add `onReorderTasks: (projectId: string, reorderedTasks: Task[]) => void`.
  Verify: `npx tsc --noEmit`

- [ ] **12. Wire `onReorderTasks` through TimelineScreen → Timeline**
  File: `app/components/planner/TimelineScreen.tsx`
  Pass down from `useProjects.reorderTasks`.
  Verify: `npx tsc --noEmit`

- [ ] **13. Replace task `.map()` in date columns with `DraggableFlatList`**
  File: `app/components/timeline/Timeline.tsx`
  Import `DraggableFlatList` from `react-native-draggable-flatlist`.
  For each of the 14 date columns: replace the `tasks.filter(...).map(...)` with a `DraggableFlatList`. Set `activeOffsetY={[-5, 5]}` and `failOffsetX={[-5, 5]}` on `dragItemOverflow`. Call `sortTasksForColumn()` on the filtered task list before passing to `data`.
  On `onDragEnd({ data })` call `onReorderTasks(project.id, data)`.
  Verify: `npx tsc --noEmit`; manually confirm horizontal scroll still works.

- [ ] **14. Apply same change to overdue column**
  File: `app/components/timeline/Timeline.tsx`
  Same as step 13 for the overdue task list.
  Verify: Overdue column renders; drag works.

- [ ] **15. Manual smoke test**
  - Add two tasks to the same day → second task appears below first
  - Delete the first task → remaining task has sortOrder 0 (no gap)
  - Reschedule a task from Monday to Tuesday → it appears at the bottom of Tuesday; Monday's tasks renumbered from 0
  - Long-press a task and drag to a new position → order changes visually
  - Kill and reopen app → dragged order preserved
  - Swipe horizontally on a task card → timeline scrolls, drag does not fire
  Verify: All 6 manual checks pass.
