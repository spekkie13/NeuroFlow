import React from 'react'
import { Text, View } from 'react-native'
import {styles} from "@/app/styles/ui/card";
import {CardProps} from "@/app/props/ui/CardProps";

export const Card: React.FC<CardProps> = ({
                                              children,
                                              style,
                                              title,
                                              subtitle,
                                              headerRight,
                                          }) => {
    const hasHeader = title || subtitle || headerRight

    return (
        <View style={[styles.card, style]}>
            {hasHeader && (
                <View style={styles.header}>
                    <View style={styles.headerTextContainer}>
                        {title && <Text style={styles.title}>{title}</Text>}
                        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                    </View>
                    {headerRight && <View style={styles.headerRight}>{headerRight}</View>}
                </View>
            )}

            <View style={styles.body}>{children}</View>
        </View>
    )
}
