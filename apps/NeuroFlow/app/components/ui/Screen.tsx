import React from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'
import { uiSpacing } from '../../styles/uiTheme'
import {ScreenProps} from "../../props/ui/ScreenProps";
import {styles} from "../../styles/ui/screen";

export const Screen: React.FC<ScreenProps> = ({
                                                  children,
                                                  scroll,
                                                  contentContainerStyle,
                                                  style,
                                                  paddingHorizontal = uiSpacing.xl,
                                                  paddingVertical = uiSpacing.lg,
                                              }: ScreenProps) => {
    const Container = scroll ? ScrollView : View

    return (
        <SafeAreaView style={[styles.safeArea, style]}>
            <Container
                style={styles.container}
                {...(scroll
                    ? {
                        contentContainerStyle: [
                            styles.contentContainer,
                            { paddingHorizontal, paddingVertical },
                            contentContainerStyle,
                        ],
                    }
                    : {})}
            >
                {!scroll && (
                    <View
                        style={[
                            styles.contentContainer,
                            { paddingHorizontal, paddingVertical },
                            contentContainerStyle,
                        ]}
                    >
                        {children}
                    </View>
                )}
                {scroll && children}
            </Container>
        </SafeAreaView>
    )
}
