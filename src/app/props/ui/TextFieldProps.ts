import {StyleProp, TextInputProps, TextStyle, ViewStyle} from "react-native";

export interface TextFieldProps extends TextInputProps {
    label?: string
    helperText?: string
    error?: string
    containerStyle?: StyleProp<ViewStyle>
    inputStyle?: StyleProp<TextStyle>
}
