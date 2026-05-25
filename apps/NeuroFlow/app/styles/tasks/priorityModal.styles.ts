import { StyleSheet } from 'react-native';

export const priorityModalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    cardSmall: {
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
    priorityOptions: {
        marginTop: 8,
        gap: 8,
    },
    priorityOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
    },
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
    priorityLabel: {
        marginLeft: 8,
        fontSize: 13,
        fontWeight: '500',
        color: '#111827',
    },
})
