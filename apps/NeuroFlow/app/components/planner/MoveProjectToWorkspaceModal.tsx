import React from 'react'
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { X } from 'lucide-react-native'
import { Workspace } from '../../models/Workspace'

interface MoveProjectToWorkspaceModalProps {
    visible: boolean
    workspaces: Workspace[]
    currentWorkspaceId: string | null
    onConfirm: (targetWorkspaceId: string) => void
    onClose: () => void
}

export const MoveProjectToWorkspaceModal: React.FC<MoveProjectToWorkspaceModalProps> = ({
    visible,
    workspaces,
    currentWorkspaceId,
    onConfirm,
    onClose,
}) => {
    const otherWorkspaces = workspaces.filter(w => w.id !== currentWorkspaceId)

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity style={styles.sheet} activeOpacity={1} onPress={() => {}}>
                    <View style={styles.header}>
                        <View style={styles.spacer} />
                        <Text style={styles.title}>Move project to workspace</Text>
                        <TouchableOpacity onPress={onClose} hitSlop={8}>
                            <X size={18} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.list} bounces={false}>
                        {otherWorkspaces.length === 0 ? (
                            <View style={styles.emptyRow}>
                                <Text style={styles.emptyText}>No other workspaces available.</Text>
                            </View>
                        ) : (
                            otherWorkspaces.map((workspace) => (
                                <TouchableOpacity
                                    key={workspace.id}
                                    style={styles.row}
                                    onPress={() => { onConfirm(workspace.id); onClose() }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.rowText} numberOfLines={1}>{workspace.name}</Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>
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
        maxHeight: '70%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    spacer: {
        width: 18,
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginHorizontal: 8,
    },
    list: {
        flexGrow: 0,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    rowText: {
        fontSize: 14,
        color: '#374151',
    },
    emptyRow: {
        paddingVertical: 20,
        paddingHorizontal: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
    },
})
