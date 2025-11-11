import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Project } from '../../../app/utils/types';

export function TaskHeader({
                               project,
                               focusMode,
                               onToggleFocus,
                               allProjects,
                               onSelectProject,
                           }: {
    project: Project;
    focusMode: boolean;
    onToggleFocus: () => void;
    allProjects?: Project[];
    onSelectProject?: (projectId: string) => void;
}) {
    const [open, setOpen] = React.useState(false);
    const hasOtherProjects = allProjects && allProjects.length > 0;

    return (
        <View style={[styles.header, { position: 'relative', zIndex: 200 }]}>
            <View style={{ flex: 1 }}>
                <Pressable
                    onPress={() => {
                        if (hasOtherProjects) setOpen((p) => !p);
                    }}
                    style={styles.projectButton}
                >
                    <View style={styles.projectButtonLeft}>
                        <View
                            style={[styles.projectDot, { backgroundColor: project.color }]}
                        />
                        <Text style={styles.projectButtonText} numberOfLines={1}>
                            {project.name}
                        </Text>
                    </View>
                    {hasOtherProjects ? (
                        <Text style={styles.chevron}>{open ? '▲' : '▼'}</Text>
                    ) : null}
                </Pressable>
                {hasOtherProjects && (
                    <Text style={styles.switchHint}>Kies een ander project</Text>
                )}

                {open && hasOtherProjects && (
                    <View style={styles.projectMenu}>
                        {allProjects!.map((p) => (
                            <Pressable
                                key={p.id}
                                onPress={() => {
                                    onSelectProject?.(p.id);
                                    setOpen(false);
                                }}
                                style={[
                                    styles.projectMenuItem,
                                    p.id === project.id && { backgroundColor: '#EFF6FF' },
                                ]}
                            >
                                <View
                                    style={[styles.projectDot, { backgroundColor: p.color }]}
                                />
                                <Text style={styles.projectMenuText}>{p.name}</Text>
                            </Pressable>
                        ))}
                    </View>
                )}
            </View>

            <Pressable
                onPress={onToggleFocus}
                style={[styles.focusBtn, focusMode && styles.focusBtnActive]}
            >
                <Text
                    style={[styles.focusBtnText, focusMode && styles.focusBtnTextActive]}
                >
                    {focusMode ? 'Exit focus' : 'Focus mode'}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    projectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 9999,
        paddingHorizontal: 12,
        paddingVertical: 6,
        gap: 8,
        maxWidth: 240,
    },
    projectButtonLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flex: 1,
    },
    projectButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        flexShrink: 1,
    },
    chevron: {
        fontSize: 10,
        color: '#6B7280',
    },
    switchHint: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 4,
    },
    projectMenu: {
        position: 'absolute',
        top: 50,
        left: 0,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingVertical: 4,
        minWidth: 200,
        zIndex: 9999,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    projectMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    projectMenuText: {
        fontSize: 13,
        color: '#111827',
    },
    projectDot: {
        width: 10,
        height: 10,
        borderRadius: 9999,
    },
    focusBtn: {
        backgroundColor: '#F3F4F6',
        borderRadius: 9999,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    focusBtnActive: {
        backgroundColor: '#2563EB',
    },
    focusBtnText: {
        fontSize: 13,
        color: '#1F2937',
        fontWeight: '600',
    },
    focusBtnTextActive: {
        color: '#FFFFFF',
    },
});
