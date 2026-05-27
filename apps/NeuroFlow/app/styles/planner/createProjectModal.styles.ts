import { StyleSheet } from 'react-native';

export const createProjectModalStyles = StyleSheet.create({
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
    colorPickerLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
        marginTop: 12,
        marginBottom: 8,
    },
    colorDotsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 4,
    },
    colorDot: {
        width: 28,
        height: 28,
        borderRadius: 999,
    },
    colorDotSelected: {
        borderWidth: 3,
        borderColor: '#111827',
    },
    reminderLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginTop: 16,
        marginBottom: 8,
    },
    modalReminderRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    reminderChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
    },
    reminderChipActive: {
        backgroundColor: '#eff6ff',
        borderColor: '#2563eb',
    },
    reminderChipText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
    },
    reminderChipTextActive: {
        color: '#2563eb',
        fontWeight: '600',
    },
    reminderChipDanger: {
        backgroundColor: '#fef2f2',
        borderColor: '#fca5a5',
    },
    reminderChipTextDanger: {
        color: '#dc2626',
        fontWeight: '500',
    },
    reminderDoneButton: {
        alignSelf: 'flex-end',
        marginTop: 8,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#2563eb',
    },
    reminderDoneText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#ffffff',
    },
    deleteProjectButton: {
        marginTop: 12,
        alignItems: 'center',
        paddingVertical: 8,
    },
    deleteProjectButtonText: {
        fontSize: 13,
        color: '#ef4444',
        fontWeight: '500',
    },
    deleteConfirmRow: {
        marginTop: 12,
        gap: 8,
    },
    deleteConfirmText: {
        fontSize: 13,
        color: '#374151',
        textAlign: 'center',
    },
    deleteConfirmButtons: {
        flexDirection: 'row',
        gap: 8,
    },
})
