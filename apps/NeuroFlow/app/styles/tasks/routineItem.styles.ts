import {StyleSheet} from "react-native";

export const routineItemStyles = StyleSheet.create({
    container: {
        backgroundColor: '#f9fafb',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginBottom: 6,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    icon: {
        marginRight: 10,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    nameInactive: {
        color: '#9ca3af',
    },
    label: {
        fontSize: 11,
        color: '#6b7280',
        marginTop: 1,
    },
    switch: {
        marginLeft: 8,
        transform: [{scaleX: 0.8}, {scaleY: 0.8}],
    },
    menuButton: {
        marginLeft: 8,
        padding: 2,
    },
    menu: {
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        backgroundColor: '#ffffff',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        gap: 8,
    },
    menuItemText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
    },
    menuItemDanger: {
        color: '#ef4444',
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#f3f4f6',
        marginHorizontal: 14,
    },
})
