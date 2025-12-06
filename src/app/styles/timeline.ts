import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    priorityHigh: {
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca',
    },
    priorityMedium: {
        backgroundColor: '#fffbeb',
        borderColor: '#fef3c7',
    },
    priorityLow: {
        backgroundColor: '#ecfdf3',
        borderColor: '#bbf7d0',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    unscheduledBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: '#fffbeb',
        borderWidth: 1,
        borderColor: '#fef3c7',
    },
    unscheduledText: {
        marginLeft: 6,
        fontSize: 12,
        fontWeight: '500',
        color: '#b45309',
    },
    timelineScroll: {
        marginHorizontal: -24,
    },
    timelineContent: {
        paddingHorizontal: 24,
        paddingBottom: 8,
    },
    dayColumn: {
        width: 180,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#ffffff',
        marginRight: 10,
        overflow: 'hidden',
    },
    dayHeader: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
    },
    dayHeaderWeekday: {
        fontSize: 11,
        fontWeight: '600',
        color: '#6b7280',
        textTransform: 'uppercase',
    },
    dayHeaderDate: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginTop: 2,
    },
    dayTasks: {
        padding: 8,
        minHeight: 200,
    },
    addTaskForDayButton: {
        marginTop: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#d1d5db',
        paddingVertical: 6,
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addTaskForDayText: {
        marginLeft: 4,
        fontSize: 11,
        fontWeight: '500',
        color: '#6b7280',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.35)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    modalCard: {
        width: '100%',
        maxWidth: 380,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    modalCloseButton: {
        padding: 4,
        borderRadius: 999,
    },
    modalTabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalTab: {
        flex: 1,
        paddingVertical: 8,
    },
    modalTabActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#2563eb',
        backgroundColor: '#eff6ff',
    },
    modalTabInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    modalTabLabel: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
    },
    modalTabLabelActive: {
        color: '#2563eb',
    },
    modalBody: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    fieldLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    priorityRow: {
        marginTop: 10,
    },
    priorityLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 6,
    },
    priorityButtonsRow: {
        flexDirection: 'row',
        gap: 6,
    },
    prioritySelectButton: {
        flex: 1,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#d1d5db',
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    prioritySelectTextLowActive: {
        color: '#15803d',
    },
    prioritySelectButtonLowActive: {
        backgroundColor: '#ecfdf3',
        borderColor: '#22c55e',
    },
    prioritySelectText: {
        fontSize: 12,
        color: '#4b5563',
        fontWeight: '500',
    },
    prioritySelectButtonMediumActive: {
        backgroundColor: '#fffbeb',
        borderColor: '#eab308',
    },
    prioritySelectTextMediumActive: {
        color: '#b45309',
    },
    prioritySelectButtonHighActive: {
        backgroundColor: '#fef2f2',
        borderColor: '#ef4444',
    },
    prioritySelectTextHighActive: {
        color: '#b91c1c',
    },
    datesRow: {
        flexDirection: 'row',
        marginTop: 8,
    },
    emptyUnscheduled: {
        alignItems: 'center',
        paddingVertical: 16,
        gap: 4,
    },
    emptyUnscheduledTitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#4b5563',
    },
    emptyUnscheduledSubtitle: {
        fontSize: 11,
        color: '#9ca3af',
    },
    existingListWrapper: {
        marginBottom: 10,
    },
    existingLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    existingList: {
        maxHeight: 160,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    existingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    existingItemActive: {
        backgroundColor: '#eff6ff',
    },
    existingItemTextWrapper: {
        flex: 1,
        minWidth: 0,
        marginRight: 8,
    },
    existingItemTitle: {
        fontSize: 13,
        color: '#111827',
    },
    priorityBadge: {
        borderRadius: 999,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderWidth: 1,
    },
    priorityBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    modalFooter: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
})
