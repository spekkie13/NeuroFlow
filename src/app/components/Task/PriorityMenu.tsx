import {Priority} from "../../../app/utils/types";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {ArrowDown as ArrowDownIcon, ArrowRight as ArrowRightIcon, ArrowUp as ArrowUpIcon} from "lucide-react-native";
import React from "react";

export function PriorityMenu({ onSelect }: { onSelect: (p: Priority) => void }) {
    return (
        <View style={styles.priorityMenu}>
            <Pressable
                onPress={() => onSelect('high')}
                style={styles.priorityMenuItem}
            >
                <ArrowUpIcon size={16} color="#EF4444" />
                <Text style={styles.priorityMenuText}>High</Text>
            </Pressable>
            <Pressable
                onPress={() => onSelect('medium')}
                style={styles.priorityMenuItem}
            >
                <ArrowRightIcon size={16} color="#F59E0B" />
                <Text style={styles.priorityMenuText}>Medium</Text>
            </Pressable>
            <Pressable
                onPress={() => onSelect('low')}
                style={styles.priorityMenuItem}
            >
                <ArrowDownIcon size={16} color="#10B981" />
                <Text style={styles.priorityMenuText}>Low</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    priorityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 9999,
        borderWidth: 1,
    },
    priorityText: {
        fontSize: 11,
        textTransform: 'capitalize',
        fontWeight: '500',
    },
    priorityWrapper: {
        position: 'relative',
    },
    priorityMenu: {
        position: 'absolute',
        top: 36,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingVertical: 4,
        width: 150,
        zIndex: 1000,
        elevation: 12,
    },
    priorityMenuItem: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    priorityMenuText: {
        fontSize: 13,
        color: '#374151',
    },
});
