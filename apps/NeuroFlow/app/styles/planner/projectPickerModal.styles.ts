import { StyleSheet } from 'react-native';

export const projectPickerModalStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.35)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
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
    pickerItemMeta: {
        marginLeft: 8,
        fontSize: 11,
        color: '#9ca3af',
        marginTop: 1,
    },
    projectDot: {
        width: 8,
        height: 8,
        borderRadius: 999,
    },
})
