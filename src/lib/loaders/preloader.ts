import { browser } from '$app/environment';
import { API_URL, getToken } from '$lib/api';
import { gradesApi, authApi } from '$lib/api';
import { currentUser } from '$lib/stores/auth';
import { get } from 'svelte/store';
import {
  preloadingStatus,
  wakeUpStatus,
  preloadedProfile,
  preloadedGrades,
  preloadedMyGrades
} from '$lib/stores/preloaded';

const BASE_URL = API_URL.replace('/api', '');
const CACHE_TTL = 5 * 60 * 1000;
let lastFetchTime = 0;
let wakeInProgress = false;
let preloadInProgress = false;

let resolveWake: (() => void) | null = null;
const wakePromise = new Promise<void>((resolve) => {
  resolveWake = resolve;
});

export { wakePromise };

export async function wakeBackend(): Promise<void> {
  if (wakeInProgress) return wakePromise;
  wakeInProgress = true;
  wakeUpStatus.set('waking');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    await fetch(BASE_URL, { signal: controller.signal, mode: 'cors' });
    clearTimeout(timeout);
    wakeUpStatus.set('warm');
  } catch {
    wakeUpStatus.set('warm');
  } finally {
    wakeInProgress = false;
    if (resolveWake) resolveWake();
  }
}

export async function preloadAll(): Promise<void> {
  if (preloadInProgress) return;
  preloadInProgress = true;
  preloadingStatus.set('loading');

  await wakeBackend();

  const token = getToken();
  if (!token) {
    preloadingStatus.set('done');
    preloadInProgress = false;
    return;
  }

  try {
    const profilePromise = authApi.profile().catch(() => null);
    const myGradesPromise = gradesApi.getMine().catch(() => null);
    const allGradesPromise = tryPreloadAllGrades();

    const [profile, myGrades] = await Promise.all([profilePromise, myGradesPromise]);

    if (profile) preloadedProfile.set(profile);
    if (myGrades) preloadedMyGrades.set(myGrades);

    const allGrades = await allGradesPromise;
    if (allGrades) preloadedGrades.set(allGrades);

    lastFetchTime = Date.now();
    preloadingStatus.set('done');
  } catch {
    preloadingStatus.set('done');
  } finally {
    preloadInProgress = false;
  }
}

async function tryPreloadAllGrades(): Promise<any[] | null> {
  try {
    const user = get(currentUser);
    if (user?.role === 'admin' || user?.role === 'teacher' || user?.role === 'coordinator') {
      return await gradesApi.getAll({});
    }
  } catch {}
  return null;
}

export async function ensureDataFresh(): Promise<void> {
  const elapsed = Date.now() - lastFetchTime;
  if (elapsed > CACHE_TTL) {
    await preloadAll();
  }
}

export function startPreloader(): void {
  if (!browser) return;
  wakeBackend();
  const token = getToken();
  if (token) {
    setTimeout(() => preloadAll(), 100);
  }
}
