import {StyleSheet} from "react-native";
import {uiColors, uiRadius, uiSpacing} from "@/app/styles/uiTheme";

export const styles = StyleSheet.create({
    card: {
        borderRadius: uiRadius.lg,
        backgroundColor: uiColors.surface,
        padding: uiSpacing.md,
        borderWidth: 1,
        borderColor: uiColors.gray200,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: uiSpacing.sm,
    },
    headerTextContainer: {
        flex: 1,
    },
    headerRight: {
        marginLeft: uiSpacing.sm,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: uiColors.gray900,
    },
    subtitle: {
        marginTop: 2,
        fontSize: 13,
        color: uiColors.gray500,
    },
    body: {
        marginTop: 4,
    },
})
