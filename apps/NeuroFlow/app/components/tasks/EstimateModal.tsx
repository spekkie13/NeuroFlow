import React from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { X } from 'lucide-react-native'
import {EstimateModalProps} from "../../props/ui/EstimateModalProps";
import {formatMinutes} from "../../utils/dateUtils";
import {AppButton} from "../ui/AppButton";

const PRESETS = [15, 30, 45, 60, 90, 120, 180, 240]

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
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>Time estimate</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={18} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {taskName ? (
                        <Text style={styles.subtitle} numberOfLines={2}>{taskName}</Text>
                    ) : null}

                    <View style={styles.presetGrid}>
                        {PRESETS.map((mins) => (
                            <TouchableOpacity
                                key={mins}
                                style={[styles.presetChip, currentMinutes === mins && styles.presetChipActive]}
                                onPress={() => { onSetEstimate(mins); onClose() }}
                            >
                                <Text style={[styles.presetLabel, currentMinutes === mins && styles.presetLabelActive]}>
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

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    card: {
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
    presetGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    presetChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
    },
    presetChipActive: {
        backgroundColor: '#eff6ff',
        borderColor: '#2563eb',
    },
    presetLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
    },
    presetLabelActive: {
        color: '#2563eb',
        fontWeight: '600',
    },
})
