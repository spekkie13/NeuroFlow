import { StyleSheet } from 'react-native';

export const estimateModalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    card: {
        width: '100%',
        maxWidth: 360,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    subtitle: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 12,
    },
    closeButton: {
        padding: 4,
        borderRadius: 999,
    },
    presetGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    presetChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
    },
    presetChipActive: {
        backgroundColor: '#eff6ff',
        borderColor: '#2563eb',
    },
    presetLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
    },
    presetLabelActive: {
        color: '#2563eb',
        fontWeight: '600',
    },
})
