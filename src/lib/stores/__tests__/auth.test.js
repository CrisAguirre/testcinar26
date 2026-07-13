import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';

function createMockStorage(initial = {}) {
  const store = { ...initial };
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, val) => { store[key] = String(val); }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { for (const k of Object.keys(store)) delete store[k]; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i) => Object.keys(store)[i] ?? null)
  };
}

beforeEach(() => {
  vi.stubGlobal('localStorage', createMockStorage());
  vi.resetModules();
});

async function importAuth() {
  return await import('../auth.js');
}

describe('auth store - inicialización', () => {
  it('currentUser es null sin datos en localStorage', async () => {
    const mod = await importAuth();
    expect(get(mod.currentUser)).toBeNull();
  });

  it('isAuthenticated es false sin usuario', async () => {
    const mod = await importAuth();
    expect(get(mod.isAuthenticated)).toBe(false);
  });

  it('isAdmin es false sin usuario', async () => {
    const mod = await importAuth();
    expect(get(mod.isAdmin)).toBe(false);
  });

  it('carga usuario desde localStorage si existe', async () => {
    vi.stubGlobal('localStorage', createMockStorage({
      token: 'tok',
      user: JSON.stringify({ username: 'test', role: 'student' })
    }));
    vi.resetModules();
    const mod = await importAuth();
    expect(get(mod.token)).toBe('tok');
    expect(get(mod.currentUser)).toEqual({ username: 'test', role: 'student' });
    expect(get(mod.isAuthenticated)).toBe(true);
  });
});

describe('login', () => {
  it('establece token y currentUser', async () => {
    const mod = await importAuth();
    const userData = { username: 'admin', role: 'admin' };
    mod.login(userData, 'admin-token');
    expect(get(mod.token)).toBe('admin-token');
    expect(get(mod.currentUser)).toEqual(userData);
  });

  it('guarda en localStorage', async () => {
    const mod = await importAuth();
    mod.login({ username: 'u', role: 'student' }, 't');
    expect(localStorage.getItem('token')).toBe('t');
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({ username: 'u', role: 'student' });
  });

  it('isAuthenticated es true tras login', async () => {
    const mod = await importAuth();
    mod.login({ username: 'u', role: 'student' }, 't');
    expect(get(mod.isAuthenticated)).toBe(true);
  });
});

describe('logout', () => {
  it('limpia token y currentUser', async () => {
    const mod = await importAuth();
    mod.login({ username: 'u', role: 'student' }, 't');
    mod.logout();
    expect(get(mod.token)).toBeNull();
    expect(get(mod.currentUser)).toBeNull();
  });

  it('limpia localStorage', async () => {
    const mod = await importAuth();
    mod.login({ username: 'u', role: 'student' }, 't');
    mod.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('isAuthenticated es false tras logout', async () => {
    const mod = await importAuth();
    mod.login({ username: 'u', role: 'student' }, 't');
    mod.logout();
    expect(get(mod.isAuthenticated)).toBe(false);
  });
});

describe('isAdmin', () => {
  it('es true para rol admin', async () => {
    const mod = await importAuth();
    mod.login({ username: 'a', role: 'admin' }, 't');
    expect(get(mod.isAdmin)).toBe(true);
  });

  it('es true para rol coordinator', async () => {
    const mod = await importAuth();
    mod.login({ username: 'p', role: 'coordinator' }, 't');
    expect(get(mod.isAdmin)).toBe(true);
  });

  it('es false para rol student', async () => {
    const mod = await importAuth();
    mod.login({ username: 's', role: 'student' }, 't');
    expect(get(mod.isAdmin)).toBe(false);
  });

  it('es false para rol undefined', async () => {
    const mod = await importAuth();
    mod.login({ username: 'x' }, 't');
    expect(get(mod.isAdmin)).toBe(false);
  });
});
