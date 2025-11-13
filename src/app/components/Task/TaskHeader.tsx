import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { TaskHeaderProps } from "@/props/TaskHeaderProps";
import { styles } from "@/styles/taskHeader";

export function TaskHeader({ project, focusMode, onToggleFocus, allProjects, onSelectProject }: TaskHeaderProps) {
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


