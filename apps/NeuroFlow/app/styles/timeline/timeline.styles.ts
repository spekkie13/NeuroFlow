import {StyleSheet} from "react-native";

export const timelineStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: '#fffbeb',
        borderWidth: 1,
        borderColor: '#fed7aa',
    },
    badgeText: {
        marginLeft: 6,
        fontSize: 11,
        fontWeight: '500',
        color: '#92400e',
    },
    columnsScroll: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    column: {
        width: 160,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginRight: 8,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
    },
    columnToday: {
        borderColor: '#2563eb',
        backgroundColor: '#f0f7ff',
    },
    columnOverdue: {
        borderColor: '#fca5a5',
        backgroundColor: '#fff7f7',
    },
    columnOverdueHeader: {
        backgroundColor: '#fef2f2',
        borderBottomColor: '#fca5a5',
    },
    columnOverdueLabel: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        fontWeight: '600',
        color: '#dc2626',
    },
    columnOverdueCount: {
        fontSize: 12,
        fontWeight: '500',
        color: '#ef4444',
        marginTop: 2,
    },
    columnHeader: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#f9fafb',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    columnWeekday: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        color: '#6b7280',
    },
    columnDate: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginTop: 2,
    },
    todayBadge: {
        marginTop: 4,
        fontSize: 11,
        fontWeight: '500',
        color: '#2563eb',
    },
    columnBody: {
        paddingHorizontal: 8,
        paddingVertical: 8,
        minHeight: 140,
    },
    taskCard: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#d1d5db',
        marginBottom: 6,
        backgroundColor: '#ffffff',
        paddingVertical: 6,
        paddingHorizontal: 6,
    },
    taskCardCompleted: {
        backgroundColor: '#f9fafb',
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    checkButton: {
        marginRight: 6,
        paddingTop: 2,
    },
    taskContent: {
        flex: 1,
    },
    taskName: {
        fontSize: 12,
        fontWeight: '500',
        color: '#111827',
    },
    taskNameCompleted: {
        color: '#6b7280',
        textDecorationLine: 'line-through',
    },
    taskDates: {
        fontSize: 11,
        color: '#6b7280',
        marginTop: 2,
    },
    taskDatesOverdue: {
        color: '#b91c1c',
        fontWeight: '500',
    },
    addTaskButton: {
        marginTop: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#d1d5db',
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    addTaskText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6b7280',
    },
    datesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    dateFieldWrapper: {
        width: '48%',
    },
    columnHeaderTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    todayBadgeInline: {
        fontSize: 11,
        fontWeight: '600',
        color: '#2563eb',
    },
    todayBadgeHidden: {
        opacity: 0,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    todayJumpButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#2563eb',
    },
    todayJumpButtonText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#2563eb',
    },
    columnStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 6,
    },
    progressTrack: {
        flex: 1,
        height: 3,
        borderRadius: 999,
        backgroundColor: '#e5e7eb',
        overflow: 'hidden',
    },
    progressFill: {
        height: 3,
        borderRadius: 999,
    },
    progressText: {
        fontSize: 10,
        fontWeight: '500',
        color: '#6b7280',
    },
    timeEstimateText: {
        fontSize: 10,
        fontWeight: '500',
        marginTop: 4,
    },
    emptyColumn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    emptyColumnText: {
        fontSize: 11,
        color: '#d1d5db',
    },
    priorityBadge: {
        alignSelf: 'flex-start',
        marginTop: 4,
        borderRadius: 999,
        borderWidth: 1,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    priorityBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    priorityBadgeHigh: {
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca',
    },
    priorityBadgeMedium: {
        backgroundColor: '#fffbeb',
        borderColor: '#fef3c7',
    },
    priorityBadgeLow: {
        backgroundColor: '#ecfdf3',
        borderColor: '#bbf7d0',
    },
    priorityBadgeSmall: {
        borderRadius: 999,
        borderWidth: 1,
        paddingHorizontal: 6,
        paddingVertical: 1,
    },
})
