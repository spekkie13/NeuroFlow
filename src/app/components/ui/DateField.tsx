// components/ui/DateField.tsx
import React, { useState } from 'react'
import { Platform, TouchableOpacity, View } from 'react-native'
import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { Calendar } from 'lucide-react-native'
import { TextField } from './TextField'
import { formatLocalDate, parseLocalDate } from '../../utils/dateUtils'

interface DateFieldProps {
    value: string
    onChangeText: (value: string) => void
    onChangeDate?: (date: Date | null) => void
    placeholder?: string
}

/**
 * Combineert een tekstveld + native date picker:
 * - Gebruiker kan direct typen
 * - Of via een tap de system datepicker openen
 */
export const DateField: React.FC<DateFieldProps> = ({
                                                        value,
                                                        onChangeText,
                                                        onChangeDate,
                                                        placeholder,
                                                    }) => {
    const [showPicker, setShowPicker] = useState(false)

    const currentDate = parseLocalDate(value) ?? new Date()

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
        <View>
            <TouchableOpacity activeOpacity={0.9} onPress={openPicker}>
                <TextField
                    value={value}
                    onChangeText={(text) => {
                        onChangeText(text)
                        const parsed = parseLocalDate(text)
                        onChangeDate?.(parsed)
                    }}
                    placeholder={placeholder}
                    leftIcon={<Calendar size={18} color="#9ca3af" />}
                />
            </TouchableOpacity>

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
