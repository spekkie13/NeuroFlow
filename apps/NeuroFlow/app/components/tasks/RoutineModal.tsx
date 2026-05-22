import React, {useEffect, useState} from 'react'
import {Modal, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native'
import {X} from 'lucide-react-native'
import {Priority} from "../../models"
import {Routine, RecurrenceFrequency, RecurrenceRule} from "../../models/Routine"
import {createRoutine} from "../../services/domain/RoutineService"
import {TextField} from "../ui/TextField"
import {AppButton} from "../ui/AppButton"

interface RoutineModalProps {
    visible: boolean
    routine?: Routine
    onSave: (routine: Routine) => void
    onClose: () => void
}

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const ESTIMATE_PRESETS = [5, 10, 15, 30, 45, 60]
const MONTH_DAYS = Array.from({ length: 28 }, (_, i) => i + 1)

export const RoutineModal: React.FC<RoutineModalProps> = ({visible, routine, onSave, onClose}) => {
    const [name, setName] = useState('')
    const [frequency, setFrequency] = useState<RecurrenceFrequency>('daily')
    const [daysOfWeek, setDaysOfWeek] = useState<number[]>([])
    const [dayOfMonth, setDayOfMonth] = useState(1)
    const [priority, setPriority] = useState<Priority>('medium')
    const [estimatedMinutes, setEstimatedMinutes] = useState<number | undefined>(undefined)

    useEffect(() => {
        if (visible) {
            setName(routine?.name ?? '')
            setFrequency(routine?.recurrence.frequency ?? 'daily')
            setDaysOfWeek(routine?.recurrence.daysOfWeek ?? [])
            setDayOfMonth(routine?.recurrence.dayOfMonth ?? 1)
            setPriority(routine?.priority ?? 'medium')
            setEstimatedMinutes(routine?.estimatedMinutes)
        }
    }, [visible, routine])

    if (!visible) return null

    const buildRule = (): RecurrenceRule => {
        switch (frequency) {
            case 'weekly': return {frequency, daysOfWeek}
            case 'monthly': return {frequency, dayOfMonth}
            default: return {frequency: 'daily'}
        }
    }

    const handleSave = () => {
        const trimmed = name.trim()
        if (!trimmed) return

        if (routine) {
            onSave({
                ...routine,
                name: trimmed,
                recurrence: buildRule(),
                priority,
                estimatedMinutes,
                updatedAt: new Date().toISOString(),
            })
        } else {
            onSave(createRoutine({name: trimmed, recurrence: buildRule(), priority, estimatedMinutes}))
        }
    }

    const toggleDay = (day: number) => {
        setDaysOfWeek(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day],
        )
    }

    const canSave = name.trim().length > 0 && (frequency !== 'weekly' || daysOfWeek.length > 0)

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>{routine ? 'Edit routine' : 'New routine'}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={18} color="#6b7280"/>
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Name */}
                        <Text style={styles.label}>Name</Text>
                        <TextField
                            value={name}
                            onChangeText={setName}
                            placeholder="e.g. Morning workout"
                            returnKeyType="done"
                        />

                        {/* Frequency */}
                        <Text style={styles.label}>Repeats</Text>
                        <View style={styles.chipRow}>
                            {(['daily', 'weekly', 'monthly'] as RecurrenceFrequency[]).map(f => (
                                <TouchableOpacity
                                    key={f}
                                    style={[styles.chip, frequency === f && styles.chipActive]}
                                    onPress={() => setFrequency(f)}
                                >
                                    <Text style={[styles.chipText, frequency === f && styles.chipTextActive]}>
                                        {f.charAt(0).toUpperCase() + f.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Day-of-week picker */}
                        {frequency === 'weekly' && (
                            <>
                                <Text style={styles.label}>On these days</Text>
                                <View style={styles.dayRow}>
                                    {DAY_LABELS.map((label, i) => (
                                        <TouchableOpacity
                                            key={i}
                                            style={[styles.dayChip, daysOfWeek.includes(i) && styles.dayChipActive]}
                                            onPress={() => toggleDay(i)}
                                        >
                                            <Text style={[styles.dayChipText, daysOfWeek.includes(i) && styles.dayChipTextActive]}>
                                                {label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        )}

                        {/* Day-of-month picker */}
                        {frequency === 'monthly' && (
                            <>
                                <Text style={styles.label}>On day</Text>
                                <View style={styles.monthDayGrid}>
                                    {MONTH_DAYS.map(d => (
                                        <TouchableOpacity
                                            key={d}
                                            style={[styles.monthDayChip, dayOfMonth === d && styles.dayChipActive]}
                                            onPress={() => setDayOfMonth(d)}
                                        >
                                            <Text style={[styles.monthDayText, dayOfMonth === d && styles.dayChipTextActive]}>
                                                {d}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        )}

                        {/* Priority */}
                        <Text style={styles.label}>Priority</Text>
                        <View style={styles.chipRow}>
                            {(['high', 'medium', 'low'] as Priority[]).map(p => (
                                <TouchableOpacity
                                    key={p}
                                    style={[styles.chip, priority === p && styles.chipActive]}
                                    onPress={() => setPriority(p)}
                                >
                                    <Text style={[styles.chipText, priority === p && styles.chipTextActive]}>
                                        {p.charAt(0).toUpperCase() + p.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Estimate */}
                        <Text style={styles.label}>Estimated time (optional)</Text>
                        <View style={styles.chipRow}>
                            {ESTIMATE_PRESETS.map(mins => (
                                <TouchableOpacity
                                    key={mins}
                                    style={[styles.chip, estimatedMinutes === mins && styles.chipActive]}
                                    onPress={() => setEstimatedMinutes(prev => prev === mins ? undefined : mins)}
                                >
                                    <Text style={[styles.chipText, estimatedMinutes === mins && styles.chipTextActive]}>
                                        {mins < 60 ? `${mins}m` : `${mins / 60}h`}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <AppButton
                            title={routine ? 'Save changes' : 'Create routine'}
                            variant="primary"
                            onPress={handleSave}
                            disabled={!canSave}
                            fullWidth
                            style={{marginTop: 20}}
                        />
                        <AppButton
                            title="Cancel"
                            variant="outline"
                            onPress={onClose}
                            fullWidth
                            style={{marginTop: 8, marginBottom: 8}}
                        />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        justifyContent: 'flex-end',
    },
    card: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '90%',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    closeButton: {
        padding: 4,
        borderRadius: 999,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 16,
        marginBottom: 8,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
    },
    chipActive: {
        backgroundColor: '#eff6ff',
        borderColor: '#2563eb',
    },
    chipText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
    },
    chipTextActive: {
        color: '#2563eb',
        fontWeight: '600',
    },
    dayRow: {
        flexDirection: 'row',
        gap: 6,
    },
    dayChip: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayChipActive: {
        backgroundColor: '#eff6ff',
        borderColor: '#2563eb',
    },
    dayChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
    },
    dayChipTextActive: {
        color: '#2563eb',
    },
    monthDayGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    monthDayChip: {
        width: 36,
        height: 36,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
        alignItems: 'center',
        justifyContent: 'center',
    },
    monthDayText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
    },
})