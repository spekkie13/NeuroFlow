// src/components/Task/PriorityMenu.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import {
    ArrowUp as ArrowUpIcon,
    ArrowRight as ArrowRightIcon,
    ArrowDown as ArrowDownIcon,
} from 'lucide-react-native';
import { Priority } from '../../utils/types';

type Props = {
    current: Priority;
    onPick: (p: Priority) => void;
};

export const PriorityMenu: React.FC<Props> = ({ current, onPick }) => {
    return (
        <View
            style={{
                position: 'absolute',
                top: 36,
                right: 12,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 10,
                paddingVertical: 4,
                width: 170,
                elevation: 6,
                zIndex: 9999,
                shadowColor: '#000',
                shadowOpacity: 0.12,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 6 },
            }}
        >
            <Pressable
                onPress={() => {
                    onPick('high');
                }}
                style={{
                    flexDirection: 'row',
                    gap: 6,
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                }}
            >
                <ArrowUpIcon size={16} color="#EF4444" />
                <Text style={{ color: current === 'high' ? '#B91C1C' : '#111827' }}>
                    High
                </Text>
            </Pressable>
            <Pressable
                onPress={() => {
                    onPick('medium');
                }}
                style={{
                    flexDirection: 'row',
                    gap: 6,
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                }}
            >
                <ArrowRightIcon size={16} color="#F59E0B" />
                <Text
                    style={{ color: current === 'medium' ? '#92400E' : '#111827' }}
                >
                    Medium
                </Text>
            </Pressable>
            <Pressable
                onPress={() => {
                    onPick('low');
                }}
                style={{
                    flexDirection: 'row',
                    gap: 6,
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                }}
            >
                <ArrowDownIcon size={16} color="#10B981" />
                <Text style={{ color: current === 'low' ? '#166534' : '#111827' }}>
                    Low
                </Text>
            </Pressable>
        </View>
    );
};
