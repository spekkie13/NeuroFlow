import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        gap: 12,
    },
    header: {
        marginBottom: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    subtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-start',
    },
    cardTitle: {
        fontWeight: '600',
        color: '#111827',
    },
    cardText: {
        fontSize: 13,
        color: '#4B5563',
        marginTop: 2,
    },
    sectionLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    userEmail: {
        fontSize: 13,
        color: '#4B5563',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 4,
    },
    actionBtn: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
    },
    actionText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#1F2937',
    },
    logoutBtn: {
        backgroundColor: '#FEE2E2',
    },
    footer: {
        marginTop: 'auto',
        textAlign: 'center',
        fontSize: 12,
        color: '#9CA3AF',
    },
});
