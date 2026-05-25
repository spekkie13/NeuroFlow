import { Text, View } from "react-native";
import React from "react";
import { googleIconStyles } from "../../styles/ui/googleIcon.styles";

export function GoogleIcon() {
    return (
        <View style={googleIconStyles.googleIconWrap}>
            <Text style={[googleIconStyles.googleIconText, { color: '#4285F4' }]}>G</Text>
        </View>
    )
}
