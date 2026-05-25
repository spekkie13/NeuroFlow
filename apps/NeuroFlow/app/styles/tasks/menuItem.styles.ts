import { StyleSheet } from 'react-native';

export const menuItemStyles = StyleSheet.create({
    inlineMenuOverlay: {
        position: 'absolute',
        right: 0,
        top: '100%',
        marginTop: 6,
        zIndex: 10000,     // ✅ hoger dan de task zelf
        elevation: 10000,  // ✅ Android
    },
    inlineMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
        width: '100%',
    },
    inlineMenuItemDanger: {
        backgroundColor: '#fef2f2',
    },
    inlineMenuItemDisabled: {
        opacity: 0.5,
    },
    inlineMenuIcon: {
        width: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    inlineMenuLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#111827',
    },
    inlineMenuLabelDanger: {
        color: '#b91c1c',
    },
    inlineMenuLabelDisabled: {
        color: '#6b7280',
    },
})
