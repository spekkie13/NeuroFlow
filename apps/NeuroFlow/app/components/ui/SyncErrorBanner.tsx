import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {AlertCircle} from 'lucide-react-native'

interface SyncErrorBannerProps {
    workspaceError: string | null
    projectError: string | null
}

export const SyncErrorBanner: React.FC<SyncErrorBannerProps> = ({ workspaceError, projectError }: SyncErrorBannerProps) => {
    if (!workspaceError && !projectError) return null

    return (
        <View style={styles.container}>
            <AlertCircle size={14} color="#b91c1c" style={styles.icon}/>
            <View style={styles.messages}>
                {workspaceError && (
                    <Text style={styles.text}>{workspaceError}</Text>
                )}
                {projectError && (
                    <Text style={styles.text}>{projectError}</Text>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fef2f2',
        borderBottomWidth: 1,
        borderBottomColor: '#fecaca',
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 8,
    },
    icon: {
        marginTop: 1,
        flexShrink: 0,
    },
    messages: {
        flex: 1,
        gap: 2,
    },
    text: {
        fontSize: 12,
        color: '#b91c1c',
        lineHeight: 16,
    },
})
