import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { AuthScreenProps, Mode } from "@/app/props/auth/AuthScreenProps";
import { styles } from "@/app/styles/auth/authScreen";

export const AuthScreen: React.FC<AuthScreenProps> = ({
                                                          onSubmitEmail,
                                                          onSubmitGoogle,
                                                          error,
                                                          isLoading,
                                                      }: AuthScreenProps) => {
    const [mode, setMode] = useState<Mode>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const handleSubmit = () => {
        onSubmitEmail({
            mode,
            email,
            password,
            name: mode === 'signup' ? name : undefined,
        })
    }

    const isFormValid =
        email.trim().length > 0 &&
        password.trim().length >= 6 &&
        (mode === 'login' || name.trim().length > 0)

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onSubmitGoogle} style={styles.googleButton}>
                <Text>Continue with Google</Text>
            </TouchableOpacity>

            {/* Error */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Email form */}
            {mode === 'signup' && (
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Full name"
                    style={styles.input}
                />
            )}
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
            />
            <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••••"
                style={styles.input}
            />

            <TouchableOpacity
                onPress={handleSubmit}
                disabled={!isFormValid || isLoading}
                style={[styles.submitButton, (!isFormValid || isLoading) && styles.submitDisabled]}
            >
                <Text style={styles.submitText}>
                    {mode === 'login' ? 'Log In' : 'Create Account'}
                </Text>
            </TouchableOpacity>

            {/* Mode switch */}
            <TouchableOpacity
                onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
            >
                <Text>
                    {mode === 'login' ? 'No account? Sign up' : 'Already have an account? Log in'}
                </Text>
            </TouchableOpacity>
        </View>
    )
}
