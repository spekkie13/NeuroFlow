import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, SafeAreaView } from 'react-native';
import Planner from './components/Planner';
import AuthScreen from './components/AuthScreen';
import { User, saveCurrentUser, getCurrentUser } from './utils/auth';

export default function App() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await getCurrentUser(); // now awaited
                setCurrentUser(user);
            } catch (error) {
                console.error('Failed to load current user:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const handleLogin = (user: User) => {
        saveCurrentUser(user);
        setCurrentUser(user);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        // eventueel ook: saveCurrentUser(null) als je dat in je util ondersteunt
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (!currentUser) {
        return <AuthScreen onLogin={handleLogin} />;
    }

    return (
        <SafeAreaView style={styles.appContainer}>
            <Planner user={currentUser} onLogout={handleLogout} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: '#4B5563',
    },
});
