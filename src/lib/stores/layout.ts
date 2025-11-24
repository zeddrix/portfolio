import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { LayoutType } from '$lib/types/layout';
import { DEFAULT_LAYOUT } from '$lib/types/layout';

const STORAGE_KEY = 'preferred_layout';

/**
 * Get initial layout from localStorage or use default
 */
function getInitialLayout(): LayoutType {
	if (!browser) return DEFAULT_LAYOUT;

	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored && isValidLayout(stored)) {
		return stored as LayoutType;
	}

	return DEFAULT_LAYOUT;
}

/**
 * Validate if string is a valid layout type
 */
function isValidLayout(value: string): boolean {
	return value === 'case_study' || value === 'single_page' || value === 'bento_grid';
}

/**
 * Create layout store with localStorage persistence
 */
function createLayoutStore() {
	const { subscribe, set } = writable<LayoutType>(getInitialLayout());

	return {
		subscribe,
		set: (value: LayoutType) => {
			if (browser) {
				localStorage.setItem(STORAGE_KEY, value);
			}
			set(value);
		},
		/**
		 * Set layout from database (admin default)
		 * Only applies if user hasn't set a preference
		 */
		setDefault: (value: LayoutType) => {
			if (!browser) return;

			const hasPreference = localStorage.getItem(STORAGE_KEY);
			if (!hasPreference) {
				set(value);
			}
		},
		/**
		 * Clear user preference and revert to default
		 */
		clearPreference: () => {
			if (browser) {
				localStorage.removeItem(STORAGE_KEY);
				set(DEFAULT_LAYOUT);
			}
		}
	};
}

export const layoutStore = createLayoutStore();
