import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 2,
    },
    summaryBadge: {
        alignItems: 'flex-end',
        gap: 2,
    },
    summaryText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6b7280',
    },
    summaryOverdue: {
        color: '#ef4444',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 32,
        gap: 8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
    },
    section: {
        borderRadius: 12,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        overflow: 'hidden',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    sectionHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    sectionColorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    sectionTitleOverdue: {
        color: '#b91c1c',
    },
    sectionCount: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6b7280',
        marginLeft: 8,
    },
    sectionBody: {
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        paddingVertical: 4,
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        gap: 10,
    },
    taskCheckbox: {
        flexShrink: 0,
    },
    taskContent: {
        flex: 1,
    },
    taskName: {
        fontSize: 14,
        color: '#111827',
        lineHeight: 20,
    },
    taskNameDone: {
        color: '#9ca3af',
        textDecorationLine: 'line-through',
    },
    projectDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        flexShrink: 0,
    },
    priorityBadge: {
        flexShrink: 0,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
    },
    priorityText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#111827',
    },
    priorityHigh: {
        borderColor: '#fca5a5',
        backgroundColor: '#fef2f2',
    },
    priorityMedium: {
        borderColor: '#fcd34d',
        backgroundColor: '#fffbeb',
    },
    priorityLow: {
        borderColor: '#d1d5db',
        backgroundColor: '#f9fafb',
    },
})