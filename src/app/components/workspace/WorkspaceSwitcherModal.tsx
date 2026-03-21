import React, { useState } from 'react'
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { Check, Plus, X } from 'lucide-react-native'
import { Workspace } from '@/app/models/Workspace'

interface WorkspaceSwitcherModalProps {
    visible: boolean
    workspaces: Workspace[]
    currentWorkspaceId: string | null
    onSwitch: (id: string) => void
    onAdd: (name: string) => void
    onClose: () => void
}

export const WorkspaceSwitcherModal: React.FC<WorkspaceSwitcherModalProps> = ({
    visible,
    workspaces,
    currentWorkspaceId,
    onSwitch,
    onAdd,
    onClose,
}) => {
    const [isAdding, setIsAdding] = useState(false)
    const [newName, setNewName] = useState('')

    const handleAdd = () => {
        const trimmed = newName.trim()
        if (!trimmed) return
        onAdd(trimmed)
        setNewName('')
        setIsAdding(false)
    }

    const handleClose = () => {
        setIsAdding(false)
        setNewName('')
        onClose()
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleClose}>
                <TouchableOpacity style={styles.sheet} activeOpacity={1} onPress={() => {}}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Switch workspace</Text>
                        <TouchableOpacity onPress={handleClose} hitSlop={8}>
                            <X size={18} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Workspace list */}
                    {workspaces.map((workspace) => {
                        const isActive = workspace.id === currentWorkspaceId
                        return (
                            <TouchableOpacity
                                key={workspace.id}
                                style={[styles.row, isActive && styles.rowActive]}
                                onPress={() => {
                                    if (!isActive) onSwitch(workspace.id)
                                    handleClose()
                                }}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[styles.rowText, isActive && styles.rowTextActive]}
                                    numberOfLines={1}
                                >
                                    {workspace.name}
                                </Text>
                                {isActive && <Check size={16} color="#2563eb" />}
                            </TouchableOpacity>
                        )
                    })}

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* New workspace */}
                    {isAdding ? (
                        <View style={styles.addRow}>
                            <TextInput
                                style={styles.input}
                                value={newName}
                                onChangeText={setNewName}
                                placeholder="Workspace name"
                                placeholderTextColor="#9ca3af"
                                autoFocus
                                returnKeyType="done"
                                onSubmitEditing={handleAdd}
                            />
                            <TouchableOpacity
                                style={[styles.addConfirm, !newName.trim() && styles.addConfirmDisabled]}
                                onPress={handleAdd}
                                disabled={!newName.trim()}
                            >
                                <Text style={styles.addConfirmText}>Add</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setIsAdding(false); setNewName('') }} hitSlop={8}>
                                <X size={16} color="#9ca3af" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.newWorkspaceButton}
                            onPress={() => setIsAdding(true)}
                            activeOpacity={0.7}
                        >
                            <Plus size={15} color="#2563eb" />
                            <Text style={styles.newWorkspaceText}>New workspace</Text>
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.35)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 32,
        borderTopWidth: 1,
        borderColor: '#e5e7eb',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    rowActive: {
        backgroundColor: '#eff6ff',
    },
    rowText: {
        fontSize: 14,
        color: '#374151',
        flexShrink: 1,
    },
    rowTextActive: {
        fontWeight: '600',
        color: '#1d4ed8',
    },
    divider: {
        height: 1,
        backgroundColor: '#f3f4f6',
        marginVertical: 8,
    },
    newWorkspaceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    newWorkspaceText: {
        fontSize: 14,
        color: '#2563eb',
        fontWeight: '500',
    },
    addRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#111827',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 7,
        backgroundColor: '#f9fafb',
    },
    addConfirm: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 8,
        backgroundColor: '#2563eb',
    },
    addConfirmDisabled: {
        backgroundColor: '#93c5fd',
    },
    addConfirmText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#ffffff',
    },
})