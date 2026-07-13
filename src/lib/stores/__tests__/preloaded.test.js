import { describe, it, expect } from 'vitest';
import { get } from 'svelte/store';
import {
  preloadingStatus,
  wakeUpStatus,
  preloadedProfile,
  preloadedGrades,
  preloadedMyGrades
} from '../preloaded.ts';

describe('preloadingStatus', () => {
  it('inicializa con idle', () => {
    expect(get(preloadingStatus)).toBe('idle');
  });

  it('acepta valores válidos', () => {
    preloadingStatus.set('loading');
    expect(get(preloadingStatus)).toBe('loading');
    preloadingStatus.set('done');
    expect(get(preloadingStatus)).toBe('done');
    preloadingStatus.set('error');
    expect(get(preloadingStatus)).toBe('error');
    preloadingStatus.set('waking');
    expect(get(preloadingStatus)).toBe('waking');
  });
});

describe('wakeUpStatus', () => {
  it('inicializa con idle', () => {
    expect(get(wakeUpStatus)).toBe('idle');
  });

  it('transiciona a waking y warm', () => {
    wakeUpStatus.set('waking');
    expect(get(wakeUpStatus)).toBe('waking');
    wakeUpStatus.set('warm');
    expect(get(wakeUpStatus)).toBe('warm');
  });
});

describe('preloadedProfile', () => {
  it('inicializa con null', () => {
    expect(get(preloadedProfile)).toBeNull();
  });

  it('almacena un perfil de usuario', () => {
    const profile = { username: 'test', role: 'student', full_name: 'Test' };
    preloadedProfile.set(profile);
    expect(get(preloadedProfile)).toEqual(profile);
  });

  it('resetea a null', () => {
    preloadedProfile.set({ username: 'x' });
    preloadedProfile.set(null);
    expect(get(preloadedProfile)).toBeNull();
  });
});

describe('preloadedGrades', () => {
  it('inicializa con null', () => {
    expect(get(preloadedGrades)).toBeNull();
  });

  it('almacena un arreglo de calificaciones', () => {
    const grades = [{ subject: 'Web', score: 10 }, { subject: 'Math', score: 8 }];
    preloadedGrades.set(grades);
    expect(get(preloadedGrades)).toHaveLength(2);
    expect(get(preloadedGrades)[0].subject).toBe('Web');
  });

  it('resetea a null', () => {
    preloadedGrades.set([]);
    preloadedGrades.set(null);
    expect(get(preloadedGrades)).toBeNull();
  });
});

describe('preloadedMyGrades', () => {
  it('inicializa con null', () => {
    expect(get(preloadedMyGrades)).toBeNull();
  });

  it('almacena las calificaciones del usuario', () => {
    const myGrades = [{ subject: 'Algoritmia', score: 9 }];
    preloadedMyGrades.set(myGrades);
    expect(get(preloadedMyGrades)).toHaveLength(1);
    expect(get(preloadedMyGrades)[0].subject).toBe('Algoritmia');
  });
});
