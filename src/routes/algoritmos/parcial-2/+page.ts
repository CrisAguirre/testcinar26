import { browser } from '$app/environment';
import type { PageLoad } from './$types';
import { gradesApi } from '$lib/api';
import { get } from 'svelte/store';
import { preloadedMyGrades } from '$lib/stores/preloaded';

export const load: PageLoad = async () => {
  if (browser) {
    const cached = get(preloadedMyGrades);
    if (cached && cached.length > 0) {
      return { serverGrades: cached };
    }

    try {
      const grades = await gradesApi.getMine();
      preloadedMyGrades.set(grades);
      return { serverGrades: grades };
    } catch {
      return { serverGrades: [] };
    }
  }

  return { serverGrades: [] };
};
