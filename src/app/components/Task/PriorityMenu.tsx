import React from "react";
import { Pressable, Text, View } from "react-native";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react-native";
import { PriorityMenuProps } from "@/props/PriorityMenuProps";
import { styles } from "@/styles/priorityMenu";

export function PriorityMenu({ onSelect }: PriorityMenuProps) {
    return (
        <View style={styles.priorityMenu}>
            <Pressable
                onPress={() => onSelect('high')}
                style={styles.priorityMenuItem}
            >
                <ArrowUp size={16} color="#EF4444" />
                <Text style={styles.priorityMenuText}>High</Text>
            </Pressable>
            <Pressable
                onPress={() => onSelect('medium')}
                style={styles.priorityMenuItem}
            >
                <ArrowRight size={16} color="#F59E0B" />
                <Text style={styles.priorityMenuText}>Medium</Text>
            </Pressable>
            <Pressable
                onPress={() => onSelect('low')}
                style={styles.priorityMenuItem}
            >
                <ArrowDown size={16} color="#10B981" />
                <Text style={styles.priorityMenuText}>Low</Text>
            </Pressable>
        </View>
    );
}
