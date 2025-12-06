import React from "react";
import {StyleProp, ViewStyle} from "react-native";

export interface CardProps {
    children: React.ReactNode
    style?: StyleProp<ViewStyle>
    title?: string
    subtitle?: string
    headerRight?: React.ReactNode
}
