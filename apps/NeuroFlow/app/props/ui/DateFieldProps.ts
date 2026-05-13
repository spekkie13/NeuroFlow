import { ViewStyle } from 'react-native'

export interface DateFieldProps {
    value: string
    onChangeText: (value: string) => void
    onChangeDate?: (date: Date | null) => void
    placeholder?: string
    style?: ViewStyle
}