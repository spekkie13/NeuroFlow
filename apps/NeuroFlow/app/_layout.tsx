import React from 'react'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

interface ErrorBoundaryState {
    error: Error | null
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error }
    }

    render() {
        if (this.state.error) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>Something went wrong</Text>
                    <ScrollView>
                        <Text style={styles.errorMessage}>{this.state.error.message}</Text>
                        <Text style={styles.errorStack}>{this.state.error.stack}</Text>
                    </ScrollView>
                </View>
            )
        }
        return this.props.children
    }
}

export default function RootLayout() {
    return (
        <ErrorBoundary>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }} />
            </GestureHandlerRootView>
        </ErrorBoundary>
    )
}

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        padding: 24,
        paddingTop: 60,
        backgroundColor: '#fff',
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#dc2626',
        marginBottom: 12,
    },
    errorMessage: {
        fontSize: 14,
        color: '#111827',
        marginBottom: 8,
    },
    errorStack: {
        fontSize: 11,
        color: '#6b7280',
        fontFamily: 'monospace',
    },
})