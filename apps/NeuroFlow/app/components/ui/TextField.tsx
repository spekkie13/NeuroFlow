import React from 'react'
import { TextInput, View, Text, StyleSheet } from 'react-native'
import {TextFieldProps} from "../../props/ui/TextFieldProps";

export const TextField: React.FC<TextFieldProps> = ({
                                               label,
                                               errorText,
                                               leftIcon,
                                               rightIcon,
                                               containerStyle,
                                               inputStyle,
                                               ...inputProps
                                           }: TextFieldProps) => {
    return (
        <View style={containerStyle}>
            {label ? <Text style={styles.label}>{label}</Text> : null}

            <View style={styles.inputWrapper}>
                {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}

                <TextInput
                    style={[
                        styles.input,
                        leftIcon ? { paddingLeft: 36 } : undefined,
                        rightIcon ? { paddingRight: 36 } : undefined,
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
