import React from 'react'
import {
    GestureResponderEvent,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native'
import { uiColors, uiRadius, uiSpacing } from '../../styles/uiTheme'
import {styles} from "@/app/styles/ui/iconButton";
import {IconButtonProps} from "@/app/props/ui/IconButtonProps";

export const IconButton: React.FC<IconButtonProps> = ({
                                                          icon,
                                                          onPress,
                                                          variant = 'neutral',
                                                          disabled,
                                                          style,
                                                          accessibilityLabel,
                                                      }: IconButtonProps) => {
    const base: ViewStyle = {
        padding: uiSpacing.xs + 2,
        borderRadius: uiRadius.md,
    }

    let variantStyle: ViewStyle = {}

    if (variant === 'neutral') {
        variantStyle = {
            ...base,
        }
    }

    if (variant === 'subtle') {
        variantStyle = {
            ...base,
            backgroundColor: uiColors.gray100,
        }
    }

    if (variant === 'danger') {
        variantStyle = {
            ...base,
            backgroundColor: uiColors.dangerSoft,
        }
    }

    if (variant === 'success') {
        variantStyle = {
            ...base,
            backgroundColor: uiColors.successSoft,
        }
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
            style={[styles.base, variantStyle, style]}
            accessibilityLabel={accessibilityLabel}
        >
            {icon}
        </TouchableOpacity>
    )
}
