import { Project, Account } from '../../app/utils/types';

const PROJECTS_KEY_PREFIX = 'adhd-planner-projects-';
const ACCOUNTS_KEY = 'adhd-planner-accounts';
const CURRENT_ACCOUNT_KEY = 'adhd-planner-current-account';
export function saveProjects(projects: Project[], accountId: string): void {
  localStorage.setItem(`${PROJECTS_KEY_PREFIX}${accountId}`, JSON.stringify(projects));
}
export function loadProjects(accountId: string): Project[] {
  const storedData = localStorage.getItem(`${PROJECTS_KEY_PREFIX}${accountId}`);
  if (!storedData) return [];
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Failed to parse projects from localStorage', error);
    return [];
  }
}
export function saveAccounts(accounts: Account[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}
export function loadAccounts(): Account[] {
  const storedData = localStorage.getItem(ACCOUNTS_KEY);
  if (!storedData) {
    // Create a default account if none exists
    const defaultAccount: Account = {
      id: Date.now().toString(),
      name: 'My Account',
      createdAt: new Date().toISOString()
    };
    saveAccounts([defaultAccount]);
    setCurrentAccount(defaultAccount.id);
    return [defaultAccount];
  }
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Failed to parse accounts from localStorage', error);
    return [];
  }
}
export function setCurrentAccount(accountId: string): void {
  localStorage.setItem(CURRENT_ACCOUNT_KEY, accountId);
}
export function getCurrentAccount(): string | null {
  return localStorage.getItem(CURRENT_ACCOUNT_KEY);
}
