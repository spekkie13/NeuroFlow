import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    wrapper: {
        flexGrow: 0,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderLeftWidth: 4,
        borderLeftColor: 'transparent',
    },
    rowSelected: {
        backgroundColor: '#EFF6FF',
        borderLeftColor: '#3B82F6',
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 9999,
        marginRight: 12,
    },
    content: {
        flex: 1,
        minWidth: 0,
    },
    projectName: {
        fontSize: 14,
        color: '#1F2937',
    },
    projectNameSelected: {
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        gap: 6,
        marginLeft: 8,
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
    editRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        fontSize: 14,
        backgroundColor: '#FFFFFF',
    },
    empty: {
        paddingVertical: 24,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    emptyText: {
        color: '#6B7280',
        fontSize: 13,
    },
    emptySub: {
        color: '#9CA3AF',
        fontSize: 11,
        marginTop: 4,
    },
});
