import React, { useState } from 'react'
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { Edit3, Trash2, Check, X, UserIcon, User, LogOut, Mail, Bell, BellOff } from 'lucide-react-native'
import {SettingsViewProps} from "../../props/account/SettingsProps";
import {dateToHHMM, formatTime, timeToDate} from "../../utils/dateUtils";
import {styles} from "../../styles/settingsStyles";
import {TextField} from "../ui/TextField";
import {AppButton} from "../ui/AppButton";
import {IconButton} from "../ui/IconButton";
import {Workspace} from "../../models/Workspace";
import {BUDGET_PRESETS} from "../../constants/budgetConstants";

export const SettingsView: React.FC<SettingsViewProps> = ({
                                                            user,
                                                            workspaces,
                                                            currentWorkspaceId,
                                                            globalReminderTime,
                                                            onAddWorkspace,
                                                            onUpdateWorkspace,
                                                            onDeleteWorkspace,
                                                            onSwitchWorkspace,
                                                            onSetDailyBudget,
                                                            onSetGlobalReminder,
                                                            onSignOut,
                                                        } : SettingsViewProps) => {
    const currentWorkspace: Workspace = workspaces.find((w: Workspace) => w.id === currentWorkspaceId) ?? null
    const [isAdding, setIsAdding] = useState(false)
    const [newWorkspaceName, setNewWorkspaceName] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState('')
    const [showReminderPicker, setShowReminderPicker] = useState(false)
    const reminderPickerDate: Date = timeToDate(globalReminderTime ?? '09:00');

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
        <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Workspace Management</Text>
                <Text style={styles.sectionSubtitle}>
                    Manage your workspaces and switch between them
                </Text>
            </View>
            <View style={styles.profileCard}>
                <View style={styles.profileRow}>
                    <View style={styles.profileLeft}>
                        <View style={[styles.avatar, { backgroundColor: '#2563eb' }]}>
                            <Text style={styles.avatarText}>
                                {user.name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName} numberOfLines={1}>{user.name}</Text>
                            <View style={styles.profileEmailRow}>
                                <Mail size={12} color="#9ca3af" style={styles.profileEmailIcon} />
                                <Text style={styles.profileEmail} numberOfLines={1}>{user.email}</Text>
                            </View>
                            <View style={styles.providerBadgeRow}>
                                <View style={styles.providerBadge}>
                                    <Text style={styles.providerBadgeText}>
                                        {user.provider === 'google' ? 'Google' : 'Email'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.signOutButton} onPress={onSignOut} activeOpacity={0.8}>
                        <LogOut size={14} color="#b91c1c" />
                        <Text style={styles.signOutText}>Sign out</Text>
                    </TouchableOpacity>
                </View>
            </View>
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

            {currentWorkspace && (
                <View style={styles.addCard}>
                    <View style={styles.addTitleRow}>
                        <Text style={styles.addTitle}>Daily time budget</Text>
                    </View>
                    <Text style={styles.budgetSubtitle}>
                        How much time do you have available today? The timeline will warn you when you exceed it.
                    </Text>
                    <View style={styles.budgetRow}>
                        {BUDGET_PRESETS.map(({ label, minutes }) => {
                            const isActive: boolean = (currentWorkspace.dailyMinutes ?? null) === minutes
                            return (
                                <TouchableOpacity
                                    key={label}
                                    style={[styles.budgetChip, isActive && styles.budgetChipActive]}
                                    onPress={() => onSetDailyBudget(currentWorkspace.id, minutes)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.budgetChipText, isActive && styles.budgetChipTextActive]}>
                                        {label}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>
            )}

            <View style={styles.addCard}>
                <View style={styles.addTitleRow}>
                    <Bell size={14} color="#111827" style={styles.addTitleIcon} />
                    <Text style={styles.addTitle}>Daily notification reminder</Text>
                </View>
                <Text style={styles.budgetSubtitle}>
                    Get a daily reminder to work on your tasks. Projects can override this time individually.
                </Text>
                <View style={styles.reminderRow}>
                    <TouchableOpacity
                        style={[styles.reminderTimeButton, globalReminderTime && styles.reminderTimeButtonActive]}
                        onPress={() => setShowReminderPicker(true)}
                        activeOpacity={0.7}
                    >
                        <Bell size={14} color={globalReminderTime ? '#2563eb' : '#6b7280'} />
                        <Text style={[styles.reminderTimeText, globalReminderTime && styles.reminderTimeTextActive]}>
                            {globalReminderTime ? formatTime(globalReminderTime) : 'Set time'}
                        </Text>
                    </TouchableOpacity>
                    {globalReminderTime && (
                        <TouchableOpacity
                            style={styles.reminderOffButton}
                            onPress={() => onSetGlobalReminder(null)}
                            activeOpacity={0.7}
                        >
                            <BellOff size={14} color="#6b7280" />
                            <Text style={styles.reminderOffText}>Turn off</Text>
                        </TouchableOpacity>
                    )}
                </View>
                {showReminderPicker && (
                    <DateTimePicker
                        mode="time"
                        value={reminderPickerDate}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event: DateTimePickerEvent, date?: Date) => {
                            if (Platform.OS !== 'ios') setShowReminderPicker(false)
                            if (event.type === 'dismissed') { setShowReminderPicker(false); return }
                            if (date) onSetGlobalReminder(dateToHHMM(date))
                        }}
                    />
                )}
                {Platform.OS === 'ios' && showReminderPicker && (
                    <TouchableOpacity
                        style={styles.reminderDoneButton}
                        onPress={() => setShowReminderPicker(false)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.reminderDoneText}>Done</Text>
                    </TouchableOpacity>
                )}
            </View>

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
                    <View>
                        {workspaces.map((workspace: Workspace) => {
                            const isActive: boolean = currentWorkspaceId === workspace.id
                            const isEditing: boolean = editingId === workspace.id

                            return (
                                <View
                                    key={workspace.id}
                                    style={[
                                        styles.workspaceRow,
                                        isActive && styles.workspaceRowActive,
                                    ]}
                                >
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
                    </View>
                )}
            </View>
        </ScrollView>
    )
}
