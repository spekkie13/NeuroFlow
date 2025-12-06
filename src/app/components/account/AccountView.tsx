// /components/account/AccountView.tsx
import React, { useMemo, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import {
    User as UserIcon,
    LogOut,
    Plus,
    Edit3,
    Trash2,
    Mail,
    Check,
    X,
} from 'lucide-react-native'
import { AccountViewProps } from '../../props/account.props'
import { accountStyles as styles } from '../../styles/account.styles'
import { AppButton } from '../ui/AppButton'
import { TextField } from '../ui/TextField'
import { IconButton } from '../ui/IconButton'

export const AccountView: React.FC<AccountViewProps> = ({
                                                            accounts,
                                                            currentAccountId,
                                                            onAddAccount,
                                                            onUpdateAccount,
                                                            onDeleteAccount,
                                                            onSwitchAccount,
                                                            user,
                                                            onLogout,
                                                        }) => {
    const [isAdding, setIsAdding] = useState(false)
    const [newAccountName, setNewAccountName] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState('')

    const initial = useMemo(
        () => (user?.name ? user.name.charAt(0).toUpperCase() : 'U'),
        [user?.name],
    )

    const handleAdd = () => {
        const trimmed = newAccountName.trim()
        if (!trimmed) return
        onAddAccount(trimmed)
        setNewAccountName('')
        setIsAdding(false)
    }

    const startEdit = (accountId: string, currentName: string) => {
        setEditingId(accountId)
        setEditName(currentName)
    }

    const handleEdit = (accountId: string) => {
        const trimmed = editName.trim()
        if (!trimmed) return
        onUpdateAccount(accountId, trimmed)
        setEditingId(null)
    }

    const handleCancelAdd = () => {
        setIsAdding(false)
        setNewAccountName('')
    }

    const handleLogoutPress = () => {
        onLogout()
    }

    return (
        <View style={styles.screen}>
            {/* PROFILE */}
            <View style={styles.profileCard}>
                <View style={styles.profileRow}>
                    <View style={styles.profileLeft}>
                        <View
                            style={[
                                styles.avatar,
                                { backgroundColor: '#2563eb' }, // primaire kleur
                            ]}
                        >
                            <Text style={styles.avatarText}>{initial}</Text>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{user.name}</Text>

                            <View style={styles.profileEmailRow}>
                                <Mail
                                    size={14}
                                    color="#9ca3af"
                                    style={styles.profileEmailIcon}
                                />
                                <Text style={styles.profileEmail}>{user.email}</Text>
                            </View>

                            <View style={styles.providerBadgeRow}>
                                <View style={styles.providerBadge}>
                                    <Text style={styles.providerBadgeText}>
                                        {user.provider === 'google'
                                            ? 'Google Account'
                                            : 'Email Account'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <AppButton
                        title="Log out"
                        variant="danger"
                        size="sm"
                        onPress={handleLogoutPress}
                        leftIcon={<LogOut size={16} color="#dc2626" />}
                    />
                </View>
            </View>

            {/* SECTION HEADER */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Workspace Management</Text>
                <Text style={styles.sectionSubtitle}>
                    Manage your workspaces and switch between them
                </Text>
            </View>

            {/* ADD WORKSPACE */}
            <View style={styles.addCard}>
                <View style={styles.addTitleRow}>
                    <Plus size={18} color="#111827" style={styles.addTitleIcon} />
                    <Text style={styles.addTitle}>Add New Workspace</Text>
                </View>

                {isAdding ? (
                    <View style={styles.addRow}>
                        <View style={styles.grow}>
                            <TextField
                                value={newAccountName}
                                onChangeText={setNewAccountName}
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
                                disabled={!newAccountName.trim()}
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

                {accounts.length === 0 ? (
                    <View style={styles.listEmptyState}>
                        <UserIcon
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
                        {accounts.map((account) => {
                            const isActive = currentAccountId === account.id
                            const isEditing = editingId === account.id

                            return (
                                <View
                                    key={account.id}
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
                                                    onSubmitEditing={() => handleEdit(account.id)}
                                                />
                                                <IconButton
                                                    icon={<Check size={18} color="#16a34a" />}
                                                    variant="success"
                                                    onPress={() => handleEdit(account.id)}
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
                                                        !isActive && onSwitchAccount(account.id)
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
                                                            {account.name}
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
                                                        account.createdAt,
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
                                                    onPress={() => onSwitchAccount(account.id)}
                                                />
                                            )}
                                            <IconButton
                                                icon={<Edit3 size={18} color="#6b7280" />}
                                                variant="neutral"
                                                onPress={() =>
                                                    startEdit(account.id, account.name)
                                                }
                                                accessibilityLabel="Edit workspace"
                                            />
                                            {accounts.length > 1 && (
                                                <IconButton
                                                    icon={<Trash2 size={18} color="#ef4444" />}
                                                    variant="danger"
                                                    onPress={() => onDeleteAccount(account.id)}
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
