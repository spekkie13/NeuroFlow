import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import {AuthScreen} from "./components/auth/AuthScreen";
import Planner from "./components/planner/Planner";
import {useAuth} from "./hooks/useAuth";

const App: React.FC = () => {
    const { user, isLoading, error, signInWithGoogle, signIn, signUp, signOut, clearError } = useAuth()

    if (isLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        )
    }

    if (!user) {
        return (
            <AuthScreen
                onSignInWithGoogle={signInWithGoogle}
                onSubmitEmail={({ mode, email, password, name }) => {
                    clearError()
                    if (mode === 'login') {
                        signIn(email, password)
                    } else {
                        signUp(email, password, name ?? '')
                    }
                }}
                error={error}
                isLoading={isLoading}
            />
        )
    }

    return <Planner user={user} onSignOut={signOut} />
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
    },
})

export { App }
