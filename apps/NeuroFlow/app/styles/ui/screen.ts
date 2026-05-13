import {StyleSheet} from "react-native";
import {uiColors} from "../uiTheme";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: uiColors.background,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
})
