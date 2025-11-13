import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
    priorityWrapper: {
        position: 'relative',
    },
    priorityMenu: {
        position: 'absolute',
        top: 36,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingVertical: 4,
        width: 150,
        zIndex: 1000,
        elevation: 12,
    },
    priorityMenuItem: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    priorityMenuText: {
        fontSize: 13,
        color: '#374151',
    },
});
