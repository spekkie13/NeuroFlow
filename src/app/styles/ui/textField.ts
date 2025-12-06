import {StyleSheet} from "react-native";
import {uiColors, uiRadius, uiSpacing} from "@/app/styles/uiTheme";

export const styles = StyleSheet.create({
    container: {
        marginBottom: uiSpacing.md,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        color: uiColors.gray700,
        marginBottom: 4,
    },
    input: {
        borderRadius: uiRadius.md,
        borderWidth: 1,
        borderColor: uiColors.gray300,
        paddingHorizontal: uiSpacing.md,
        paddingVertical: 10,
        fontSize: 14,
        color: uiColors.gray900,
        backgroundColor: uiColors.surface,
    },
    inputError: {
        borderColor: uiColors.danger,
    },
    helperText: {
        marginTop: 4,
        fontSize: 12,
        color: uiColors.gray500,
    },
    errorText: {
        marginTop: 4,
        fontSize: 12,
        color: uiColors.danger,
    },
})
