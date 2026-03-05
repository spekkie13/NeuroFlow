import React from "react";
import {RescheduleModalProps} from "@/app/props/ui/RescheduleModalProps";
import {getDateInputPlaceholder} from "@/app/utils/dateUtils";
import {Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {X} from "lucide-react-native";
import {DateField} from "@/app/components/ui/DateField";
import {AppButton} from "@/app/components/ui/AppButton";

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
                                                                    visible,
                                                                    taskName,
                                                                    startDate,
                                                                    onChangeStartDate,
                                                                    onChangeEndDate,
                                                                    onSave,
                                                                    onCancel,
                                                                }: RescheduleModalProps) => {
    if (!visible) return null

    const placeholder = getDateInputPlaceholder()
    const disabled = !startDate

    const handleChangeDate = (value: string) => {
        onChangeStartDate(value)
        onChangeEndDate(value)
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>Reschedule task</Text>
                        <TouchableOpacity
                            onPress={onCancel}
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

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>
                            New date ({placeholder})
                        </Text>
                        <DateField
                            value={startDate}
                            onChangeText={handleChangeDate}
                            placeholder={placeholder}
                        />
                    </View>

                    <View style={styles.footerRow}>
                        <AppButton
                            title="Cancel"
                            variant="outline"
                            onPress={onCancel}
                            fullWidth
                        />
                        <AppButton
                            title="Save"
                            variant="primary"
                            onPress={onSave}
                            fullWidth
                            disabled={disabled}
                        />
                    </View>
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
        maxWidth: 400,
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
    fieldGroup: {
        marginTop: 8,
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center', // 🔥 centreert de groep
        gap: 8,
        marginTop: 12,
    },
})
