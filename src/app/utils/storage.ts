import AsyncStorage from '@react-native-async-storage/async-storage';
import { Project, Account } from './types';

const PROJECTS_KEY_PREFIX = 'projects_';
const ACCOUNTS_KEY = 'accounts';
const CURRENT_ACCOUNT_KEY = 'current_account';

// --- Projects ---
export const saveProjects = async (projects: Project[], accountId: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(`${PROJECTS_KEY_PREFIX}${accountId}`, JSON.stringify(projects));
    } catch (error) {
        console.error('Error saving projects:', error);
    }
};

export const loadProjects = async (accountId: string): Promise<Project[]> => {
    try {
        const json = await AsyncStorage.getItem(`${PROJECTS_KEY_PREFIX}${accountId}`);
        return json ? JSON.parse(json) : [];
    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
};

// --- Accounts ---
export const saveAccounts = async (accounts: Account[]): Promise<void> => {
    try {
        await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (error) {
        console.error('Error saving accounts:', error);
    }
};

export const loadAccounts = async (): Promise<Account[]> => {
    try {
        const json = await AsyncStorage.getItem(ACCOUNTS_KEY);
        return json ? JSON.parse(json) : [];
    } catch (error) {
        console.error('Error loading accounts:', error);
        return [];
    }
};

// --- Current account ---
export const getCurrentAccount = async (): Promise<string | null> => {
    try {
        const value = await AsyncStorage.getItem(CURRENT_ACCOUNT_KEY);
        return value ?? null;
    } catch (error) {
        console.error('Error getting current account:', error);
        return null;
    }
};

export const setCurrentAccount = async (accountId: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(CURRENT_ACCOUNT_KEY, accountId);
    } catch (error) {
        console.error('Error setting current account:', error);
    }
};
