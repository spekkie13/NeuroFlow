import React from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { Info, Shield, Mail, LogOut } from 'lucide-react-native';
import {SettingsViewProps} from "@/props/SettingsViewProps";
import {styles} from "@/styles/settingsView";

export default function SettingsView({ user, onLogout }: SettingsViewProps) {
    const version = 'v0.1.2';

    const handleContact = () => {
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
                    <Info size={18} color="#2563EB" />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>NeuroFlow</Text>
                        <Text style={styles.cardText}>Versie {version}</Text>
                    </View>
                </View>
            </View>

            {/* data info */}
            <View style={styles.card}>
                <View style={styles.row}>
                    <Shield size={18} color="#2563EB" />
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
                    <Mail size={16} color="#1F2937" />
                    <Text style={styles.actionText}>Stuur feedback</Text>
                </Pressable>

                <Pressable onPress={onLogout} style={[styles.actionBtn, styles.logoutBtn]}>
                    <LogOut size={16} color="#DC2626" />
                    <Text style={[styles.actionText, { color: '#DC2626' }]}>Uitloggen</Text>
                </Pressable>
            </View>

            <Text style={styles.footer}>
                Gemaakt met ❤ voor neurodivergente breinen.
            </Text>
        </View>
    );
}
