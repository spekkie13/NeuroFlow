import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { User } from '../utils/auth';
import {
    Mail as MailIcon,
    Lock as LockIcon,
    User as UserIcon,
    CheckCircle2 as CheckCircleIcon,
} from 'lucide-react-native';

interface AuthScreenProps {
    onLogin: (user: User) => void;
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleEmailAuth = () => {
        setError('');
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        if (mode === 'signup' && !name) {
            setError('Please enter your name');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        const user: User = {
            id: Date.now().toString(),
            email,
            name: mode === 'signup' ? name : email.split('@')[0],
            provider: 'email',
            createdAt: new Date().toISOString(),
        };
        onLogin(user);
    };

    const handleGoogleAuth = () => {
        const user: User = {
            id: Date.now().toString(),
            email: 'user@gmail.com',
            name: 'Google User',
            provider: 'google',
            createdAt: new Date().toISOString(),
        };
        onLogin(user);
    };

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.screenContent}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.container}>
                {/* Logo / Brand */}
                <View style={styles.brand}>
                    <View style={styles.brandIcon}>
                        <CheckCircleIcon size={32} color="#FFFFFF" />
                    </View>
                    <Text style={styles.title}>ADHD Planner</Text>
                    <Text style={styles.subtitle}>
                        Organize your tasks and stay focused
                    </Text>
                </View>

                {/* Card */}
                <View style={styles.card}>
                    {/* Tabs */}
                    <View style={styles.tabRow}>
                        <Pressable
                            onPress={() => {
                                setMode('login');
                                setError('');
                            }}
                            style={[styles.tab, mode === 'login' && styles.tabActive]}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    mode === 'login' && styles.tabTextActive,
                                ]}
                            >
                                Log In
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                setMode('signup');
                                setError('');
                            }}
                            style={[styles.tab, mode === 'signup' && styles.tabActive]}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    mode === 'signup' && styles.tabTextActive,
                                ]}
                            >
                                Sign Up
                            </Text>
                        </Pressable>
                    </View>

                    <View style={styles.cardBody}>
                        {/* Google */}
                        <Pressable onPress={handleGoogleAuth} style={styles.googleButton}>
                            <View style={styles.googleIcon} />
                            <Text style={styles.googleText}>Continue with Google</Text>
                        </Pressable>

                        {/* Divider */}
                        <View style={styles.dividerRow}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>Or continue with email</Text>
                            <View style={styles.divider} />
                        </View>

                        {/* Error */}
                        {error ? (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        {/* Form */}
                        {mode === 'signup' && (
                            <View style={styles.field}>
                                <Text style={styles.label}>Full Name</Text>
                                <View style={styles.inputRow}>
                                    <UserIcon size={18} color="#9CA3AF" style={styles.inputIcon} />
                                    <TextInput
                                        value={name}
                                        onChangeText={setName}
                                        placeholder="John Doe"
                                        style={styles.input}
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                            </View>
                        )}

                        <View style={styles.field}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputRow}>
                                <MailIcon size={18} color="#9CA3AF" style={styles.inputIcon} />
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="you@example.com"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    style={styles.input}
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputRow}>
                                <LockIcon size={18} color="#9CA3AF" style={styles.inputIcon} />
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="••••••••"
                                    secureTextEntry
                                    style={styles.input}
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                            {mode === 'signup' && (
                                <Text style={styles.hint}>
                                    Must be at least 6 characters
                                </Text>
                            )}
                        </View>

                        {mode === 'login' && (
                            <View style={styles.rowBetween}>
                                <Pressable
                                    onPress={() => setRememberMe((r) => !r)}
                                    style={styles.checkboxRow}
                                >
                                    <View
                                        style={[
                                            styles.checkbox,
                                            rememberMe && styles.checkboxChecked,
                                        ]}
                                    >
                                        {rememberMe ? (
                                            <Text style={styles.checkboxCheck}>✓</Text>
                                        ) : null}
                                    </View>
                                    <Text style={styles.checkboxLabel}>Remember me</Text>
                                </Pressable>
                                <Pressable>
                                    <Text style={styles.link}>Forgot password?</Text>
                                </Pressable>
                            </View>
                        )}

                        <Pressable onPress={handleEmailAuth} style={styles.submitButton}>
                            <Text style={styles.submitText}>
                                {mode === 'login' ? 'Log In' : 'Create Account'}
                            </Text>
                        </Pressable>

                        {mode === 'signup' && (
                            <Text style={styles.agreement}>
                                By signing up, you agree to our{' '}
                                <Text style={styles.link}>Terms of Service</Text> and{' '}
                                <Text style={styles.link}>Privacy Policy</Text>
                            </Text>
                        )}
                    </View>
                </View>

                {/* footer switch */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        {mode === 'login'
                            ? "Don't have an account? "
                            : 'Already have an account? '}
                        <Text
                            style={styles.footerLink}
                            onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
                        >
                            {mode === 'login' ? 'Sign up' : 'Log in'}
                        </Text>
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#EEF2FF',
    },
    screenContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
    },
    container: {
        maxWidth: 480,
        width: '100%',
        alignSelf: 'center',
    },
    brand: {
        alignItems: 'center',
        marginBottom: 20,
    },
    brandIcon: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        elevation: 3,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
    },
    subtitle: {
        color: '#6B7280',
        marginTop: 4,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        elevation: 2,
    },
    tabRow: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: '#DBEAFE',
        borderBottomWidth: 2,
        borderBottomColor: '#2563EB',
    },
    tabText: {
        fontWeight: '600',
        color: '#6B7280',
    },
    tabTextActive: {
        color: '#2563EB',
    },
    cardBody: {
        padding: 16,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1.5,
        borderColor: '#D1D5DB',
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 14,
        justifyContent: 'center',
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
    },
    googleIcon: {
        width: 20,
        height: 20,
        borderRadius: 4,
        backgroundColor: '#EA4335', // fake google
    },
    googleText: {
        fontWeight: '500',
        color: '#374151',
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 8,
        color: '#6B7280',
        fontSize: 12,
    },
    errorBox: {
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FCA5A5',
        borderRadius: 10,
        padding: 10,
        marginBottom: 12,
    },
    errorText: {
        color: '#B91C1C',
        fontSize: 13,
    },
    field: {
        marginBottom: 12,
    },
    label: {
        fontWeight: '500',
        marginBottom: 6,
        color: '#374151',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingHorizontal: 8,
    },
    inputIcon: {
        marginHorizontal: 4,
    },
    input: {
        flex: 1,
        paddingHorizontal: 6,
        paddingVertical: 10,
        fontSize: 14,
        color: '#111827',
    },
    hint: {
        marginTop: 4,
        fontSize: 11,
        color: '#9CA3AF',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    checkboxChecked: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    checkboxCheck: {
        color: '#FFFFFF',
        fontSize: 12,
    },
    checkboxLabel: {
        marginLeft: 6,
        color: '#4B5563',
        fontSize: 13,
    },
    link: {
        color: '#2563EB',
        fontWeight: '500',
    },
    submitButton: {
        backgroundColor: '#2563EB',
        borderRadius: 14,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 6,
        elevation: 1,
    },
    submitText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    agreement: {
        marginTop: 12,
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
    },
    footer: {
        marginTop: 16,
        alignItems: 'center',
    },
    footerText: {
        color: '#6B7280',
    },
    footerLink: {
        color: '#2563EB',
        fontWeight: '600',
    },
});
