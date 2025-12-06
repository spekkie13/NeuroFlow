// components/ui/TextField.tsx
import React from 'react'
import {
    TextInput,
    TextInputProps,
    View,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
} from 'react-native'

interface Props extends TextInputProps {
    label?: string
    errorText?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    containerStyle?: ViewStyle
    inputStyle?: TextStyle
}

export const TextField: React.FC<Props> = ({
                                               label,
                                               errorText,
                                               leftIcon,
                                               rightIcon,
                                               containerStyle,
                                               inputStyle,
                                               ...inputProps
                                           }) => {
    return (
        <View style={containerStyle}>
            {label ? <Text style={styles.label}>{label}</Text> : null}

            <View style={styles.inputWrapper}>
                {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}

                <TextInput
                    style={[
                        styles.input,
                        leftIcon && { paddingLeft: 36 },
                        rightIcon && { paddingRight: 36 },
                        inputStyle,
                    ]}
                    placeholderTextColor="#9ca3af"
                    {...inputProps}
                />

                {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
            </View>

            {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    input: {
        flex: 1,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#d1d5db',
        paddingHorizontal: 12,
        paddingVertical: 9,
        fontSize: 14,
        color: '#111827',
        backgroundColor: '#ffffff',
    },
    leftIcon: {
        position: 'absolute',
        left: 10,
        zIndex: 1,
    },
    rightIcon: {
        position: 'absolute',
        right: 10,
        zIndex: 1,
    },
    errorText: {
        marginTop: 4,
        fontSize: 11,
        color: '#b91c1c',
    },
})
