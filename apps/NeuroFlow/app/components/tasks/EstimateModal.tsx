import React from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'
import { X } from 'lucide-react-native'
import {EstimateModalProps} from "../../props/ui/EstimateModalProps";
import {formatMinutes} from "../../utils/dateUtils";
import {AppButton} from "../ui";
import {PRESETS} from "../../constants/budgetConstants";
import {estimateModalStyles} from "../../styles/tasks/estimateModal.styles";

export const EstimateModal: React.FC<EstimateModalProps> = ({
    visible,
    taskName,
    currentMinutes,
    onSetEstimate,
    onClose,
}: EstimateModalProps) => {
    if (!visible) return null

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={estimateModalStyles.overlay}>
                <View style={estimateModalStyles.card}>
                    <View style={estimateModalStyles.headerRow}>
                        <Text style={estimateModalStyles.title}>Time estimate</Text>
                        <TouchableOpacity onPress={onClose} style={estimateModalStyles.closeButton}>
                            <X size={18} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {taskName ? (
                        <Text style={estimateModalStyles.subtitle} numberOfLines={2}>{taskName}</Text>
                    ) : null}

                    <View style={estimateModalStyles.presetGrid}>
                        {PRESETS.map((mins) => (
                            <TouchableOpacity
                                key={mins}
                                style={[estimateModalStyles.presetChip, currentMinutes === mins && estimateModalStyles.presetChipActive]}
                                onPress={() => { onSetEstimate(mins); onClose() }}
                            >
                                <Text style={[estimateModalStyles.presetLabel, currentMinutes === mins && estimateModalStyles.presetLabelActive]}>
                                    {formatMinutes(mins)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {currentMinutes ? (
                        <AppButton
                            title="Clear estimate"
                            variant="outline"
                            onPress={() => { onSetEstimate(null); onClose() }}
                            fullWidth
                            style={{ marginTop: 8 }}
                        />
                    ) : null}

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
