/**
 * Color combination store for theme management
 * Manages the active color combination within a palette
 */

import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { ColorCombination } from '$lib/types/database';

const STORAGE_KEY = 'color_combination_id';

/**
 * Create color combination store
 */
function createColorCombinationStore() {
	const { subscribe, set } = writable<ColorCombination | null>(null);

	return {
		subscribe,

		/**
		 * Set the active color combination
		 */
		set: (combination: ColorCombination | null) => {
			if (browser && combination) {
				localStorage.setItem(STORAGE_KEY, combination.id);
			}
			set(combination);
		},

		/**
		 * Get stored combination ID (for hydration)
		 */
		getStoredId: (): string | null => {
			if (!browser) return null;
			return localStorage.getItem(STORAGE_KEY);
		},

		/**
		 * Clear stored preference
		 */
		clearPreference: () => {
			if (browser) {
				localStorage.removeItem(STORAGE_KEY);
			}
			set(null);
		}
	};
}

export const colorCombinationStore = createColorCombinationStore();
