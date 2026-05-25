import React from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'
import { ArrowDown, ArrowRight, ArrowUp, X } from 'lucide-react-native'
import { AppButton } from '../ui'
import { PriorityModalProps } from "../../props/ui/PriorityModalProps";
import { priorityModalStyles } from "../../styles/tasks/priorityModal.styles";

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
            <View style={priorityModalStyles.overlay}>
                <View style={priorityModalStyles.cardSmall}>
                    <View style={priorityModalStyles.headerRow}>
                        <Text style={priorityModalStyles.title}>Set priority</Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={priorityModalStyles.closeButton}
                        >
                            <X size={18} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {taskName ? (
                        <Text style={priorityModalStyles.subtitle} numberOfLines={2}>
                            {taskName}
                        </Text>
                    ) : null}

                    <View style={priorityModalStyles.priorityOptions}>
                        <TouchableOpacity
                            style={[priorityModalStyles.priorityOption, priorityModalStyles.priorityHigh]}
                            onPress={() => onSetPriority('high')}
                        >
                            <ArrowUp size={16} color="#b91c1c" />
                            <Text style={priorityModalStyles.priorityLabel}>High</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[priorityModalStyles.priorityOption, priorityModalStyles.priorityMedium]}
                            onPress={() => onSetPriority('medium')}
                        >
                            <ArrowRight size={16} color="#92400e" />
                            <Text style={priorityModalStyles.priorityLabel}>Medium</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[priorityModalStyles.priorityOption, priorityModalStyles.priorityLow]}
                            onPress={() => onSetPriority('low')}
                        >
                            <ArrowDown size={16} color="#166534" />
                            <Text style={priorityModalStyles.priorityLabel}>Low</Text>
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
