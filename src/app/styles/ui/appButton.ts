import {StyleSheet} from "react-native";
import {uiRadius} from "@/app/styles/uiTheme";

export const styles = StyleSheet.create({
    baseContainer: {
        borderRadius: uiRadius.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    baseText: {
        fontSize: 14,
        fontWeight: '600',
    },
    spinner: {
        marginRight: 8,
    },
    iconLeft: {
        marginRight: 6,
    },
    iconRight: {
        marginLeft: 6,
    },
})
