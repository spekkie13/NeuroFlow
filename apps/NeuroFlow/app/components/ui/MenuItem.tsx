import React from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {MenuItemProps} from "../../props/ui/MenuItemProps";
import {styles} from "../../styles/taskView";

export const MenuItem = ({
                             icon,
                             label,
                             onPress,
                             danger,
                             disabled,
                         }: MenuItemProps) => (
    <TouchableOpacity
        activeOpacity={0.85}
        onPress={disabled ? undefined : onPress}
        style={[
            styles.inlineMenuItem,
            danger && styles.inlineMenuItemDanger,
            disabled && styles.inlineMenuItemDisabled,
        ]}
        accessibilityLabel={label}
    >
        <View style={styles.inlineMenuIcon}>{icon}</View>
        <Text
            style={[
                styles.inlineMenuLabel,
                danger && styles.inlineMenuLabelDanger,
                disabled && styles.inlineMenuLabelDisabled,
            ]}
            numberOfLines={1}
        >
            {label}
        </Text>
    </TouchableOpacity>
)
