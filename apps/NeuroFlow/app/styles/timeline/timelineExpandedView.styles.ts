import { StyleSheet } from 'react-native'

export const expandedStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    loadingText: {
        fontSize: 14,
        color: '#6b7280',
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
        flexShrink: 0,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flex: 1,
        flexWrap: 'wrap',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    sectionTitleOverdue: {
        color: '#b91c1c',
    },
    workspaceBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: '#f3f4f6',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    workspaceBadgeText: {
        fontSize: 10,
        fontWeight: '500',
        color: '#6b7280',
    },
    sectionCount: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6b7280',
        marginLeft: 8,
        flexShrink: 0,
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
