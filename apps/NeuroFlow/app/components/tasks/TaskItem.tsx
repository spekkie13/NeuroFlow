import React, {RefObject, useEffect, useRef, useState} from 'react'
import { Animated, Modal, PanResponder, PanResponderInstance, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { ArrowDown, ArrowUp, CheckCircle2, ChevronsDown, ChevronsUp, Circle, Clock, Edit3, FileText, Flag, ListChecks, MoreHorizontal, Plus, Repeat2, Timer, Trash2, X } from 'lucide-react-native'
import { TaskItemProps } from "../../props/tasks/TaskItemProps"
import {formatLocalDate, formatMinutes} from "../../utils/dateUtils";
import { isOverdue } from "../../services/domain/TaskService";
import {generateId} from "../../utils/idUtils";
import {Step} from "../../models";
import { taskItemStyles } from "../../styles/tasks/taskItem.styles";
import { IconButton, MenuItem, TextField } from "../ui";
import {getPriorityStyle} from "../../utils/priorityUtils";
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
    const [notesExpanded, setNotesExpanded] = useState<boolean>(false)
    const [localNotes, setLocalNotes] = useState<string>(task.notes || '')
    const [stepsExpanded, setStepsExpanded] = useState<boolean>(false)
    const [newStepText, setNewStepText] = useState<string>('')
    const [notesDirty, setNotesDirty] = useState<boolean>(false)

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
        <View style={[taskItemStyles.taskItem, menuOpen && taskItemStyles.taskItemMenuOpen]}>
            <View style={[StyleSheet.absoluteFillObject, task.completed ? taskItemStyles.swipeBgUndo : taskItemStyles.swipeBgComplete]}>
                <View style={taskItemStyles.swipeBgContent}>
                    {task.completed
                        ? <X size={18} color="#fff" />
                        : <CheckCircle2 size={18} color="#fff" />
                    }
                    <Text style={taskItemStyles.swipeBgLabel}>{task.completed ? 'Undo' : 'Done'}</Text>
                </View>
            </View>

            {/* Animated card layer */}
            <Animated.View
                style={[{ transform: [{ translateX: swipeAnim }] }, menuOpen && taskItemStyles.taskItemInnerMenuOpen]}
                {...panResponder.panHandlers}
            >
                <View ref={cardRef} style={taskItemStyles.taskItemInner}>
                    <View style={taskItemStyles.card}>
                        <View style={taskItemStyles.mainRow}>
                            <View style={taskItemStyles.leftCol}>
                                {isEditing ? (
                                    <View style={taskItemStyles.editRow}>
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
                                        <View style={taskItemStyles.titleRow}>
                                            <TouchableOpacity
                                                style={taskItemStyles.checkbox}
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
                                                style={[taskItemStyles.taskName, task.completed && taskItemStyles.taskNameCompleted]}
                                                numberOfLines={2}
                                            >
                                                {task.name}
                                            </Text>
                                            {task.routineId ? (
                                                <Repeat2 size={12} color="#9ca3af" style={{ marginLeft: 4, marginTop: 2 }} />
                                            ) : null}
                                        </View>

                                        <View style={taskItemStyles.dateRow}>
                                            {rangeLabel ? (
                                                <>
                                                    <Clock
                                                        size={14}
                                                        color={overdue ? '#b91c1c' : '#6b7280'}
                                                        style={{ marginRight: 4 }}
                                                    />
                                                    <Text style={[taskItemStyles.dateText, overdue && taskItemStyles.dateTextOverdue]}>
                                                        {overdue ? 'Overdue · ' : ''}
                                                        {rangeLabel}
                                                    </Text>
                                                    {task.estimatedMinutes ? (
                                                        <TouchableOpacity onPress={onOpenEstimateModal} activeOpacity={0.7} style={{ marginLeft: 6 }}>
                                                            <Text style={taskItemStyles.estimateBadge}>~{formatMinutes(task.estimatedMinutes)}</Text>
                                                        </TouchableOpacity>
                                                    ) : null}
                                                </>
                                            ) : task.estimatedMinutes ? (
                                                <TouchableOpacity onPress={onOpenEstimateModal} activeOpacity={0.7} style={taskItemStyles.estimateBadgeRow}>
                                                    <Timer size={12} color="#6b7280" style={{ marginRight: 3 }} />
                                                    <Text style={taskItemStyles.estimateBadge}>~{formatMinutes(task.estimatedMinutes)}</Text>
                                                </TouchableOpacity>
                                            ) : (
                                                <View style={taskItemStyles.dateRowPlaceholder} />
                                            )}
                                        </View>
                                    </>
                                )}
                            </View>

                            {!isEditing && (
                                <View style={taskItemStyles.rightCol}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={onOpenPriorityModal}
                                        style={[taskItemStyles.priorityBadge, getPriorityStyle(task.priority, taskItemStyles.priorityHigh, taskItemStyles.priorityMedium, taskItemStyles.priorityLow)]}
                                        accessibilityLabel="Set priority"
                                    >
                                        <Flag size={11} color="#111827" />
                                        <Text style={taskItemStyles.priorityText}>{task.priority}</Text>
                                    </TouchableOpacity>

                                    <View style={taskItemStyles.actionsRow}>
                                        <TouchableOpacity
                                            style={taskItemStyles.stepsToggleBtn}
                                            onPress={() => setStepsExpanded(e => !e)}
                                            activeOpacity={0.7}
                                            accessibilityLabel="Toggle steps"
                                        >
                                            <ListChecks size={18} color={steps.length > 0 ? '#2563eb' : '#6b7280'} />
                                            {steps.length > 0 && (
                                                <Text style={taskItemStyles.stepsCountText}>{doneCount}/{steps.length}</Text>
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

                        {stepsExpanded && !isEditing && (
                            <View style={taskItemStyles.stepsArea}>
                                {steps.map((step) => (
                                    <View key={step.id} style={taskItemStyles.stepRow}>
                                        <TouchableOpacity
                                            style={taskItemStyles.stepCheckbox}
                                            onPress={() => handleToggleStep(step.id)}
                                            activeOpacity={0.7}
                                        >
                                            {step.done
                                                ? <CheckCircle2 size={16} color="#22c55e" />
                                                : <Circle size={16} color="#9ca3af" />
                                            }
                                        </TouchableOpacity>
                                        <Text style={[taskItemStyles.stepText, step.done && taskItemStyles.stepTextDone]} numberOfLines={2}>
                                            {step.text}
                                        </Text>
                                        <TouchableOpacity
                                            style={taskItemStyles.stepDelete}
                                            onPress={() => handleDeleteStep(step.id)}
                                            activeOpacity={0.7}
                                        >
                                            <X size={14} color="#d1d5db" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                <View style={taskItemStyles.addStepRow}>
                                    <Plus size={14} color="#9ca3af" style={{ marginRight: 6 }} />
                                    <TextInput
                                        style={taskItemStyles.addStepInput}
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

                        {notesExpanded && !isEditing && (
                            <View style={taskItemStyles.notesArea}>
                                <TextInput
                                    style={taskItemStyles.notesInput}
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
                                    <View style={taskItemStyles.notesActions}>
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
                                <View style={[taskItemStyles.inlineMenu, { position: 'absolute', right, ...verticalPos }]}>
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
                                            <View style={taskItemStyles.inlineMenuDivider} />
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

                                    <View style={taskItemStyles.inlineMenuDivider} />

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
