import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: 64,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 6,
        elevation: 8,
    },
    navItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 11,
        marginTop: 2,
    },
    labelActive: {
        color: '#2563eb',
        fontWeight: '600',
    },
    labelInactive: {
        color: '#6b7280',
    },
})
