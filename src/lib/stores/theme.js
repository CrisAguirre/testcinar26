import { writable } from 'svelte/store';

const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null;
export const theme = writable(stored || 'light');

theme.subscribe((val) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', val);
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', val);
  }
});
