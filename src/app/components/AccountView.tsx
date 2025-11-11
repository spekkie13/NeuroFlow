import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, FlatList } from 'react-native';
import { User } from '../utils/auth';
import { Account } from '../utils/types';
import {
    User as UserIcon,
    Trash2 as TrashIcon,
    Edit as EditIcon,
    LogOut as LogOutIcon,
    Plus as PlusIcon,
    Mail as MailIcon,
    Check as CheckIcon,
    X as XIcon,
} from 'lucide-react-native';

interface AccountViewProps {
    accounts: Account[];
    currentAccountId: string | null;
    onAddAccount: (name: string) => void;
    onUpdateAccount: (accountId: string, name: string) => void;
    onDeleteAccount: (accountId: string) => void;
    onSwitchAccount: (accountId: string) => void;
    user: User;
    onLogout: () => void;
}

export default function AccountView({
                                        accounts,
                                        currentAccountId,
                                        onAddAccount,
                                        onUpdateAccount,
                                        onDeleteAccount,
                                        onSwitchAccount,
                                        user,
                                        onLogout,
                                    }: AccountViewProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newAccountName, setNewAccountName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    const handleAdd = () => {
        if (!newAccountName.trim()) return;
        onAddAccount(newAccountName.trim());
        setNewAccountName('');
        setIsAdding(false);
    };

    const startEdit = (acc: Account) => {
        setEditingId(acc.id);
        setEditName(acc.name);
    };

    const handleEditSave = (accountId: string) => {
        if (!editName.trim()) return;
        onUpdateAccount(accountId, editName.trim());
        setEditingId(null);
    };

    const confirmDelete = (account: Account) => {
        if (accounts.length === 1) {
            Alert.alert('Kan niet verwijderen', 'Je moet minstens één workspace hebben.');
            return;
        }
        if (account.id === currentAccountId) {
            Alert.alert(
                'Huidige workspace',
                'Dit is je actieve workspace. Schakel eerst over naar een andere of verwijder een andere workspace.'
            );
            return;
        }

        Alert.alert(
            'Verwijderen?',
            `Workspace "${account.name}" wordt verwijderd.`,
            [
                { text: 'Annuleer', style: 'cancel' },
                {
                    text: 'Verwijder',
                    style: 'destructive',
                    onPress: () => onDeleteAccount(account.id),
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* user card */}
            <View style={styles.userCard}>
                <View style={styles.userRow}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <View style={styles.mailRow}>
                            <MailIcon size={14} color="#9CA3AF" />
                            <Text style={styles.userMail}>{user.email}</Text>
                        </View>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {user.provider === 'google' ? 'Google account' : 'Email account'}
                            </Text>
                        </View>
                    </View>
                    <Pressable onPress={onLogout} style={styles.logoutBtn}>
                        <LogOutIcon size={18} color="#DC2626" />
                        <Text style={styles.logoutText}>Log out</Text>
                    </Pressable>
                </View>
            </View>

            {/* add workspace */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Workspaces</Text>
                <Text style={styles.sectionSub}>
                    Maak meerdere om projecten te scheiden
                </Text>
            </View>

            <View style={styles.addCard}>
                {isAdding ? (
                    <View style={styles.addRow}>
                        <TextInput
                            value={newAccountName}
                            onChangeText={setNewAccountName}
                            placeholder="Workspace naam"
                            style={styles.input}
                            onSubmitEditing={handleAdd}
                        />
                        <Pressable onPress={handleAdd} style={styles.primaryBtn}>
                            <Text style={styles.primaryBtnText}>Opslaan</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                setIsAdding(false);
                                setNewAccountName('');
                            }}
                            style={styles.secondaryBtn}
                        >
                            <Text style={styles.secondaryBtnText}>Annuleer</Text>
                        </Pressable>
                    </View>
                ) : (
                    <Pressable onPress={() => setIsAdding(true)} style={styles.addTrigger}>
                        <PlusIcon size={18} color="#4B5563" />
                        <Text style={styles.addTriggerText}>Nieuwe workspace</Text>
                    </Pressable>
                )}
            </View>

            {/* list */}
            <FlatList
                data={accounts}
                keyExtractor={(item) => item.id}
                style={{ flex: 1 }}
                contentContainerStyle={{ gap: 8 }}
                renderItem={({ item }) => {
                    const isActive = item.id === currentAccountId;
                    const isEditing = item.id === editingId;
                    return (
                        <View
                            style={[
                                styles.accountRow,
                                isActive && { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
                            ]}
                        >
                            <View style={styles.accountLeft}>
                                <View
                                    style={[
                                        styles.accountIcon,
                                        isActive && { backgroundColor: '#DBEAFE' },
                                    ]}
                                >
                                    <UserIcon size={18} color={isActive ? '#1D4ED8' : '#6B7280'} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    {isEditing ? (
                                        <View style={styles.editRow}>
                                            <TextInput
                                                value={editName}
                                                onChangeText={setEditName}
                                                style={styles.editInput}
                                                autoFocus
                                                onSubmitEditing={() => handleEditSave(item.id)}
                                            />
                                            <Pressable
                                                onPress={() => handleEditSave(item.id)}
                                                style={styles.iconBtnSuccess}
                                            >
                                                <CheckIcon size={16} color="#16A34A" />
                                            </Pressable>
                                            <Pressable
                                                onPress={() => setEditingId(null)}
                                                style={styles.iconBtn}
                                            >
                                                <XIcon size={16} color="#6B7280" />
                                            </Pressable>
                                        </View>
                                    ) : (
                                        <>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={styles.accountName}>{item.name}</Text>
                                                {isActive && (
                                                    <Text style={styles.activePill}>Actief</Text>
                                                )}
                                            </View>
                                            <Text style={styles.accountMeta}>
                                                Aangemaakt{' '}
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </Text>
                                        </>
                                    )}
                                </View>
                            </View>

                            {!isEditing && (
                                <View style={styles.accountActions}>
                                    {!isActive && (
                                        <Pressable
                                            onPress={() => onSwitchAccount(item.id)}
                                            style={styles.switchBtn}
                                        >
                                            <Text style={styles.switchBtnText}>Switch</Text>
                                        </Pressable>
                                    )}
                                    <Pressable
                                        onPress={() => startEdit(item)}
                                        style={styles.iconBtn}
                                    >
                                        <EditIcon size={16} color="#6B7280" />
                                    </Pressable>
                                    <Pressable
                                        onPress={() => confirmDelete(item)}
                                        style={styles.iconBtn}
                                    >
                                        <TrashIcon size={16} color="#DC2626" />
                                    </Pressable>
                                </View>
                            )}
                        </View>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        gap: 12,
    },
    userCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    userRow: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 9999,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 18,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    mailRow: {
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
        marginTop: 2,
    },
    userMail: {
        fontSize: 13,
        color: '#6B7280',
    },
    badge: {
        marginTop: 4,
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 9999,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontSize: 11,
        color: '#1D4ED8',
        fontWeight: '500',
    },
    logoutBtn: {
        flexDirection: 'row',
        gap: 4,
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    logoutText: {
        color: '#DC2626',
        fontWeight: '500',
    },
    sectionHeader: {
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    sectionSub: {
        fontSize: 13,
        color: '#6B7280',
    },
    addCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 12,
    },
    addTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    addTriggerText: {
        color: '#4B5563',
        fontSize: 13,
        fontWeight: '500',
    },
    addRow: {
        flexDirection: 'row',
        gap: 6,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: '#FFFFFF',
    },
    primaryBtn: {
        backgroundColor: '#2563EB',
        borderRadius: 10,
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontWeight: '500',
    },
    secondaryBtn: {
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryBtnText: {
        color: '#374151',
    },
    accountRow: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    accountLeft: {
        flexDirection: 'row',
        gap: 10,
        flex: 1,
        alignItems: 'center',
    },
    accountIcon: {
        width: 36,
        height: 36,
        borderRadius: 9999,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    accountName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    accountMeta: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    activePill: {
        marginLeft: 6,
        backgroundColor: '#DBEAFE',
        color: '#1D4ED8',
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 9999,
        fontSize: 11,
        overflow: 'hidden',
    },
    accountActions: {
        flexDirection: 'row',
        gap: 6,
    },
    switchBtn: {
        backgroundColor: '#2563EB',
        borderRadius: 9999,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    switchBtnText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
    },
    iconBtn: {
        padding: 6,
        borderRadius: 9999,
        backgroundColor: '#F3F4F6',
    },
    iconBtnSuccess: {
        padding: 6,
        borderRadius: 9999,
        backgroundColor: '#ECFDF3',
    },
    editRow: {
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
    },
    editInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#FFFFFF',
    },
});
