import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    taskCard: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        marginBottom: 6,
        padding: 6,
        borderLeftWidth: 4,
    },
    taskCardActive: {
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 1,
    },
    taskCardCompleted: {
        backgroundColor: '#f9fafb',
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    taskCheckButton: {
        paddingTop: 2,
        marginRight: 6,
    },
    taskMain: {
        flex: 1,
        minWidth: 0,
    },
    taskTitle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#111827',
    },
    taskTitleCompleted: {
        color: '#6b7280',
        textDecorationLine: 'line-through',
    },
    taskMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
        gap: 6,
    },
    priorityBadge: {
        borderRadius: 999,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderWidth: 1,
    },
    priorityBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    taskDateText: {
        fontSize: 11,
        color: '#6b7280',
    },
    taskReorder: {
        justifyContent: 'center',
        marginLeft: 4,
        gap: 2,
    },
})
