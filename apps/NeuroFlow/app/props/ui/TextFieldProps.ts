import {TextInputProps, TextStyle, ViewStyle} from "react-native";
import React from "react";

export interface TextFieldProps extends TextInputProps {
    label?: string
    errorText?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    containerStyle?: ViewStyle
    inputStyle?: TextStyle
}
