import React from 'react'
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native'
import { AuthProvider, useAuth } from '@/app/hooks/useAuth'
import { Planner } from '@/app/components/Planner'
import {AuthScreenContainer} from "@/app/components/auth/AuthScreenContainer";

const Root: React.FC = () => {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        )
    }

    if (!user) {
        return <AuthScreenContainer />
    }

    return <Planner user={user} />
}

export const App: React.FC = () => {
    return (
        <AuthProvider>
            <Root />
        </AuthProvider>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
