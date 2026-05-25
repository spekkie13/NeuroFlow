import { StyleSheet } from 'react-native'

export const rescheduleModalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    card: {
        width: '100%',
        maxWidth: 400,
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
    fieldGroup: {
        marginTop: 8,
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center', // 🔥 centreert de groep
        gap: 8,
        marginTop: 12,
    },
})
