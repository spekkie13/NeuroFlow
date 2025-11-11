import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
    id: string;
    email: string;
    name: string;
    provider: 'email' | 'google';
    createdAt: string;
}

const AUTH_USER_KEY = 'adhd-planner-auth-user';
const USERS_KEY = 'adhd-planner-users';

// --- Save current user ---
export async function saveCurrentUser(user: User): Promise<void> {
    try {
        await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch (error) {
        console.error('Error saving current user:', error);
    }
}

// --- Get current user ---
export async function getCurrentUser(): Promise<User | null> {
    try {
        const storedData = await AsyncStorage.getItem(AUTH_USER_KEY);
        return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
        console.error('Failed to parse user from AsyncStorage', error);
        return null;
    }
}

// --- Logout user ---
export async function logout(): Promise<void> {
    try {
        await AsyncStorage.removeItem(AUTH_USER_KEY);
    } catch (error) {
        console.error('Error removing current user:', error);
    }
}

// --- Save a new user ---
export async function saveUser(user: User): Promise<void> {
    try {
        const users = await getAllUsers();
        users.push(user);
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
        console.error('Error saving user:', error);
    }
}

// --- Get all users ---
export async function getAllUsers(): Promise<User[]> {
    try {
        const storedData = await AsyncStorage.getItem(USERS_KEY);
        return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
        console.error('Failed to parse users from AsyncStorage', error);
        return [];
    }
}

// --- Find user by email ---
export async function findUserByEmail(email: string): Promise<User | null> {
    try {
        const users = await getAllUsers();
        return users.find(u => u.email === email) || null;
    } catch (error) {
        console.error('Error finding user by email:', error);
        return null;
    }
}
