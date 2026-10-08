import { describe, it, expect } from 'vitest';
import { API_URL, getHealthUrl } from '../api.js';

describe('getHealthUrl', () => {
  it('apunta al endpoint público de salud (nunca a URL vacía)', () => {
    const url = getHealthUrl();
    expect(url).toBe(`${API_URL}/health`);
    expect(url.length).toBeGreaterThan('/health'.length);
    expect(url).toMatch(/\/api\/health$/);
  });
});
