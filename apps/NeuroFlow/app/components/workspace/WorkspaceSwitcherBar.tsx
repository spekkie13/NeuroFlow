import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ChevronDown, Layers } from 'lucide-react-native'

interface WorkspaceSwitcherBarProps {
    workspaceName: string
    onPress: () => void
}

export const WorkspaceSwitcherBar: React.FC<WorkspaceSwitcherBarProps> = ({
    workspaceName,
    onPress,
}) => (
    <TouchableOpacity style={styles.bar} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.left}>
            <Layers size={14} color="#6b7280" />
            <Text style={styles.label} numberOfLines={1}>
                {workspaceName}
            </Text>
        </View>
        <ChevronDown size={14} color="#6b7280" />
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    bar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flexShrink: 1,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
        flexShrink: 1,
    },
})