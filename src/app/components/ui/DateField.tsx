import React, {useMemo, useState} from 'react'
import { Platform, TouchableOpacity, View, ViewStyle } from 'react-native'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { Calendar } from 'lucide-react-native'
import { TextField } from './TextField'
import { formatLocalDate, parseLocalDate } from '../../utils/dateUtils'

interface DateFieldProps {
    value: string
    onChangeText: (value: string) => void
    onChangeDate?: (date: Date | null) => void
    placeholder?: string
    style?: ViewStyle
}

export const DateField: React.FC<DateFieldProps> = ({
                                                        value,
                                                        onChangeText,
                                                        onChangeDate,
                                                        placeholder,
                                                        style,
                                                    }) => {
    const [showPicker, setShowPicker] = useState(false)

    const currentDate = useMemo(
        () => parseLocalDate(value) ?? new Date(),
        [value],
    )

    const openPicker = () => {
        setShowPicker(true)
    }

    const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
        if (event.type === 'dismissed') {
            setShowPicker(false)
            return
        }
        const picked = date ?? currentDate
        const formatted = formatLocalDate(picked)
        onChangeText(formatted)
        onChangeDate?.(picked)
        if (Platform.OS !== 'ios') {
            setShowPicker(false)
        }
    }

    return (
        <View style={style}>
            <TextField
                value={value}
                onChangeText={(text) => {
                    onChangeText(text)
                    const parsed = parseLocalDate(text)
                    onChangeDate?.(parsed)
                }}
                placeholder={placeholder}
                onFocus={openPicker}
                leftIcon={
                    <TouchableOpacity
                        onPress={openPicker}
                        activeOpacity={0.7}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                        <Calendar size={18} color="#9ca3af" />
                    </TouchableOpacity>
                }
            />

            {showPicker && (
                <DateTimePicker
                    value={currentDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={handleDateChange}
                />
            )}
        </View>
    )
}
