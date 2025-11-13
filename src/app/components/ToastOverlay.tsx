import React from "react";
import { Text, View } from "react-native";
import { ToastOverlayProps } from "@/props/ToastOverlayProps";
import { styles } from "@/styles/toastOverlay";

export function ToastOverlay({ visible }: ToastOverlayProps) {
    if (!visible) return null;
    return (
        <View style={styles.toast}>
            <Text style={styles.toastText}>🎉 Nice, weer iets uit je hoofd</Text>
        </View>
    );
}
