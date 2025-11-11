import {Text, View, StyleSheet} from "react-native";
import React from "react";

export function ToastOverlay({ visible }: { visible: boolean }) {
    if (!visible) return null;
    return (
        <View style={styles.toast}>
            <Text style={styles.toastText}>🎉 Nice, weer iets uit je hoofd</Text>
        </View>
    );
}

const styles = StyleSheet.create({
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
