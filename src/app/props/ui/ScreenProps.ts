import React from "react";
import {StyleProp, ViewStyle} from "react-native";

export interface ScreenProps {
    children: React.ReactNode
    scroll?: boolean
    contentContainerStyle?: StyleProp<ViewStyle>
    style?: StyleProp<ViewStyle>
    paddingHorizontal?: number
    paddingVertical?: number
}
