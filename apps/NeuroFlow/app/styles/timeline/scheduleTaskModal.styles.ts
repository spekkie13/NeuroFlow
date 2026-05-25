import { StyleSheet } from 'react-native';

export const scheduleTaskModalStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    modalCard: {
        width: '100%',
        maxWidth: 420,
        borderRadius: 18,
        backgroundColor: '#ffffff',
        padding: 14,
    },
    modalHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    modalSubtitle: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    modalCloseButton: {
        padding: 4,
        borderRadius: 999,
    },
    modalTabsRow: {
        flexDirection: 'row',
        borderRadius: 999,
        backgroundColor: '#f3f4f6',
        padding: 2,
        marginTop: 8,
        marginBottom: 10,
    },
    modalTab: {
        flex: 1,
        borderRadius: 999,
        paddingVertical: 6,
    },
    modalTabActive: {
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    modalTabInner: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    modalTabText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6b7280',
    },
    modalTabTextActive: {
        color: '#2563eb',
    },
    modalBody: {
        maxHeight: 320,
    },
    fieldGroup: {
        marginBottom: 10,
    },
    fieldLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    priorityRow: {
        flexDirection: 'row',
        gap: 6,
    },
    priorityOption: {
        flex: 1,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#d1d5db',
        paddingVertical: 6,
        alignItems: 'center',
    },
    priorityOptionActive: {
        backgroundColor: '#e0f2fe',
        borderColor: '#38bdf8',
    },
    priorityOptionText: {
        fontSize: 12,
        color: '#4b5563',
        textTransform: 'capitalize',
    },
    priorityOptionTextActive: {
        color: '#0f172a',
        fontWeight: '600',
    },
    emptyExistingBox: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 8,
    },
    emptyExistingTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4b5563',
        marginTop: 8,
        marginBottom: 2,
    },
    emptyExistingSubtitle: {
        fontSize: 12,
        color: '#9ca3af',
        textAlign: 'center',
    },
    existingList: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        maxHeight: 180,
        padding: 4,
    },
    existingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 8,
        marginBottom: 4,
    },
    existingItemActive: {
        backgroundColor: '#eff6ff',
    },
    existingItemName: {
        flex: 1,
        fontSize: 13,
        color: '#111827',
        marginRight: 8,
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
    modalFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 10,
    },
})
