import { browser } from '$app/environment';
import type { PageLoad } from './$types';
import { gradesApi } from '$lib/api';
import { get } from 'svelte/store';
import { preloadedGrades } from '$lib/stores/preloaded';

export const load: PageLoad = async () => {
  if (browser) {
    const cached = get(preloadedGrades);
    if (cached && cached.length > 0) {
      return { grades: cached };
    }

    try {
      const grades = await gradesApi.getAll({});
      preloadedGrades.set(grades);
      return { grades };
    } catch {
      return { grades: [] };
    }
  }

  return { grades: [] };
};
