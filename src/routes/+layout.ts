import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';
import { wakeBackend } from '$lib/loaders/preloader';
import { wakeUpStatus, preloadingStatus } from '$lib/stores/preloaded';

export const load: LayoutLoad = async () => {
  if (browser) {
    wakeBackend();
  }

  return {
    wakeUpStatus: 'idle',
    preloadingStatus: 'idle'
  };
};
