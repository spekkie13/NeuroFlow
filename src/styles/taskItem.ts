import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    taskCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
        position: 'relative',
        overflow: 'visible',
    },
    taskCardCompleted: {
        backgroundColor: '#F9FAFB',
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    checkButton: {
        marginTop: 2,
    },
    taskContent: {
        flex: 1,
        minWidth: 0,
    },
    nameRow: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
        marginBottom: 2,
        flexWrap: 'wrap',
    },
    taskName: {
        fontSize: 14,
        color: '#1F2937',
        flexShrink: 1,
    },
    taskNameCompleted: {
        color: '#6B7280',
        textDecorationLine: 'line-through',
    },
    priorityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 9999,
        borderWidth: 1,
    },
    priorityText: {
        fontSize: 11,
        textTransform: 'capitalize',
        fontWeight: '500',
    },
    dateRow: {
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
        marginTop: 4,
    },
    dateText: {
        fontSize: 11,
        color: '#6B7280',
    },
    actions: {
        flexDirection: 'row',
        gap: 4,
        marginLeft: 4,
    },
    priorityWrapper: {
        position: 'relative',
    },
    editRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    editInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: '#FFFFFF',
    },
    iconButton: {
        padding: 6,
        borderRadius: 9999,
    },
    iconButtonSuccess: {
        padding: 6,
        borderRadius: 9999,
        backgroundColor: '#ECFDF3',
    },
});
