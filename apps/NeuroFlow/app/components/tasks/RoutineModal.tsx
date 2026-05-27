import React, {useEffect, useRef, useState} from 'react'
import {Modal, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {Plus, Trash2, X} from 'lucide-react-native'
import { Priority, RecurrenceFrequency, RecurrenceRule } from "../../models"
import {RoutineStep} from "../../models/Routine"
import {createRoutine} from "../../services/domain/RoutineService"
import { AppButton, TextField } from "../ui"
import {RoutineModalProps} from "../../props/tasks/RoutineModalProps";
import {DAY_LABELS, ESTIMATE_PRESETS, MONTH_DAYS} from "../../constants/budgetConstants";
import { routineModalStyles } from "../../styles/tasks/routineModal.styles"
import {generateId} from "../../utils/idUtils";

export const RoutineModal: React.FC<RoutineModalProps> = ({visible, routine, onSave, onClose}: RoutineModalProps) => {
    const [name, setName] = useState('')
    const [frequency, setFrequency] = useState<RecurrenceFrequency>('daily')
    const [daysOfWeek, setDaysOfWeek] = useState<number[]>([])
    const [dayOfMonth, setDayOfMonth] = useState(1)
    const [priority, setPriority] = useState<Priority>('medium')
    const [estimatedMinutes, setEstimatedMinutes] = useState<number | undefined>(undefined)
    const [steps, setSteps] = useState<RoutineStep[]>([])
    const newStepRef = useRef<TextInput>(null)

    useEffect(() => {
        if (visible) {
            setName(routine?.name ?? '')
            setFrequency(routine?.recurrence.frequency ?? 'daily')
            setDaysOfWeek(routine?.recurrence.daysOfWeek ?? [])
            setDayOfMonth(routine?.recurrence.dayOfMonth ?? 1)
            setPriority(routine?.priority ?? 'medium')
            setEstimatedMinutes(routine?.estimatedMinutes)
            setSteps(routine?.steps ?? [])
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

        const cleanSteps = steps.filter(s => s.text.trim().length > 0).map(s => ({ ...s, text: s.text.trim() }))

        if (routine) {
            onSave({
                ...routine,
                name: trimmed,
                recurrence: buildRule(),
                priority,
                estimatedMinutes,
                steps: cleanSteps.length > 0 ? cleanSteps : undefined,
                updatedAt: new Date().toISOString(),
            })
        } else {
            onSave(createRoutine({name: trimmed, recurrence: buildRule(), priority, estimatedMinutes, steps: cleanSteps.length > 0 ? cleanSteps : undefined}))
        }
    }

    const addStep = () => {
        setSteps(prev => [...prev, { id: generateId(), text: '' }])
        setTimeout(() => newStepRef.current?.focus(), 50)
    }

    const updateStep = (id: string, text: string) => {
        setSteps(prev => prev.map(s => s.id === id ? { ...s, text } : s))
    }

    const removeStep = (id: string) => {
        setSteps(prev => prev.filter(s => s.id !== id))
    }

    const toggleDay = (day: number) => {
        setDaysOfWeek(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day],
        )
    }

    const canSave = name.trim().length > 0 && (frequency !== 'weekly' || daysOfWeek.length > 0)

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={routineModalStyles.overlay}>
                <View style={routineModalStyles.card}>
                    <View style={routineModalStyles.headerRow}>
                        <Text style={routineModalStyles.title}>{routine ? 'Edit routine' : 'New routine'}</Text>
                        <TouchableOpacity onPress={onClose} style={routineModalStyles.closeButton}>
                            <X size={18} color="#6b7280"/>
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={routineModalStyles.label}>Name</Text>
                        <TextField
                            value={name}
                            onChangeText={setName}
                            placeholder="e.g. Morning workout"
                            returnKeyType="done"
                        />

                        <Text style={routineModalStyles.label}>Repeats</Text>
                        <View style={routineModalStyles.chipRow}>
                            {(['daily', 'weekly', 'monthly'] as RecurrenceFrequency[]).map(f => (
                                <TouchableOpacity
                                    key={f}
                                    style={[routineModalStyles.chip, frequency === f && routineModalStyles.chipActive]}
                                    onPress={() => setFrequency(f)}
                                >
                                    <Text style={[routineModalStyles.chipText, frequency === f && routineModalStyles.chipTextActive]}>
                                        {f.charAt(0).toUpperCase() + f.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {frequency === 'weekly' && (
                            <>
                                <Text style={routineModalStyles.label}>On these days</Text>
                                <View style={routineModalStyles.dayRow}>
                                    {DAY_LABELS.map((label, i) => (
                                        <TouchableOpacity
                                            key={i}
                                            style={[routineModalStyles.dayChip, daysOfWeek.includes(i) && routineModalStyles.dayChipActive]}
                                            onPress={() => toggleDay(i)}
                                        >
                                            <Text style={[routineModalStyles.dayChipText, daysOfWeek.includes(i) && routineModalStyles.dayChipTextActive]}>
                                                {label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        )}

                        {frequency === 'monthly' && (
                            <>
                                <Text style={routineModalStyles.label}>On day</Text>
                                <View style={routineModalStyles.monthDayGrid}>
                                    {MONTH_DAYS.map(d => (
                                        <TouchableOpacity
                                            key={d}
                                            style={[routineModalStyles.monthDayChip, dayOfMonth === d && routineModalStyles.dayChipActive]}
                                            onPress={() => setDayOfMonth(d)}
                                        >
                                            <Text style={[routineModalStyles.monthDayText, dayOfMonth === d && routineModalStyles.dayChipTextActive]}>
                                                {d}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        )}

                        <Text style={routineModalStyles.label}>Priority</Text>
                        <View style={routineModalStyles.chipRow}>
                            {(['high', 'medium', 'low'] as Priority[]).map(p => (
                                <TouchableOpacity
                                    key={p}
                                    style={[routineModalStyles.chip, priority === p && routineModalStyles.chipActive]}
                                    onPress={() => setPriority(p)}
                                >
                                    <Text style={[routineModalStyles.chipText, priority === p && routineModalStyles.chipTextActive]}>
                                        {p.charAt(0).toUpperCase() + p.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={routineModalStyles.label}>Estimated time (optional)</Text>
                        <View style={routineModalStyles.chipRow}>
                            {ESTIMATE_PRESETS.map(mins => (
                                <TouchableOpacity
                                    key={mins}
                                    style={[routineModalStyles.chip, estimatedMinutes === mins && routineModalStyles.chipActive]}
                                    onPress={() => setEstimatedMinutes(prev => prev === mins ? undefined : mins)}
                                >
                                    <Text style={[routineModalStyles.chipText, estimatedMinutes === mins && routineModalStyles.chipTextActive]}>
                                        {mins < 60 ? `${mins}m` : `${mins / 60}h`}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={routineModalStyles.label}>Steps (optional)</Text>
                        {steps.map((step, index) => (
                            <View key={step.id} style={routineModalStyles.stepRow}>
                                <TextInput
                                    ref={index === steps.length - 1 ? newStepRef : undefined}
                                    style={routineModalStyles.stepInput}
                                    value={step.text}
                                    onChangeText={text => updateStep(step.id, text)}
                                    placeholder={`Step ${index + 1}`}
                                    placeholderTextColor="#9ca3af"
                                    returnKeyType="next"
                                    onSubmitEditing={addStep}
                                />
                                <TouchableOpacity onPress={() => removeStep(step.id)} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                                    <Trash2 size={14} color="#9ca3af"/>
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TouchableOpacity style={routineModalStyles.addStepButton} onPress={addStep}>
                            <Plus size={13} color="#6b7280"/>
                            <Text style={routineModalStyles.addStepText}>Add step</Text>
                        </TouchableOpacity>

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
