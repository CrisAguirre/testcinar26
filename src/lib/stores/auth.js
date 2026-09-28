import { writable, derived } from 'svelte/store';
import { setAccessToken, clearAccessToken, onSessionExpired, authApi } from '$lib/api';

function readStoredUser() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const token = writable(null);
export const currentUser = writable(readStoredUser());

// P2: migración única — si quedó un token legado en localStorage se sube
// a memoria (y al store) y se borra del almacenamiento persistente.
try {
  if (typeof localStorage !== 'undefined') {
    const legacy = localStorage.getItem('token');
    if (legacy) {
      setAccessToken(legacy);
      token.set(legacy);
      localStorage.removeItem('token');
    }
  }
} catch {
  // almacenamiento no disponible: la sesión vivirá solo en memoria
}

export const isAuthenticated = derived(currentUser, ($user) => $user !== null);
export const isAdmin = derived(currentUser, ($user) => $user?.role === 'admin' || $user?.role === 'coordinator');

export function login(userData, tokenValue) {
  // P2: el token ya NO se guarda en localStorage, solo en memoria.
  setAccessToken(tokenValue);
  try {
    localStorage.setItem('user', JSON.stringify(userData));
  } catch {
    // sin almacenamiento: sesión solo en memoria
  }
  token.set(tokenValue);
  currentUser.set(userData);
}

function clearLocalSession() {
  clearAccessToken();
  try {
    // P2-10: al salir se borra todo rastro local salvo el tema visual.
    const theme = localStorage.getItem('theme');
    localStorage.clear();
    if (theme !== null) localStorage.setItem('theme', theme);
  } catch {
    // sin almacenamiento: nada que limpiar
  }
  token.set(null);
  currentUser.set(null);
}

export async function logout() {
  // P2: primero se cierra local (instantáneo), luego se revoca el refresh
  // en el servidor (best effort, sin bloquear la UI).
  clearLocalSession();
  try {
    await authApi.logout();
  } catch {
    // aunque falle la red, la sesión local ya quedó cerrada
  }
}

// Si el refresh silencioso falla (cookie expirada/revocada), la sesión
// local se invalida y los guards redirigen a /login.
onSessionExpired(() => {
  clearLocalSession();
});
