export interface User {
  id: string;
  email: string;
  name: string;
  provider: 'email' | 'google';
  createdAt: string;
}
const AUTH_USER_KEY = 'adhd-planner-auth-user';
const USERS_KEY = 'adhd-planner-users';
export function saveCurrentUser(user: User): void {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}
export function getCurrentUser(): User | null {
  const storedData = localStorage.getItem(AUTH_USER_KEY);
  if (!storedData) return null;
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Failed to parse user from localStorage', error);
    return null;
  }
}
export function logout(): void {
  localStorage.removeItem(AUTH_USER_KEY);
}
export function saveUser(user: User): void {
  const users = getAllUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
export function getAllUsers(): User[] {
  const storedData = localStorage.getItem(USERS_KEY);
  if (!storedData) return [];
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Failed to parse users from localStorage', error);
    return [];
  }
}
export function findUserByEmail(email: string): User | null {
  const users = getAllUsers();
  return users.find(u => u.email === email) || null;
}