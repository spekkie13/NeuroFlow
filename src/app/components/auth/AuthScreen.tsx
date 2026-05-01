import React, { useState } from 'react'
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { Mail, Lock, User, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react-native'
import { TextField } from '@/app/components/ui/TextField'
import { AppButton } from '@/app/components/ui/AppButton'
import { AuthScreenProps, Mode } from '@/app/props/auth/AuthScreenProps'

// Required by expo-web-browser for iOS to properly close the auth session
import * as WebBrowser from 'expo-web-browser'
WebBrowser.maybeCompleteAuthSession()

export const AuthScreen: React.FC<AuthScreenProps> = ({
    onSignInWithGoogle,
    onSubmitEmail,
    error,
    isLoading,
}) => {
    const [emailExpanded, setEmailExpanded] = useState(false)
    const [mode, setMode] = useState<Mode>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const isSignup = mode === 'signup'
    const canSubmit = email.trim() && password.trim() && (!isSignup || name.trim())

    const handleSubmit = () => {
        if (!canSubmit || isLoading) return
        onSubmitEmail({ mode, email: email.trim(), password, name: name.trim() || undefined })
    }

    const switchMode = () => setMode(m => m === 'login' ? 'signup' : 'login')

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
            >
                {/* Logo */}
                <View style={styles.header}>
                    <View style={styles.logoMark}>
                        <Text style={styles.logoText}>N</Text>
                    </View>
                    <Text style={styles.appName}>NeuroFlow</Text>
                    <Text style={styles.tagline}>Your tasks, everywhere you go</Text>
                </View>

                {/* Card */}
                <View style={styles.card}>
                    {error ? (
                        <View style={styles.errorBanner}>
                            <AlertCircle size={15} color="#b91c1c" style={styles.errorIcon} />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {/* Google — primary CTA */}
                    <TouchableOpacity
                        style={styles.googleButton}
                        onPress={onSignInWithGoogle}
                        activeOpacity={0.85}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#374151" />
                        ) : (
                            <>
                                <GoogleIcon />
                                <Text style={styles.googleLabel}>Continue with Google</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.dividerRow}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Email — collapsible secondary */}
                    <TouchableOpacity
                        style={styles.emailToggle}
                        onPress={() => setEmailExpanded(e => !e)}
                        activeOpacity={0.7}
                    >
                        <Mail size={15} color="#6b7280" />
                        <Text style={styles.emailToggleText}>
                            {isSignup ? 'Sign up with email' : 'Sign in with email'}
                        </Text>
                        {emailExpanded
                            ? <ChevronUp size={15} color="#9ca3af" />
                            : <ChevronDown size={15} color="#9ca3af" />
                        }
                    </TouchableOpacity>

                    {emailExpanded && (
                        <View style={styles.emailForm}>
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
                                containerStyle={isSignup ? styles.fieldGap : undefined}
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
                                containerStyle={styles.fieldGap}
                            />
                            <AppButton
                                title={isSignup ? 'Create account' : 'Sign in'}
                                variant="primary"
                                size="lg"
                                fullWidth
                                disabled={!canSubmit || !!isLoading}
                                onPress={handleSubmit}
                                style={styles.emailSubmit}
                            />
                            <TouchableOpacity style={styles.modeToggle} onPress={switchMode} activeOpacity={0.7}>
                                <Text style={styles.modeToggleText}>
                                    {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                                    <Text style={styles.modeToggleLink}>
                                        {isSignup ? 'Sign in' : 'Sign up'}
                                    </Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <Text style={styles.footer}>
                    By continuing you agree to our Terms of Service and Privacy Policy.
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

// Inline Google "G" icon using coloured text segments
function GoogleIcon() {
    return (
        <View style={styles.googleIconWrap}>
            <Text style={[styles.googleIconText, { color: '#4285F4' }]}>G</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 48,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoMark: {
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: '#2563eb',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
        shadowColor: '#2563eb',
        shadowOpacity: 0.35,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    logoText: {
        fontSize: 36,
        fontWeight: '800',
        color: '#ffffff',
    },
    appName: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 6,
    },
    tagline: {
        fontSize: 14,
        color: '#6b7280',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fef2f2',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fecaca',
        padding: 12,
        marginBottom: 16,
    },
    errorIcon: {
        marginRight: 8,
        marginTop: 1,
        flexShrink: 0,
    },
    errorText: {
        flex: 1,
        fontSize: 13,
        color: '#b91c1c',
        lineHeight: 18,
    },

    // Google button
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#d1d5db',
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    googleIconWrap: {
        width: 20,
        alignItems: 'center',
    },
    googleIconText: {
        fontSize: 16,
        fontWeight: '700',
    },
    googleLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },

    // Divider
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 18,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e5e7eb',
    },
    dividerText: {
        marginHorizontal: 12,
        fontSize: 12,
        color: '#9ca3af',
        fontWeight: '500',
    },

    // Email toggle row
    emailToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    emailToggleText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },

    // Email form
    emailForm: {
        marginTop: 16,
        gap: 0,
    },
    fieldGap: {
        marginTop: 12,
    },
    emailSubmit: {
        marginTop: 18,
    },
    modeToggle: {
        alignItems: 'center',
        marginTop: 14,
    },
    modeToggleText: {
        fontSize: 13,
        color: '#6b7280',
    },
    modeToggleLink: {
        color: '#2563eb',
        fontWeight: '600',
    },

    footer: {
        marginTop: 24,
        fontSize: 11,
        color: '#9ca3af',
        textAlign: 'center',
        lineHeight: 16,
    },
})