import React from "react";
import { Pressable, TextInput, View } from "react-native";
import { Plus } from "lucide-react-native";
import { TaskInputProps } from "@/props/TaskInputProps";
import { styles } from "@/styles/taskInput";

export function TaskInput({ value, onChange, onSubmit, placeholder }: TaskInputProps) {
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
                <Plus size={20} color="#FFFFFF" />
            </Pressable>
        </View>
    );
}
