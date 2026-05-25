import React, { useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Mail, Lock, User, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react-native'

// Required by expo-web-browser for iOS to properly close the auth session
import * as WebBrowser from 'expo-web-browser'
import {AuthScreenProps, Mode} from "../../props/auth/AuthScreenProps";
import {TextField} from "../ui/TextField";
import {AppButton} from "../ui/AppButton";
import {GoogleIcon} from "../ui/GoogleIcon";
import { authScreenStyles } from "../../styles/auth/authScreen.styles";
WebBrowser.maybeCompleteAuthSession()

export const AuthScreen: React.FC<AuthScreenProps> = ({
    onSignInWithGoogle,
    onSubmitEmail,
    error,
    isLoading,
}: AuthScreenProps) => {
    const [emailExpanded, setEmailExpanded] = useState(false)
    const [mode, setMode] = useState<Mode>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const isSignup: boolean = mode === 'signup'
    const canSubmit = email.trim() && password.trim() && (!isSignup || name.trim())

    const handleSubmit = () => {
        if (!canSubmit || isLoading) return
        onSubmitEmail({ mode, email: email.trim(), password, name: name.trim() || undefined })
    }

    const switchMode = () => setMode(m => m === 'login' ? 'signup' : 'login')

    return (
        <KeyboardAvoidingView
            style={authScreenStyles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={authScreenStyles.scroll}
                keyboardShouldPersistTaps="handled"
            >
                <View style={authScreenStyles.header}>
                    <View style={authScreenStyles.logoMark}>
                        <Text style={authScreenStyles.logoText}>N</Text>
                    </View>
                    <Text style={authScreenStyles.appName}>NeuroFlow</Text>
                    <Text style={authScreenStyles.tagline}>Your tasks, everywhere you go</Text>
                </View>

                <View style={authScreenStyles.card}>
                    {error ? (
                        <View style={authScreenStyles.errorBanner}>
                            <AlertCircle size={15} color="#b91c1c" style={authScreenStyles.errorIcon} />
                            <Text style={authScreenStyles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <TouchableOpacity
                        style={authScreenStyles.googleButton}
                        onPress={onSignInWithGoogle}
                        activeOpacity={0.85}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#374151" />
                        ) : (
                            <>
                                <GoogleIcon />
                                <Text style={authScreenStyles.googleLabel}>Continue with Google</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <View style={authScreenStyles.dividerRow}>
                        <View style={authScreenStyles.dividerLine} />
                        <Text style={authScreenStyles.dividerText}>or</Text>
                        <View style={authScreenStyles.dividerLine} />
                    </View>

                    <TouchableOpacity
                        style={authScreenStyles.emailToggle}
                        onPress={() => setEmailExpanded(e => !e)}
                        activeOpacity={0.7}
                    >
                        <Mail size={15} color="#6b7280" />
                        <Text style={authScreenStyles.emailToggleText}>
                            {isSignup ? 'Sign up with email' : 'Sign in with email'}
                        </Text>
                        {emailExpanded
                            ? <ChevronUp size={15} color="#9ca3af" />
                            : <ChevronDown size={15} color="#9ca3af" />
                        }
                    </TouchableOpacity>

                    {emailExpanded && (
                        <View style={authScreenStyles.emailForm}>
                            {isSignup && (
                                <TextField
                                    label="Name"
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Your name"
                                    autoCapitalize="words"
                                    returnKeyType="next"
                                    leftIcon={<User size={16} color="#9ca3af" />}
                                />
                            )}
                            <TextField
                                label="Email"
                                value={email}
                                onChangeText={setEmail}
                                placeholder="you@example.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="next"
                                leftIcon={<Mail size={16} color="#9ca3af" />}
                                containerStyle={isSignup ? authScreenStyles.fieldGap : undefined}
                            />
                            <TextField
                                label="Password"
                                value={password}
                                onChangeText={setPassword}
                                placeholder="••••••••"
                                secureTextEntry
                                returnKeyType="done"
                                onSubmitEditing={handleSubmit}
                                leftIcon={<Lock size={16} color="#9ca3af" />}
                                containerStyle={authScreenStyles.fieldGap}
                            />
                            <AppButton
                                title={isSignup ? 'Create account' : 'Sign in'}
                                variant="primary"
                                size="lg"
                                fullWidth
                                disabled={!canSubmit || !!isLoading}
                                onPress={handleSubmit}
                                style={authScreenStyles.emailSubmit}
                            />
                            <TouchableOpacity style={authScreenStyles.modeToggle} onPress={switchMode} activeOpacity={0.7}>
                                <Text style={authScreenStyles.modeToggleText}>
                                    {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                                    <Text style={authScreenStyles.modeToggleLink}>
                                        {isSignup ? 'Sign in' : 'Sign up'}
                                    </Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <Text style={authScreenStyles.footer}>
                    By continuing you agree to our Terms of Service and Privacy Policy.
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
