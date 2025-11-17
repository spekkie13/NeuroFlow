import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
} from 'react-native';
import { X } from 'lucide-react-native';

type ProjectNameModalProps = {
    visible: boolean;
    initialName?: string;
    onCancel: () => void;
    onConfirm: (name: string) => void;
};

export const AddProjectModal: React.FC<ProjectNameModalProps> = ({
                                                                      visible,
                                                                      initialName,
                                                                      onCancel,
                                                                      onConfirm,
                                                                  }) => {
    const [name, setName] = useState(initialName ?? '');

    useEffect(() => {
        if (visible) {
            setName(initialName ?? '');
        }
    }, [visible, initialName]);

    const handleConfirm = () => {
        const trimmed = name.trim();
        if (!trimmed) return;
        onConfirm(trimmed);
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.title}>New project</Text>
                        <Pressable onPress={onCancel} style={styles.iconButton}>
                            <X size={20} color="#6B7280" />
                        </Pressable>
                    </View>

                    <Text style={styles.label}>Project name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g. Daily life, Work, Uni…"
                        placeholderTextColor="#9CA3AF"
                        style={styles.input}
                        autoFocus
                    />

                    <View style={styles.footer}>
                        <Pressable onPress={onCancel} style={styles.secondaryBtn}>
                            <Text style={styles.secondaryText}>Cancel</Text>
                        </Pressable>
                        <Pressable
                            onPress={handleConfirm}
                            disabled={!name.trim()}
                            style={[
                                styles.primaryBtn,
                                !name.trim() && styles.primaryBtnDisabled,
                            ]}
                        >
                            <Text style={styles.primaryText}>Create</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15,23,42,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    card: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 18,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    iconButton: {
        padding: 4,
        borderRadius: 999,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        color: '#4B5563',
        marginBottom: 6,
        marginTop: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        backgroundColor: '#F9FAFB',
        color: '#111827',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        marginTop: 16,
    },
    secondaryBtn: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 9999,
        backgroundColor: '#F3F4F6',
    },
    secondaryText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    primaryBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 9999,
        backgroundColor: '#2563EB',
    },
    primaryBtnDisabled: {
        backgroundColor: '#93C5FD',
    },
    primaryText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
