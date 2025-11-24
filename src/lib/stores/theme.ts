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

	console.log('[Theme Store] Applying theme:', theme);
	document.documentElement.setAttribute('data-theme', theme);
	console.log('[Theme Store] Current HTML attributes:', {
		theme: document.documentElement.getAttribute('data-theme'),
		palette: document.documentElement.getAttribute('data-palette')
	});

	// Check if CSS variables are actually being applied
	const styles = getComputedStyle(document.documentElement);
	console.log('[Theme Store] CSS Variables:', {
		background: styles.getPropertyValue('--color-background'),
		primary: styles.getPropertyValue('--color-primary'),
		textPrimary: styles.getPropertyValue('--color-text-primary')
	});
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
			console.log('[Theme Store] Toggle called');
			update((current) => {
				console.log('[Theme Store] Current theme:', current);
				const newTheme: Theme = current === 'dark' ? 'light' : 'dark';
				console.log('[Theme Store] New theme:', newTheme);
				if (browser) {
					localStorage.setItem(THEME_STORAGE_KEY, newTheme);
					applyTheme(newTheme);
				}
				return newTheme;
			});
		},
		initialize: () => {
			console.log('[Theme Store] Initialize called');
			const theme = getInitialTheme();
			console.log('[Theme Store] Initial theme:', theme);
			applyTheme(theme);
			set(theme);
		}
	};
}

export const theme = createThemeStore();
