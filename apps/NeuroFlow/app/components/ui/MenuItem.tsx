import React from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {MenuItemProps} from "../../props/ui/MenuItemProps";
import {menuItemStyles} from "../../styles/tasks/menuItem.styles";

export const MenuItem: React.FC<MenuItemProps> = ({
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
            menuItemStyles.inlineMenuItem,
            danger && menuItemStyles.inlineMenuItemDanger,
            disabled && menuItemStyles.inlineMenuItemDisabled,
        ]}
        accessibilityLabel={label}
    >
        <View style={menuItemStyles.inlineMenuIcon}>{icon}</View>
        <Text
            style={[
                menuItemStyles.inlineMenuLabel,
                danger && menuItemStyles.inlineMenuLabelDanger,
                disabled && menuItemStyles.inlineMenuLabelDisabled,
            ]}
            numberOfLines={1}
        >
            {label}
        </Text>
    </TouchableOpacity>
)
