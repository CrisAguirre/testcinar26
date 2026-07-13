import { writable } from 'svelte/store';

export type PreloadStatus = 'idle' | 'waking' | 'loading' | 'done' | 'error';

export const preloadingStatus = writable<PreloadStatus>('idle');
export const wakeUpStatus = writable<'idle' | 'waking' | 'warm'>('idle');
export const preloadedProfile = writable<any | null>(null);
export const preloadedGrades = writable<any[] | null>(null);
export const preloadedMyGrades = writable<any[] | null>(null);
