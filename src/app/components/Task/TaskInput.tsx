import {Pressable, StyleSheet, TextInput, View} from "react-native";
import {Plus as PlusIcon} from "lucide-react-native";
import React from "react";

export function TaskInput({
                              value,
                              onChange,
                              onSubmit,
                              placeholder,
                          }: {
    value: string;
    onChange: (text: string) => void;
    onSubmit: () => void;
    placeholder: string;
}) {
    return (
        <View style={styles.addRow}>
            <TextInput
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                style={styles.addInput}
                onSubmitEditing={onSubmit}
            />
            <Pressable
                onPress={onSubmit}
                disabled={!value.trim()}
                style={[styles.addButton, !value.trim() && styles.addButtonDisabled]}
            >
                <PlusIcon size={20} color="#FFFFFF" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
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
