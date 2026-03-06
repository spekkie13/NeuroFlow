import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    container: {
        flex: 1,
        paddingBottom: 72,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
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
        textAlign: 'center',
    },
    // Tasks header
    tasksHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    tasksHeaderTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    tasksHeaderSubtitle: {
        marginTop: 2,
        fontSize: 12,
        color: '#6b7280',
    },
    // Project dropdown
    projectDropdownWrapper: {
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    dropdownLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 4,
    },
    dropdownButton: {
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#d1d5db',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
    },
    dropdownText: {
        fontSize: 14,
        color: '#111827',
        marginLeft: 8,
        flexShrink: 1,
    },
    projectDot: {
        width: 8,
        height: 8,
        borderRadius: 999,
    },
    tasksScroll: {
        flex: 1,
    },
    tasksContent: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 24,
    },
    timelineScroll: {
        flex: 1,
    },
    timelineContent: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 24,
    },
    projectSection: {
        marginBottom: 32,
    },
    timelineHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 4,
    },
    timelineHeaderTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    timelineHeaderSubtitle: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    projectHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    projectHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
    },
    projectHeaderActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
    },
    projectColorDot: {
        width: 16,
        height: 16,
        borderRadius: 999,
        marginRight: 12,
    },
    projectTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1f2937',
    },
    projectUnscheduledBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: '#fffbeb',
        borderWidth: 1,
        borderColor: '#fed7aa',
        gap: 4,
    },
    projectUnscheduledText: {
        fontSize: 11,
        fontWeight: '500',
        color: '#92400e',
    },
    projectTodayButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#2563eb',
    },
    projectTodayButtonText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#2563eb',
    },
    // Modal base
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.35)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    modalCard: {
        width: '100%',
        maxWidth: 360,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        padding: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 13,
        color: '#6b7280',
        marginBottom: 12,
    },
    modalButtonsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 8,
    },
    // Project picker modal
    pickerCard: {
        width: '100%',
        maxWidth: 340,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        padding: 14,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    pickerTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    pickerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 8,
        marginBottom: 4,
    },
    pickerItemActive: {
        backgroundColor: '#eff6ff',
    },
    pickerItemText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#111827',
        flexShrink: 1,
    },
    pickerItemTextActive: {
        fontWeight: '600',
        color: '#1d4ed8',
    },
})
