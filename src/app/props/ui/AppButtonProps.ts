import React from "react";
import {GestureResponderEvent, StyleProp, TextStyle, ViewStyle} from "react-native";
import {AppButtonSize, AppButtonVariant} from "@/app/constants/uiConstants";

export interface AppButtonProps {
    title: string
    onPress: (event: GestureResponderEvent) => void
    variant?: AppButtonVariant
    size?: AppButtonSize
    disabled?: boolean
    loading?: boolean
    fullWidth?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    accessibilityLabel?: string
}
