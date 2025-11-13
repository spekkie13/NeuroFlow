import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    addRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 14,
    },
    addInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        fontSize: 14,
    },
    addButton: {
        backgroundColor: '#2563EB',
        borderRadius: 10,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonDisabled: {
        backgroundColor: '#93C5FD',
    },
});
