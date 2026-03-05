import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Edit3, Trash2, Check, X, UserIcon, User } from 'lucide-react-native'
import { AppButton } from '@/app/components/ui/AppButton'
import { TextField } from '@/app/components/ui/TextField'
import { IconButton } from '@/app/components/ui/IconButton'
import { SettingsViewProps } from '@/app/props/settings.props'
import { styles } from '@/app/styles/settingsStyles'

export const SettingsView: React.FC<SettingsViewProps> = ({
                                                            workspaces,
                                                            currentWorkspaceId,
                                                            onAddWorkspace,
                                                            onUpdateWorkspace,
                                                            onDeleteWorkspace,
                                                            onSwitchWorkspace,
                                                        }) => {
    const [isAdding, setIsAdding] = useState(false)
    const [newWorkspaceName, setNewWorkspaceName] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState('')

    const handleAdd = () => {
        const trimmed = newWorkspaceName.trim()
        if (!trimmed) return
        onAddWorkspace(trimmed)
        setNewWorkspaceName('')
        setIsAdding(false)
    }

    const startEdit = (accountId: string, currentName: string) => {
        setEditingId(accountId)
        setEditName(currentName)
    }

    const handleEdit = (accountId: string) => {
        const trimmed = editName.trim()
        if (!trimmed) return
        onUpdateWorkspace(accountId, trimmed)
        setEditingId(null)
    }

    const handleCancelAdd = () => {
        setIsAdding(false)
        setNewWorkspaceName('')
    }

    return (
        <View style={styles.screen}>
            {/* SECTION HEADER */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Workspace Management</Text>
                <Text style={styles.sectionSubtitle}>
                    Manage your workspaces and switch between them
                </Text>
            </View>
            {/* LOCAL MODE INFO */}
            <View style={styles.localInfoCard}>
                <Text style={styles.localInfoTitle}>Local mode only</Text>
                <Text style={styles.localInfoText}>
                    All your workspaces and tasks are stored on this device only.
                    There is currently no account or cloud sync.
                </Text>
            </View>
            {/* ADD WORKSPACE */}
            <View style={styles.addCard}>
                <View style={styles.addTitleRow}>
                    <Text style={styles.addTitle}>Add New Workspace</Text>
                </View>

                {isAdding ? (
                    <View style={styles.addRow}>
                        <View style={styles.grow}>
                            <TextField
                                value={newWorkspaceName}
                                onChangeText={setNewWorkspaceName}
                                placeholder="Workspace name"
                                returnKeyType="done"
                                onSubmitEditing={handleAdd}
                            />
                        </View>
                        <View style={styles.addInlineActions}>
                            <AppButton
                                title="Add"
                                variant="primary"
                                size="sm"
                                onPress={handleAdd}
                                disabled={!newWorkspaceName.trim()}
                            />
                            <AppButton
                                title="Cancel"
                                variant="outline"
                                size="sm"
                                onPress={handleCancelAdd}
                            />
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.addGhostButton}
                        activeOpacity={0.8}
                        onPress={() => setIsAdding(true)}
                    >
                        <Text style={styles.addGhostText}>+ Create New Workspace</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* WORKSPACES LIST */}
            <View style={styles.listCard}>
                <View style={styles.listHeader}>
                    <Text style={styles.listHeaderTitle}>Your Workspaces</Text>
                </View>

                {workspaces.length === 0 ? (
                    <View style={styles.listEmptyState}>
                        <User
                            size={40}
                            color="#9ca3af"
                            style={styles.listEmptyIcon}
                        />
                        <Text style={styles.listEmptyTitle}>No workspaces yet</Text>
                        <Text style={styles.listEmptySubtitle}>
                            Create your first workspace to get started
                        </Text>
                    </View>
                ) : (
                    <ScrollView>
                        {workspaces.map((workspace) => {
                            const isActive = currentWorkspaceId === workspace.id
                            const isEditing = editingId === workspace.id

                            return (
                                <View
                                    key={workspace.id}
                                    style={[
                                        styles.workspaceRow,
                                        isActive && styles.workspaceRowActive,
                                    ]}
                                >
                                    {/* Avatar */}
                                    <View
                                        style={[
                                            styles.workspaceAvatar,
                                            isActive
                                                ? styles.workspaceAvatarActive
                                                : styles.workspaceAvatarDefault,
                                        ]}
                                    >
                                        <UserIcon
                                            size={18}
                                            color={isActive ? '#1d4ed8' : '#4b5563'}
                                            style={styles.workspaceAvatarIcon}
                                        />
                                    </View>

                                    {/* Text / Edit */}
                                    <View style={styles.workspaceTextContainer}>
                                        {isEditing ? (
                                            <View style={styles.inlineEditRow}>
                                                <TextField
                                                    value={editName}
                                                    onChangeText={setEditName}
                                                    placeholder="Workspace name"
                                                    returnKeyType="done"
                                                    onSubmitEditing={() => handleEdit(workspace.id)}
                                                />
                                                <IconButton
                                                    icon={<Check size={18} color="#16a34a" />}
                                                    variant="success"
                                                    onPress={() => handleEdit(workspace.id)}
                                                    accessibilityLabel="Save workspace name"
                                                />
                                                <IconButton
                                                    icon={<X size={18} color="#6b7280" />}
                                                    variant="subtle"
                                                    onPress={() => setEditingId(null)}
                                                    accessibilityLabel="Cancel editing"
                                                />
                                            </View>
                                        ) : (
                                            <>
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={() =>
                                                        !isActive && onSwitchWorkspace(workspace.id)
                                                    }
                                                >
                                                    <View style={styles.workspaceNameRow}>
                                                        <Text
                                                            style={[
                                                                styles.workspaceName,
                                                                isActive && styles.workspaceNameActive,
                                                            ]}
                                                            numberOfLines={1}
                                                        >
                                                            {workspace.name}
                                                        </Text>
                                                        {isActive && (
                                                            <View style={styles.workspaceActiveBadge}>
                                                                <Text style={styles.workspaceActiveBadgeText}>
                                                                    Active
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                </TouchableOpacity>
                                                <Text style={styles.workspaceCreatedAt}>
                                                    Created{' '}
                                                    {new Date(
                                                        workspace.createdAt,
                                                    ).toLocaleDateString()}
                                                </Text>
                                            </>
                                        )}
                                    </View>

                                    {/* Actions */}
                                    {!isEditing && (
                                        <View style={styles.workspaceActions}>
                                            {!isActive && (
                                                <AppButton
                                                    title="Switch"
                                                    variant="outline"
                                                    size="xs"
                                                    onPress={() => onSwitchWorkspace(workspace.id)}
                                                />
                                            )}
                                            <IconButton
                                                icon={<Edit3 size={18} color="#6b7280" />}
                                                variant="neutral"
                                                onPress={() =>
                                                    startEdit(workspace.id, workspace.name)
                                                }
                                                accessibilityLabel="Edit workspace"
                                            />
                                            {workspaces.length > 1 && (
                                                <IconButton
                                                    icon={<Trash2 size={18} color="#ef4444" />}
                                                    variant="danger"
                                                    onPress={() => onDeleteWorkspace(workspace.id)}
                                                    accessibilityLabel="Delete workspace"
                                                />
                                            )}
                                        </View>
                                    )}
                                </View>
                            )
                        })}
                    </ScrollView>
                )}
            </View>
        </View>
    )
}
