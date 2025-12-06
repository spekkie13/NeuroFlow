import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    header: {
        marginBottom: 8,
    },
    projectName: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    headerMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerMetaText: {
        fontSize: 12,
        color: '#6b7280',
    },
    headerMetaStrong: {
        fontWeight: '600',
        color: '#374151',
    },
    headerMetaDot: {
        marginHorizontal: 4,
        fontSize: 12,
        color: '#9ca3af',
    },
    headerMetaNumber: {
        fontWeight: '600',
        color: '#111827',
    },
    addRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    addButton: {
        marginLeft: 8,
        width: 44,
        paddingHorizontal: 0,
    },
    emptyState: {
        paddingVertical: 32,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#e5e7eb',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 4,
    },
    emptySubtitle: {
        fontSize: 13,
        color: '#9ca3af',
    },
    tasksContainer: {
        gap: 8,
        paddingBottom: 4,
    },
    taskCard: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#ffffff',
        padding: 8,
    },
    taskCardActive: {
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 1,
    },
    taskCardCompleted: {
        backgroundColor: '#f9fafb',
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    checkButton: {
        paddingTop: 2,
    },
    taskContent: {
        flex: 1,
        minWidth: 0,
    },
    taskTitleRow: {
        marginBottom: 2,
    },
    taskTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    taskTitleCompleted: {
        color: '#6b7280',
        textDecorationLine: 'line-through',
    },
    taskMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
        gap: 6,
        flexWrap: 'wrap',
    },
    taskDatesRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskDatesIcon: {
        marginRight: 4,
    },
    taskDatesText: {
        fontSize: 11,
        color: '#6b7280',
    },
    taskOverdueRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskOverdueText: {
        fontSize: 11,
        color: '#b91c1c',
        fontWeight: '500',
    },
    rescheduleRow: {
        marginTop: 4,
    },
    rescheduleLink: {
        fontSize: 12,
        color: '#2563eb',
        fontWeight: '500',
    },
    priorityBadge: {
        marginTop: 7,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderWidth: 1,
    },
    priorityBadgeText: {
        fontSize: 11,
        lineHeight: 13,
        fontWeight: '600',
        textTransform: 'capitalize',
        marginLeft: 4,
    },
    priorityHigh: {
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca',
    },
    priorityMedium: {
        backgroundColor: '#fefce8',
        borderColor: '#fef3c7',
    },
    priorityLow: {
        backgroundColor: '#ecfdf3',
        borderColor: '#bbf7d0',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        verticalAlign: 'middle',
        gap: 4,
        height: 28,
    },
    editRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    editInput: {
        flex: 1,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        paddingHorizontal: 8,
        paddingVertical: 6,
        fontSize: 13,
        color: '#111827',
        backgroundColor: '#ffffff',
    },
    reorderGroup: {
        flexDirection: 'column',
        gap: 2,
        marginHorizontal: 2,
    },
    // Modal shared overlay
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.35)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    // Priority modal
    priorityModalCard: {
        width: '100%',
        maxWidth: 320,
        borderRadius: 14,
        backgroundColor: '#ffffff',
        padding: 14,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    modalSubtitle: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 10,
    },
    modalOptions: {
        gap: 6,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 10,
        borderWidth: 1,
    },
    modalOptionHigh: {
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca',
    },
    modalOptionMedium: {
        backgroundColor: '#fffbeb',
        borderColor: '#fef3c7',
    },
    modalOptionLow: {
        backgroundColor: '#ecfdf3',
        borderColor: '#bbf7d0',
    },
    modalOptionLabel: {
        marginLeft: 8,
        fontSize: 13,
        fontWeight: '500',
        color: '#111827',
    },
    // Reschedule modal
    rescheduleModalCard: {
        width: '100%',
        maxWidth: 380,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        padding: 16,
    },
    modalHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    modalCloseButton: {
        padding: 4,
        borderRadius: 999,
    },
    datesRow: {
        flexDirection: 'row',
        marginTop: 12,
        marginBottom: 12,
    },
    fieldLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    modalFooterRow: {
        flexDirection: 'row',
        gap: 8,
    },
    metaText: {
        fontSize: 12,
        color: '#6b7280',
    },
    metaDot: {
        marginHorizontal: 6,
        fontSize: 12,
        color: '#d1d5db',
    },
    emptyBox: {
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#e5e7eb',
        paddingVertical: 24,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    list: {
        gap: 8,
    },
    card: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        padding: 10,
        backgroundColor: '#ffffff',
        marginBottom: 8,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        marginRight: 8,
        paddingTop: 2,
    },
    cardContent: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    taskName: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    taskNameCompleted: {
        color: '#6b7280',
        textDecorationLine: 'line-through',
    },
    priorityText: {
        fontSize: 11,
        fontWeight: '600',
        marginLeft: 4,
        textTransform: 'capitalize',
        color: '#111827',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    dateText: {
        fontSize: 12,
        color: '#6b7280',
    },
    dateTextOverdue: {
        color: '#b91c1c',
        fontWeight: '500',
    },
})
