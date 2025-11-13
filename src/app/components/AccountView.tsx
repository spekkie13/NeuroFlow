import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, FlatList } from 'react-native';
import { Account } from '../utils/types';
import { User, Trash, Edit, LogOut, Plus, Mail, Check, X } from 'lucide-react-native';
import {AccountViewProps} from "@/props/AccountViewProps";
import {styles} from "@/styles/accountView";

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
                {text: 'Annuleer', style: 'cancel'},
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
                    <View style={{flex: 1}}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <View style={styles.mailRow}>
                            <Mail size={14} color="#9CA3AF"/>
                            <Text style={styles.userMail}>{user.email}</Text>
                        </View>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {user.provider === 'google' ? 'Google account' : 'Email account'}
                            </Text>
                        </View>
                    </View>
                    <Pressable onPress={onLogout} style={styles.logoutBtn}>
                        <LogOut size={18} color="#DC2626"/>
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
                        <Plus size={18} color="#4B5563"/>
                        <Text style={styles.addTriggerText}>Nieuwe workspace</Text>
                    </Pressable>
                )}
            </View>

            {/* list */}
            <FlatList
                data={accounts}
                keyExtractor={(item) => item.id}
                style={{flex: 1}}
                contentContainerStyle={{gap: 8}}
                renderItem={({item}) => {
                    const isActive = item.id === currentAccountId;
                    const isEditing = item.id === editingId;
                    return (
                        <View
                            style={[
                                styles.accountRow,
                                isActive && {borderColor: '#2563EB', backgroundColor: '#EFF6FF'},
                            ]}
                        >
                            <View style={styles.accountLeft}>
                                <View
                                    style={[
                                        styles.accountIcon,
                                        isActive && {backgroundColor: '#DBEAFE'},
                                    ]}
                                >
                                    <User size={18} color={isActive ? '#1D4ED8' : '#6B7280'}/>
                                </View>
                                <View style={{flex: 1}}>
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
                                                <Check size={16} color="#16A34A"/>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => setEditingId(null)}
                                                style={styles.iconBtn}
                                            >
                                                <X size={16} color="#6B7280"/>
                                            </Pressable>
                                        </View>
                                    ) : (
                                        <>
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                                        <Edit size={16} color="#6B7280"/>
                                    </Pressable>
                                    <Pressable
                                        onPress={() => confirmDelete(item)}
                                        style={styles.iconBtn}
                                    >
                                        <Trash size={16} color="#DC2626"/>
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
