import { StyleSheet } from 'react-native'

export const routineModalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        justifyContent: 'flex-end',
    },
    card: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '90%',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    closeButton: {
        padding: 4,
        borderRadius: 999,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 16,
        marginBottom: 8,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
    },
    chipActive: {
        backgroundColor: '#eff6ff',
        borderColor: '#2563eb',
    },
    chipText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
    },
    chipTextActive: {
        color: '#2563eb',
        fontWeight: '600',
    },
    dayRow: {
        flexDirection: 'row',
        gap: 6,
    },
    dayChip: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayChipActive: {
        backgroundColor: '#eff6ff',
        borderColor: '#2563eb',
    },
    dayChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
    },
    dayChipTextActive: {
        color: '#2563eb',
    },
    monthDayGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    monthDayChip: {
        width: 36,
        height: 36,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
        alignItems: 'center',
        justifyContent: 'center',
    },
    monthDayText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    stepInput: {
        flex: 1,
        fontSize: 13,
        color: '#111827',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 7,
        backgroundColor: '#f9fafb',
    },
    addStepButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 6,
    },
    addStepText: {
        fontSize: 13,
        color: '#6b7280',
    },
})
