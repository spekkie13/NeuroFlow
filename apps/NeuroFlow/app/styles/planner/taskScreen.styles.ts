import { StyleSheet } from 'react-native';

export const taskScreenStyles = StyleSheet.create({
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
    projectDropdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    projectEditButton: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#ffffff',
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
})
