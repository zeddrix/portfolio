import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'preferred_theme';
const DEFAULT_THEME: Theme = 'dark';

/**
 * Get the initial theme from localStorage or default
 */
function getInitialTheme(): Theme {
	if (!browser) return DEFAULT_THEME;

	const stored = localStorage.getItem(THEME_STORAGE_KEY);
	if (stored === 'dark' || stored === 'light') {
		return stored;
	}

	return DEFAULT_THEME;
}

/**
 * Apply theme attribute to HTML element
 */
function applyTheme(theme: Theme): void {
	if (!browser) return;

	document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Create theme store with localStorage persistence
 */
function createThemeStore() {
	const { subscribe, set, update } = writable<Theme>(getInitialTheme());

	return {
		subscribe,
		set: (value: Theme) => {
			if (browser) {
				localStorage.setItem(THEME_STORAGE_KEY, value);
				applyTheme(value);
			}
			set(value);
		},
		toggle: () => {
			update((current) => {
				const newTheme: Theme = current === 'dark' ? 'light' : 'dark';
				if (browser) {
					localStorage.setItem(THEME_STORAGE_KEY, newTheme);
					applyTheme(newTheme);
				}
				return newTheme;
			});
		},
		initialize: () => {
			const theme = getInitialTheme();
			applyTheme(theme);
			set(theme);
		}
	};
}

export const theme = createThemeStore();
