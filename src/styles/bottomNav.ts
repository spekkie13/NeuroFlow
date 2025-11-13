import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    navContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 50,
    },
    navInner: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 64,
        paddingHorizontal: 16,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navLabel: {
        fontSize: 11,
        marginTop: 4,
        color: '#6B7280',
        fontWeight: '500',
    },
    navLabelActive: {
        color: '#2563EB',
        fontWeight: '600',
    },
});
