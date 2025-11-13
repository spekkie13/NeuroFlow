import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        top: 16,
        alignSelf: 'center',
        backgroundColor: '#2563EB',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 9999,
        zIndex: 2000,
    },
    toastText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
})
