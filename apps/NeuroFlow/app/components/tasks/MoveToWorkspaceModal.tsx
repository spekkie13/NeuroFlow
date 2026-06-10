import React, { useState } from 'react'
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { ArrowLeft, X } from 'lucide-react-native'
import { Project } from '../../models'
import { Workspace } from '../../models/Workspace'

interface MoveToWorkspaceModalProps {
    visible: boolean
    workspaces: Workspace[]
    currentWorkspaceId: string | null
    onLoadProjects: (workspaceId: string) => Promise<Project[]>
    onConfirm: (targetWorkspaceId: string, targetProjectId: string) => void
    onClose: () => void
}

type Step = 'workspace' | 'project'

export const MoveToWorkspaceModal: React.FC<MoveToWorkspaceModalProps> = ({
    visible,
    workspaces,
    currentWorkspaceId,
    onLoadProjects,
    onConfirm,
    onClose,
}: MoveToWorkspaceModalProps) => {
    const [step, setStep] = useState<Step>('workspace')
    const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null)
    const [targetProjects, setTargetProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(false)

    const handleClose = () => {
        setStep('workspace')
        setSelectedWorkspace(null)
        setTargetProjects([])
        onClose()
    }

    const handleSelectWorkspace = async (workspace: Workspace) => {
        setLoading(true)
        const projects = await onLoadProjects(workspace.id)
        setTargetProjects(projects)
        setSelectedWorkspace(workspace)
        setStep('project')
        setLoading(false)
    }

    const handleBack = () => {
        setStep('workspace')
        setSelectedWorkspace(null)
        setTargetProjects([])
    }

    const handleSelectProject = (projectId: string) => {
        if (!selectedWorkspace) return
        onConfirm(selectedWorkspace.id, projectId)
        handleClose()
    }

    const title = step === 'workspace' ? 'Move to workspace' : selectedWorkspace?.name ?? 'Select project'

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleClose}>
                <TouchableOpacity style={styles.sheet} activeOpacity={1} onPress={() => {}}>
                    <View style={styles.header}>
                        {step === 'project' ? (
                            <TouchableOpacity onPress={handleBack} hitSlop={8} style={styles.backButton}>
                                <ArrowLeft size={18} color="#6b7280" />
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.backButton} />
                        )}
                        <Text style={styles.title} numberOfLines={1}>{title}</Text>
                        <TouchableOpacity onPress={handleClose} hitSlop={8}>
                            <X size={18} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.loadingRow}>
                            <ActivityIndicator size="small" color="#2563eb" />
                        </View>
                    ) : step === 'workspace' ? (
                        <ScrollView style={styles.list} bounces={false}>
                            {workspaces.map((workspace) => {
                                const isCurrent = workspace.id === currentWorkspaceId
                                return (
                                    <TouchableOpacity
                                        key={workspace.id}
                                        style={styles.row}
                                        onPress={() => handleSelectWorkspace(workspace)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.rowText} numberOfLines={1}>
                                            {workspace.name}
                                        </Text>
                                        {isCurrent && (
                                            <Text style={styles.currentLabel}>current</Text>
                                        )}
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    ) : (
                        <ScrollView style={styles.list} bounces={false}>
                            {targetProjects.length === 0 ? (
                                <View style={styles.emptyRow}>
                                    <Text style={styles.emptyText}>
                                        No projects in this workspace yet.
                                    </Text>
                                </View>
                            ) : (
                                targetProjects.map((project) => (
                                    <TouchableOpacity
                                        key={project.id}
                                        style={styles.row}
                                        onPress={() => handleSelectProject(project.id)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.projectDot, { backgroundColor: project.color }]} />
                                        <View style={styles.projectInfo}>
                                            <Text style={styles.rowText} numberOfLines={1}>
                                                {project.name}
                                            </Text>
                                            <Text style={styles.metaText}>
                                                {project.tasks.length} task{project.tasks.length !== 1 ? 's' : ''}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
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
        maxHeight: '70%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    backButton: {
        width: 24,
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
        gap: 10,
    },
    rowText: {
        fontSize: 14,
        color: '#374151',
        flexShrink: 1,
    },
    currentLabel: {
        fontSize: 11,
        color: '#9ca3af',
        marginLeft: 4,
    },
    projectDot: {
        width: 8,
        height: 8,
        borderRadius: 999,
        flexShrink: 0,
    },
    projectInfo: {
        flex: 1,
    },
    metaText: {
        fontSize: 11,
        color: '#9ca3af',
        marginTop: 1,
    },
    loadingRow: {
        paddingVertical: 24,
        alignItems: 'center',
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
