import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { User as userAuth } from '../utils/auth';
import { Mail, Lock, User, CheckCircle2 } from 'lucide-react-native';
import { AuthScreenProps } from "@/props/AuthScreenProps";
import { styles } from "@/styles/authScreen";

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

        const user: userAuth = {
            id: Date.now().toString(),
            email,
            name: mode === 'signup' ? name : email.split('@')[0],
            provider: 'email',
            createdAt: new Date().toISOString(),
        };
        onLogin(user);
    };

    const handleGoogleAuth = () => {
        const user: userAuth = {
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
                        <CheckCircle2 size={32} color="#FFFFFF" />
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
                                    <User size={18} color="#9CA3AF" style={styles.inputIcon} />
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
                                <Mail size={18} color="#9CA3AF" style={styles.inputIcon} />
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
                                <Lock size={18} color="#9CA3AF" style={styles.inputIcon} />
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
