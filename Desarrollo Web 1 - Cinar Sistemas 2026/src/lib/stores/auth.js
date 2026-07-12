import { writable, derived } from 'svelte/store';

const storedUser = typeof localStorage !== 'undefined' ? localStorage.getItem('user') : null;
const storedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

export const token = writable(storedToken);
export const currentUser = writable(storedUser ? JSON.parse(storedUser) : null);

export const isAuthenticated = derived(currentUser, ($user) => $user !== null);
export const isAdmin = derived(currentUser, ($user) => $user?.role === 'admin');

export function login(userData, tokenValue) {
  localStorage.setItem('token', tokenValue);
  localStorage.setItem('user', JSON.stringify(userData));
  token.set(tokenValue);
  currentUser.set(userData);
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  token.set(null);
  currentUser.set(null);
}
