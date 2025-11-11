import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { User } from '../utils/auth';
import {
    Info as InfoIcon,
    Shield as ShieldIcon,
    Mail as MailIcon,
    LogOut as LogOutIcon,
} from 'lucide-react-native';

interface SettingsViewProps {
    user: User;
    onLogout: () => void;
}

export default function SettingsView({ user, onLogout }: SettingsViewProps) {
    const version = 'v0.1.0';

    const handleContact = () => {
        // pas aan naar jouw mail
        Linking.openURL('mailto:hello@spekkieslab.app?subject=Planner%20feedback');
    };

    return (
        <View style={styles.container}>
            {/* header */}
            <View style={styles.header}>
                <Text style={styles.title}>Over deze app</Text>
                <Text style={styles.subtitle}>
                    ADHD-vriendelijke planner van Spekkie&apos;s Lab
                </Text>
            </View>

            {/* app info */}
            <View style={styles.card}>
                <View style={styles.row}>
                    <InfoIcon size={18} color="#2563EB" />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>NeuroFlow</Text>
                        <Text style={styles.cardText}>Versie {version}</Text>
                    </View>
                </View>
            </View>

            {/* data info */}
            <View style={styles.card}>
                <View style={styles.row}>
                    <ShieldIcon size={18} color="#2563EB" />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>Waar staan mijn data?</Text>
                        <Text style={styles.cardText}>
                            Op dit moment worden je workspaces, projecten en taken lokaal
                            opgeslagen op dit toestel.
                        </Text>
                        <Text style={styles.cardText}>
                            Verwijder je de app of wissel je toestel, dan kan je data
                            verdwijnen. In een latere versie komt sync.
                        </Text>
                    </View>
                </View>
            </View>

            {/* user info */}
            <View style={styles.card}>
                <Text style={styles.sectionLabel}>Ingelogd als</Text>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
            </View>

            {/* actions */}
            <View style={styles.actions}>
                <Pressable onPress={handleContact} style={styles.actionBtn}>
                    <MailIcon size={16} color="#1F2937" />
                    <Text style={styles.actionText}>Stuur feedback</Text>
                </Pressable>

                <Pressable onPress={onLogout} style={[styles.actionBtn, styles.logoutBtn]}>
                    <LogOutIcon size={16} color="#DC2626" />
                    <Text style={[styles.actionText, { color: '#DC2626' }]}>Uitloggen</Text>
                </Pressable>
            </View>

            <Text style={styles.footer}>
                Gemaakt met ❤ voor neurodivergente breinen.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        gap: 12,
    },
    header: {
        marginBottom: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    subtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-start',
    },
    cardTitle: {
        fontWeight: '600',
        color: '#111827',
    },
    cardText: {
        fontSize: 13,
        color: '#4B5563',
        marginTop: 2,
    },
    sectionLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    userEmail: {
        fontSize: 13,
        color: '#4B5563',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 4,
    },
    actionBtn: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
    },
    actionText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#1F2937',
    },
    logoutBtn: {
        backgroundColor: '#FEE2E2',
    },
    footer: {
        marginTop: 'auto',
        textAlign: 'center',
        fontSize: 12,
        color: '#9CA3AF',
    },
});
