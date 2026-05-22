import React, {RefObject, useEffect, useRef, useState} from 'react'
import {
    Animated, Modal, PanResponder,
    PanResponderInstance, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View
} from 'react-native'
import { ArrowDown, ArrowUp, CheckCircle2, ChevronsDown, ChevronsUp, Circle, Clock, Edit3, FileText, Flag, ListChecks, MoreHorizontal, Plus, Repeat2, Timer, Trash2, X } from 'lucide-react-native'
import { TaskItemProps } from "../../props/tasks/TaskItemProps"
import {formatLocalDate, formatMinutes} from "../../utils/dateUtils";
import { isOverdue } from "../../services/domain/TaskService";
import {generateId} from "../../utils/idUtils";
import {Step} from "../../models";
import {styles} from "../../styles/taskView";
import {TextField} from "../ui/TextField";
import { IconButton } from "../ui/IconButton";
import {getPriorityStyle} from "../../utils/priorityUtils";
import {MenuItem} from "../ui/MenuItem";
import Value = Animated.Value;

export const TaskItem: React.FC<TaskItemProps> = ({
    task,
    isEditing,
    editName,
    menuOpen,
    canMoveUp,
    canMoveDown,
    canMoveToTop,
    canMoveToBottom,
    showMoveActions,
    onEditNameChange,
    onSaveEdit,
    onCancelEdit,
    onToggleComplete,
    onOpenPriorityModal,
    onOpenRescheduleModal,
    onToggleMenu,
    onStartEditing,
    onMoveUp,
    onMoveDown,
    onMoveToTop,
    onMoveToBottom,
    onDelete,
    onSaveNotes,
    onSaveSteps,
    onOpenEstimateModal,
}: TaskItemProps) => {
    const [notesExpanded, setNotesExpanded] = useState(false)
    const [localNotes, setLocalNotes] = useState(task.notes || '')
    const [stepsExpanded, setStepsExpanded] = useState(false)
    const [newStepText, setNewStepText] = useState('')
    const [notesDirty, setNotesDirty] = useState(false)

    const rangeLabel: string = task.date ? formatLocalDate(task.date) : null

    const overdue: boolean = isOverdue(task)
    const steps: Step[] = task.steps ?? []

    const handleToggleStep = (id: string) => {
        onSaveSteps(steps.map((s: Step) => s.id === id ? { ...s, done: !s.done } : s))
    }

    const handleDeleteStep = (id: string) => {
        onSaveSteps(steps.filter((s: Step) => s.id !== id))
    }

    const handleAddStep = () => {
        const trimmed: string = newStepText.trim()
        if (!trimmed) return
        const newStep: Step = { id: generateId(), text: trimmed, done: false }
        onSaveSteps([...steps, newStep])
        setNewStepText('')
    }

    const doneCount: number = steps.filter((s: Step) => s.done).length

    useEffect(() => {
        setLocalNotes(task.notes || '')
        setNotesDirty(false)
    }, [task.notes])

    const cardRef: RefObject<View> = useRef<View>(null)
    const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
    const { width: screenWidth, height: screenHeight } = useWindowDimensions()

    useEffect(() => {
        if (menuOpen) {
            requestAnimationFrame(() => {
                cardRef.current?.measureInWindow((x, y, width, height) => {
                    setMenuAnchor({ x, y, width, height })
                })
            })
        } else {
            setMenuAnchor(null)
        }
    }, [menuOpen])

    // Swipe-to-complete
    const swipeAnim: Value = useRef(new Animated.Value(0)).current
    const menuOpenRef: RefObject<boolean> = useRef(menuOpen)
    const isEditingRef: RefObject<boolean> = useRef(isEditing)
    useEffect(() => { menuOpenRef.current = menuOpen }, [menuOpen])
    useEffect(() => { isEditingRef.current = isEditing }, [isEditing])

    const panResponder: PanResponderInstance = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, { dx, dy }) =>
                !menuOpenRef.current && !isEditingRef.current &&
                Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8,
            onPanResponderMove: (_, { dx }) => {
                swipeAnim.setValue(Math.max(0, dx))
            },
            onPanResponderRelease: (_, { dx }) => {
                if (dx > 80) {
                    Animated.timing(swipeAnim, { toValue: 350, duration: 150, useNativeDriver: true }).start(() => {
                        onToggleComplete()
                        swipeAnim.setValue(0)
                    })
                } else {
                    Animated.spring(swipeAnim, { toValue: 0, useNativeDriver: true }).start()
                }
            },
            onPanResponderTerminate: () => {
                Animated.spring(swipeAnim, { toValue: 0, useNativeDriver: true }).start()
            },
        })
    ).current

    return (
        <View style={[styles.taskItem, menuOpen && styles.taskItemMenuOpen]}>
            {/* Swipe background */}
            <View style={[StyleSheet.absoluteFillObject, task.completed ? styles.swipeBgUndo : styles.swipeBgComplete]}>
                <View style={styles.swipeBgContent}>
                    {task.completed
                        ? <X size={18} color="#fff" />
                        : <CheckCircle2 size={18} color="#fff" />
                    }
                    <Text style={styles.swipeBgLabel}>{task.completed ? 'Undo' : 'Done'}</Text>
                </View>
            </View>

            {/* Animated card layer */}
            <Animated.View
                style={[{ transform: [{ translateX: swipeAnim }] }, menuOpen && styles.taskItemInnerMenuOpen]}
                {...panResponder.panHandlers}
            >
                <View ref={cardRef} style={styles.taskItemInner}>
                    <View style={styles.card}>
                        <View style={styles.mainRow}>
                            {/* LEFT: title + date */}
                            <View style={styles.leftCol}>
                                {isEditing ? (
                                    <View style={styles.editRow}>
                                        <View style={{ flex: 1 }}>
                                            <TextField
                                                value={editName}
                                                onChangeText={onEditNameChange}
                                                returnKeyType="done"
                                                onSubmitEditing={onSaveEdit}
                                            />
                                        </View>
                                        <IconButton
                                            icon={<CheckCircle2 size={20} color="#16a34a" />}
                                            variant="success"
                                            onPress={onSaveEdit}
                                            accessibilityLabel="Save task name"
                                        />
                                        <IconButton
                                            icon={<X size={20} color="#6b7280" />}
                                            variant="subtle"
                                            onPress={onCancelEdit}
                                            accessibilityLabel="Cancel editing"
                                        />
                                    </View>
                                ) : (
                                    <>
                                        <View style={styles.titleRow}>
                                            <TouchableOpacity
                                                style={styles.checkbox}
                                                onPress={onToggleComplete}
                                                activeOpacity={0.7}
                                                accessibilityLabel={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                                            >
                                                {task.completed ? (
                                                    <CheckCircle2 size={22} color="#22c55e" />
                                                ) : (
                                                    <Circle size={22} color="#9ca3af" />
                                                )}
                                            </TouchableOpacity>

                                            <Text
                                                style={[styles.taskName, task.completed && styles.taskNameCompleted]}
                                                numberOfLines={2}
                                            >
                                                {task.name}
                                            </Text>
                                            {task.routineId ? (
                                                <Repeat2 size={12} color="#9ca3af" style={{ marginLeft: 4, marginTop: 2 }} />
                                            ) : null}
                                        </View>

                                        <View style={styles.dateRow}>
                                            {rangeLabel ? (
                                                <>
                                                    <Clock
                                                        size={14}
                                                        color={overdue ? '#b91c1c' : '#6b7280'}
                                                        style={{ marginRight: 4 }}
                                                    />
                                                    <Text style={[styles.dateText, overdue && styles.dateTextOverdue]}>
                                                        {overdue ? 'Overdue · ' : ''}
                                                        {rangeLabel}
                                                    </Text>
                                                    {task.estimatedMinutes ? (
                                                        <TouchableOpacity onPress={onOpenEstimateModal} activeOpacity={0.7} style={{ marginLeft: 6 }}>
                                                            <Text style={styles.estimateBadge}>~{formatMinutes(task.estimatedMinutes)}</Text>
                                                        </TouchableOpacity>
                                                    ) : null}
                                                </>
                                            ) : task.estimatedMinutes ? (
                                                <TouchableOpacity onPress={onOpenEstimateModal} activeOpacity={0.7} style={styles.estimateBadgeRow}>
                                                    <Timer size={12} color="#6b7280" style={{ marginRight: 3 }} />
                                                    <Text style={styles.estimateBadge}>~{formatMinutes(task.estimatedMinutes)}</Text>
                                                </TouchableOpacity>
                                            ) : (
                                                <View style={styles.dateRowPlaceholder} />
                                            )}
                                        </View>
                                    </>
                                )}
                            </View>

                            {/* RIGHT: priority + actions */}
                            {!isEditing && (
                                <View style={styles.rightCol}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={onOpenPriorityModal}
                                        style={[styles.priorityBadge, getPriorityStyle(task.priority, styles.priorityHigh, styles.priorityMedium, styles.priorityLow)]}
                                        accessibilityLabel="Set priority"
                                    >
                                        <Flag size={11} color="#111827" />
                                        <Text style={styles.priorityText}>{task.priority}</Text>
                                    </TouchableOpacity>

                                    <View style={styles.actionsRow}>
                                        <TouchableOpacity
                                            style={styles.stepsToggleBtn}
                                            onPress={() => setStepsExpanded(e => !e)}
                                            activeOpacity={0.7}
                                            accessibilityLabel="Toggle steps"
                                        >
                                            <ListChecks size={18} color={steps.length > 0 ? '#2563eb' : '#6b7280'} />
                                            {steps.length > 0 && (
                                                <Text style={styles.stepsCountText}>{doneCount}/{steps.length}</Text>
                                            )}
                                        </TouchableOpacity>
                                        <IconButton
                                            icon={<FileText size={18} color={task.notes ? '#2563eb' : '#6b7280'} />}
                                            variant="neutral"
                                            onPress={() => setNotesExpanded(e => !e)}
                                            accessibilityLabel="Toggle notes"
                                        />
                                        <IconButton
                                            icon={<Clock size={18} color={overdue ? '#b91c1c' : '#6b7280'} />}
                                            variant="neutral"
                                            onPress={onOpenRescheduleModal}
                                            accessibilityLabel="Schedule / reschedule task"
                                        />
                                        <IconButton
                                            icon={<MoreHorizontal size={18} color="#6b7280" />}
                                            variant="neutral"
                                            onPress={onToggleMenu}
                                            accessibilityLabel="More actions"
                                        />
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Steps area */}
                        {stepsExpanded && !isEditing && (
                            <View style={styles.stepsArea}>
                                {steps.map((step) => (
                                    <View key={step.id} style={styles.stepRow}>
                                        <TouchableOpacity
                                            style={styles.stepCheckbox}
                                            onPress={() => handleToggleStep(step.id)}
                                            activeOpacity={0.7}
                                        >
                                            {step.done
                                                ? <CheckCircle2 size={16} color="#22c55e" />
                                                : <Circle size={16} color="#9ca3af" />
                                            }
                                        </TouchableOpacity>
                                        <Text style={[styles.stepText, step.done && styles.stepTextDone]} numberOfLines={2}>
                                            {step.text}
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.stepDelete}
                                            onPress={() => handleDeleteStep(step.id)}
                                            activeOpacity={0.7}
                                        >
                                            <X size={14} color="#d1d5db" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                <View style={styles.addStepRow}>
                                    <Plus size={14} color="#9ca3af" style={{ marginRight: 6 }} />
                                    <TextInput
                                        style={styles.addStepInput}
                                        value={newStepText}
                                        onChangeText={setNewStepText}
                                        placeholder="Add a step..."
                                        placeholderTextColor="#9ca3af"
                                        returnKeyType="done"
                                        onSubmitEditing={handleAddStep}
                                    />
                                    {newStepText.trim().length > 0 && (
                                        <>
                                            <IconButton
                                                icon={<CheckCircle2 size={18} color="#16a34a" />}
                                                variant="success"
                                                onPress={handleAddStep}
                                                accessibilityLabel="Add step"
                                            />
                                            <IconButton
                                                icon={<X size={18} color="#6b7280" />}
                                                variant="subtle"
                                                onPress={() => setNewStepText('')}
                                                accessibilityLabel="Cancel step"
                                            />
                                        </>
                                    )}
                                </View>
                            </View>
                        )}

                        {/* Notes area */}
                        {notesExpanded && !isEditing && (
                            <View style={styles.notesArea}>
                                <TextInput
                                    style={styles.notesInput}
                                    value={localNotes}
                                    onChangeText={(text) => {
                                        setLocalNotes(text)
                                        setNotesDirty(true)
                                    }}
                                    placeholder="Add notes..."
                                    multiline
                                    numberOfLines={3}
                                    placeholderTextColor="#9ca3af"
                                />
                                {notesDirty && (
                                    <View style={styles.notesActions}>
                                        <IconButton
                                            icon={<CheckCircle2 size={18} color="#16a34a" />}
                                            variant="success"
                                            onPress={() => { onSaveNotes(localNotes); setNotesDirty(false) }}
                                            accessibilityLabel="Save notes"
                                        />
                                        <IconButton
                                            icon={<X size={18} color="#6b7280" />}
                                            variant="subtle"
                                            onPress={() => { setLocalNotes(task.notes || ''); setNotesDirty(false) }}
                                            accessibilityLabel="Cancel notes"
                                        />
                                    </View>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Inline menu — rendered in a Modal to escape ScrollView clipping */}
                    <Modal
                        visible={!isEditing && menuOpen && !!menuAnchor}
                        transparent
                        animationType="none"
                        onRequestClose={onToggleMenu}
                        statusBarTranslucent
                    >
                        <TouchableOpacity
                            style={StyleSheet.absoluteFillObject}
                            onPress={onToggleMenu}
                            activeOpacity={1}
                        />
                        {menuAnchor && (() => {
                            const showAbove = menuAnchor.y + menuAnchor.height > screenHeight * 0.6
                            const right = screenWidth - (menuAnchor.x + menuAnchor.width)
                            const verticalPos = showAbove
                                ? { bottom: screenHeight - menuAnchor.y + 6 }
                                : { top: menuAnchor.y + menuAnchor.height + 6 }
                            return (
                                <View style={[styles.inlineMenu, { position: 'absolute', right, ...verticalPos }]}>
                                    <MenuItem
                                        icon={<Edit3 size={16} color="#374151" />}
                                        label="Edit"
                                        onPress={onStartEditing}
                                    />
                                    <MenuItem
                                        icon={<Clock size={16} color="#374151" />}
                                        label={task.date ? 'Reschedule' : 'Schedule'}
                                        onPress={onOpenRescheduleModal}
                                    />
                                    <MenuItem
                                        icon={<Timer size={16} color="#374151" />}
                                        label={task.estimatedMinutes ? `~${formatMinutes(task.estimatedMinutes)} · Change` : 'Set estimate'}
                                        onPress={onOpenEstimateModal}
                                    />

                                    {showMoveActions && (
                                        <>
                                            <View style={styles.inlineMenuDivider} />
                                            <MenuItem
                                                icon={<ChevronsUp size={16} color={canMoveToTop ? '#374151' : '#d1d5db'} />}
                                                label="Move to top"
                                                disabled={!canMoveToTop}
                                                onPress={onMoveToTop}
                                            />
                                            <MenuItem
                                                icon={<ArrowUp size={16} color={canMoveUp ? '#374151' : '#d1d5db'} />}
                                                label="Move up"
                                                disabled={!canMoveUp}
                                                onPress={onMoveUp}
                                            />
                                            <MenuItem
                                                icon={<ArrowDown size={16} color={canMoveDown ? '#374151' : '#d1d5db'} />}
                                                label="Move down"
                                                disabled={!canMoveDown}
                                                onPress={onMoveDown}
                                            />
                                            <MenuItem
                                                icon={<ChevronsDown size={16} color={canMoveToBottom ? '#374151' : '#d1d5db'} />}
                                                label="Move to bottom"
                                                disabled={!canMoveToBottom}
                                                onPress={onMoveToBottom}
                                            />
                                        </>
                                    )}

                                    <View style={styles.inlineMenuDivider} />

                                    <MenuItem
                                        icon={<Trash2 size={16} color="#ef4444" />}
                                        label="Delete"
                                        danger
                                        onPress={onDelete}
                                    />
                                </View>
                            )
                        })()}
                    </Modal>
                </View>
            </Animated.View>
        </View>
    )
}
