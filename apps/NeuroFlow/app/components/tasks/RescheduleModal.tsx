import React from "react";
import {Modal, Text, TouchableOpacity, View} from "react-native";
import {X} from "lucide-react-native";
import {RescheduleModalProps} from "../../props/ui/RescheduleModalProps";
import {getDateInputPlaceholder} from "../../utils/dateUtils";
import {AppButton, DateField} from "../ui";
import {rescheduleModalStyles} from "../../styles/tasks/rescheduleModal.styles";

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
                                                                    visible,
                                                                    taskName,
                                                                    date,
                                                                    hasDate,
                                                                    onChangeDate,
                                                                    onSave,
                                                                    onClear,
                                                                    onCancel,
                                                                }: RescheduleModalProps) => {
    if (!visible) return null

    const placeholder: string = getDateInputPlaceholder()
    const disabled: boolean = !date

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={rescheduleModalStyles.overlay}>
                <View style={rescheduleModalStyles.card}>
                    <View style={rescheduleModalStyles.headerRow}>
                        <Text style={rescheduleModalStyles.title}>Reschedule task</Text>
                        <TouchableOpacity
                            onPress={onCancel}
                            style={rescheduleModalStyles.closeButton}
                        >
                            <X size={18} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {taskName ? (
                        <Text style={rescheduleModalStyles.subtitle} numberOfLines={2}>
                            {taskName}
                        </Text>
                    ) : null}

                    <View style={rescheduleModalStyles.fieldGroup}>
                        <Text style={rescheduleModalStyles.label}>
                            New date ({placeholder})
                        </Text>
                        <DateField
                            value={date}
                            onChangeText={onChangeDate}
                            placeholder={placeholder}
                        />
                    </View>

                    <View style={rescheduleModalStyles.footerRow}>
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
                    {hasDate && onClear && (
                        <AppButton
                            title="Remove scheduled date"
                            variant="ghost"
                            onPress={onClear}
                            fullWidth
                        />
                    )}
                </View>
            </View>
        </Modal>
    )
}
