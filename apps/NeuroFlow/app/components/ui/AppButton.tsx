import React from 'react'
import { ActivityIndicator, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { styles } from '../../styles/ui/appButton'
import {AppButtonProps} from "../../props/ui/AppButtonProps";
import {AppButtonSize, AppButtonVariant} from "../../constants/uiConstants";
import {uiColors, uiRadius} from "../../styles/uiTheme";

export const AppButton: React.FC<AppButtonProps> = ({
                                                        title,
                                                        onPress,
                                                        variant = 'primary',
                                                        size = 'md',
                                                        disabled,
                                                        loading,
                                                        fullWidth,
                                                        leftIcon,
                                                        rightIcon,
                                                        style,
                                                        textStyle,
                                                        accessibilityLabel,
                                                    }: AppButtonProps) => {
    const isDisabled = disabled || loading
    const hasText = Boolean(title && title.trim().length > 0)

    const { containerStyle, textBaseStyle, spinnerColor } = getStylesForVariant(
        variant,
        size,
        fullWidth,
        isDisabled,
    )

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
            style={[styles.baseContainer, containerStyle, style]}
            accessibilityLabel={accessibilityLabel ?? title}
        >
            {loading && (
                <ActivityIndicator
                    size="small"
                    color={spinnerColor}
                    style={styles.spinner}
                />
            )}

            {!loading && leftIcon && (
                <View style={hasText ? styles.iconLeft : undefined}>
                    {leftIcon}
                </View>
            )}

            {hasText && (
                <Text style={[styles.baseText, textBaseStyle, textStyle]} numberOfLines={1}>
                    {title}
                </Text>
            )}

            {!loading && rightIcon && (
                <View style={hasText ? styles.iconRight : undefined}>
                    {rightIcon}
                </View>
            )}
        </TouchableOpacity>
    )
}

function getStylesForVariant(
    variant: AppButtonVariant,
    size: AppButtonSize,
    fullWidth?: boolean,
    disabled?: boolean,
): { containerStyle: ViewStyle; textBaseStyle: TextStyle; spinnerColor: string } {
    const paddingVertical =
        size === 'sm' ? 8 : size === 'lg' ? 14 : 10
    const paddingHorizontal =
        size === 'sm' ? 10 : size === 'lg' ? 18 : 14

    const base: ViewStyle = {
        paddingVertical,
        paddingHorizontal,
        borderRadius: uiRadius.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: size === 'lg' ? 48 : 40,
    }

    if (fullWidth) {
        base.alignSelf = 'stretch'
    }

    let containerStyle: ViewStyle = {}
    let textBaseStyle: TextStyle = {}
    let spinnerColor = '#ffffff'

    switch (variant) {
        case 'primary':
            containerStyle = {
                ...base,
                backgroundColor: disabled ? '#93c5fd' : uiColors.primary,
            }
            textBaseStyle = {
                color: '#ffffff',
            }
            spinnerColor = '#ffffff'
            break

        case 'secondary':
            containerStyle = {
                ...base,
                backgroundColor: uiColors.gray100,
            }
            textBaseStyle = {
                color: uiColors.gray800,
            }
            spinnerColor = uiColors.gray700
            break

        case 'outline':
            containerStyle = {
                ...base,
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: uiColors.gray300,
            }
            textBaseStyle = {
                color: uiColors.gray800,
            }
            spinnerColor = uiColors.gray700
            break

        case 'ghost':
            containerStyle = {
                ...base,
                backgroundColor: 'transparent',
            }
            textBaseStyle = {
                color: uiColors.gray700,
            }
            spinnerColor = uiColors.gray700
            break

        case 'danger':
            containerStyle = {
                ...base,
                backgroundColor: disabled ? '#fecaca' : uiColors.danger,
            }
            textBaseStyle = {
                color: '#ffffff',
            }
            spinnerColor = '#ffffff'
            break
    }

    return { containerStyle, textBaseStyle, spinnerColor }
}
