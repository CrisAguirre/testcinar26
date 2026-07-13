import { describe, it, expect, beforeEach, vi } from 'vitest';
import { API_URL, getToken, api, authApi, gradesApi } from '../api.js';

function createMockStorage() {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, val) => { store[key] = String(val); }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i) => Object.keys(store)[i] ?? null)
  };
}

let mockStorage;

beforeEach(() => {
  vi.restoreAllMocks();
  mockStorage = createMockStorage();
  vi.stubGlobal('localStorage', mockStorage);
});

function mockFetch(status, body, ok = true) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body)
  });
}

function mockFetchError(errorMsg) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 400,
    json: () => Promise.resolve({ error: errorMsg })
  });
}

describe('API_URL', () => {
  it('es la URL correcta del backend', () => {
    expect(API_URL).toBe('https://testcinar26bknd.onrender.com/api');
  });
});

describe('getToken', () => {
  it('retorna null si no hay token', () => {
    expect(getToken()).toBeNull();
  });

  it('retorna el token si existe', () => {
    mockStorage.setItem('token', 'mi-token');
    expect(getToken()).toBe('mi-token');
  });

  it('retorna null en entorno sin localStorage', () => {
    vi.stubGlobal('localStorage', undefined);
    expect(getToken()).toBeNull();
  });
});

describe('api', () => {
  it('hace GET sin autenticación', async () => {
    mockFetch(200, { data: 'ok' });
    const result = await api('GET', '/test');
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/test`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    expect(result).toEqual({ data: 'ok' });
  });

  it('incluye Authorization cuando hay token', async () => {
    mockStorage.setItem('token', 'tok123');
    mockFetch(200, { ok: true });
    await api('GET', '/secure');
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/secure`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer tok123'
      }
    });
  });

  it('envía body en POST', async () => {
    mockFetch(201, { id: 1 });
    const data = { name: 'test' };
    await api('POST', '/items', data);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  });

  it('lanza error cuando la respuesta no es ok', async () => {
    mockFetchError('Recurso no encontrado');
    await expect(api('GET', '/fail')).rejects.toThrow('Recurso no encontrado');
  });

  it('lanza error genérico si no hay mensaje de error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({})
    });
    await expect(api('GET', '/fail')).rejects.toThrow('Error en la solicitud');
  });

  it('no envía body si data es undefined', async () => {
    mockFetch(200, {});
    await api('DELETE', '/items/1');
    const callArgs = fetch.mock.calls[0][1];
    expect(callArgs.body).toBeUndefined();
  });
});

describe('authApi', () => {
  it('login llama api con POST /auth/login', async () => {
    mockFetch(200, { token: 'abc' });
    const result = await authApi.login('user', 'pass');
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'user', password: 'pass' })
    });
    expect(result).toEqual({ token: 'abc' });
  });

  it('register llama api con POST /auth/register', async () => {
    mockFetch(201, { user: { id: 1 } });
    const data = { username: 'new', password: '123' };
    const result = await authApi.register(data);
    expect(result).toEqual({ user: { id: 1 } });
  });

  it('profile llama api con GET /auth/profile', async () => {
    mockFetch(200, { user: { role: 'admin' } });
    const result = await authApi.profile();
    expect(result).toEqual({ user: { role: 'admin' } });
  });
});

describe('gradesApi', () => {
  it('getAll construye query params', async () => {
    mockFetch(200, [{ id: 1 }]);
    const result = await gradesApi.getAll({ subject: 'Web', period: '2026-1' });
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/grades?subject=Web&period=2026-1`,
      expect.any(Object)
    );
    expect(result).toEqual([{ id: 1 }]);
  });

  it('getMine llama GET /grades/mine', async () => {
    mockFetch(200, []);
    await gradesApi.getMine();
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/grades/mine`, expect.any(Object));
  });

  it('getById llama GET /grades/:id', async () => {
    mockFetch(200, { _id: 'abc' });
    const result = await gradesApi.getById('abc');
    expect(result).toEqual({ _id: 'abc' });
  });

  it('create llama POST /grades', async () => {
    mockFetch(201, { grade: { score: 10 } });
    const result = await gradesApi.create({ score: 10, subject: 'Web' });
    expect(result).toEqual({ grade: { score: 10 } });
  });

  it('submitMine llama POST /grades/mine', async () => {
    mockFetch(201, { grade: { subject: 'Algoritmia' } });
    const result = await gradesApi.submitMine({ subject: 'Algoritmia', score: 8 });
    expect(result).toEqual({ grade: { subject: 'Algoritmia' } });
  });

  it('updateMine llama PUT /grades/mine/:id', async () => {
    mockFetch(200, { grade: { _id: 'g1' } });
    const result = await gradesApi.updateMine('g1', { examData: '{}' });
    expect(result).toEqual({ grade: { _id: 'g1' } });
  });

  it('update llama PUT /grades/:id', async () => {
    mockFetch(200, { grade: { _id: 'g1' } });
    const result = await gradesApi.update('g1', { score: 15 });
    expect(result).toEqual({ grade: { _id: 'g1' } });
  });

  it('delete llama DELETE /grades/:id', async () => {
    mockFetch(200, { message: 'Eliminada' });
    const result = await gradesApi.delete('g1');
    expect(result).toEqual({ message: 'Eliminada' });
  });
});
