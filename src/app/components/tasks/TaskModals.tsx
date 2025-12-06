import React from 'react'
import {
    Modal,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native'
import {
    ArrowDown,
    ArrowRight,
    ArrowUp,
    X,
} from 'lucide-react-native'
import { AppButton } from '../ui/AppButton'
import { DateField } from '../ui/DateField'
import { Priority } from '../../utils/types'
import { getDateInputPlaceholder } from '../../utils/dateUtils'

interface PriorityModalProps {
    visible: boolean
    taskName?: string
    onSetPriority: (priority: Priority) => void
    onClose: () => void
}

export const PriorityModal: React.FC<PriorityModalProps> = ({
                                                                visible,
                                                                taskName,
                                                                onSetPriority,
                                                                onClose,
                                                            }) => {
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
                    <Text style={styles.title}>Set priority</Text>
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

interface RescheduleModalProps {
    visible: boolean
    taskName?: string
    startDate: string
    endDate: string
    onChangeStartDate: (value: string) => void
    onChangeEndDate: (value: string) => void
    onSave: () => void
    onCancel: () => void
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
                                                                    visible,
                                                                    taskName,
                                                                    startDate,
                                                                    endDate,
                                                                    onChangeStartDate,
                                                                    onChangeEndDate,
                                                                    onSave,
                                                                    onCancel,
                                                                }) => {
    if (!visible) return null

    const placeholder = getDateInputPlaceholder()
    const disabled = !startDate || !endDate

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

                    <View style={styles.row}>
                        <View style={styles.flex}>
                            <Text style={styles.label}>
                                New start date ({placeholder})
                            </Text>
                            <DateField
                                value={startDate}
                                onChangeText={onChangeStartDate}
                                placeholder={placeholder}
                            />
                        </View>
                        <View style={{ width: 8 }} />
                        <View style={styles.flex}>
                            <Text style={styles.label}>
                                New end date ({placeholder})
                            </Text>
                            <DateField
                                value={endDate}
                                onChangeText={onChangeEndDate}
                                placeholder={placeholder}
                            />
                        </View>
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
    cardSmall: {
        width: '100%',
        maxWidth: 360,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        padding: 16,
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
    row: {
        flexDirection: 'row',
        marginTop: 8,
    },
    flex: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    footerRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
})
