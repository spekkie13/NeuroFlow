import React from "react";
import { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";
import { IconButtonVariant } from "@/app/constants/uiConstants";

export interface IconButtonProps {
    icon: React.ReactNode
    onPress?: (event: GestureResponderEvent) => void
    variant?: IconButtonVariant
    disabled?: boolean
    style?: StyleProp<ViewStyle>
    accessibilityLabel?: string
}
