import React from 'react'
import { Modal, Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { ArrowDown, ArrowRight, ArrowUp, X } from 'lucide-react-native'
import { AppButton } from '../ui/AppButton'
import {PriorityModalProps} from "../../props/ui/PriorityModalProps";

export const PriorityModal: React.FC<PriorityModalProps> = ({
                                                                visible,
                                                                taskName,
                                                                onSetPriority,
                                                                onClose,
                                                            }: PriorityModalProps) => {
    if (!visible) return null

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.cardSmall}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>Set priority</Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            <X size={18} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {taskName ? (
                        <Text style={styles.subtitle} numberOfLines={2}>
                            {taskName}
                        </Text>
                    ) : null}

                    <View style={styles.priorityOptions}>
                        <TouchableOpacity
                            style={[styles.priorityOption, styles.priorityHigh]}
                            onPress={() => onSetPriority('high')}
                        >
                            <ArrowUp size={16} color="#b91c1c" />
                            <Text style={styles.priorityLabel}>High</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.priorityOption, styles.priorityMedium]}
                            onPress={() => onSetPriority('medium')}
                        >
                            <ArrowRight size={16} color="#92400e" />
                            <Text style={styles.priorityLabel}>Medium</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.priorityOption, styles.priorityLow]}
                            onPress={() => onSetPriority('low')}
                        >
                            <ArrowDown size={16} color="#166534" />
                            <Text style={styles.priorityLabel}>Low</Text>
                        </TouchableOpacity>
                    </View>

                    <AppButton
                        title="Cancel"
                        variant="outline"
                        onPress={onClose}
                        fullWidth
                        style={{ marginTop: 8 }}
                    />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    cardSmall: {
        width: '100%',
        maxWidth: 360,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    subtitle: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 12,
    },
    closeButton: {
        padding: 4,
        borderRadius: 999,
    },
    priorityOptions: {
        marginTop: 8,
        gap: 8,
    },
    priorityOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
    },
    priorityHigh: {
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca',
    },
    priorityMedium: {
        backgroundColor: '#fffbeb',
        borderColor: '#fef3c7',
    },
    priorityLow: {
        backgroundColor: '#ecfdf3',
        borderColor: '#bbf7d0',
    },
    priorityLabel: {
        marginLeft: 8,
        fontSize: 13,
        fontWeight: '500',
        color: '#111827',
    },
})
