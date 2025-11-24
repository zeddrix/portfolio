import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type ColorPalette =
	| 'cyber_blue'
	| 'neon_nights'
	| 'sunset_ember'
	| 'forest_zen'
	| 'monochrome_pro'
	| 'purple_haze'
	| 'ocean_deep';

export interface PaletteInfo {
	id: ColorPalette;
	name: string;
	description: string;
	primaryColor: string; // RGB values for preview
	preview: {
		primary: string; // Hex color
		secondary: string; // Hex color
		accent: string; // Hex color
	};
}

export const PALETTES: PaletteInfo[] = [
	{
		id: 'cyber_blue',
		name: 'Cyber Blue',
		description: 'Professional tech aesthetic',
		primaryColor: '0 217 255',
		preview: { primary: '#00D9FF', secondary: '#7B61FF', accent: '#FF006E' }
	},
	{
		id: 'neon_nights',
		name: 'Neon Nights',
		description: 'Vibrant and energetic',
		primaryColor: '0 255 163',
		preview: { primary: '#00FFA3', secondary: '#FF00FF', accent: '#00FFFF' }
	},
	{
		id: 'sunset_ember',
		name: 'Sunset Ember',
		description: 'Warm and creative',
		primaryColor: '255 107 53',
		preview: { primary: '#FF6B35', secondary: '#F7931E', accent: '#FFD23F' }
	},
	{
		id: 'forest_zen',
		name: 'Forest Zen',
		description: 'Calm and natural',
		primaryColor: '16 185 129',
		preview: { primary: '#10B981', secondary: '#059669', accent: '#6EE7B7' }
	},
	{
		id: 'monochrome_pro',
		name: 'Monochrome Pro',
		description: 'High contrast, minimal',
		primaryColor: '255 255 255',
		preview: { primary: '#FFFFFF', secondary: '#A3A3A3', accent: '#525252' }
	},
	{
		id: 'purple_haze',
		name: 'Purple Haze',
		description: 'Modern and sophisticated',
		primaryColor: '167 139 250',
		preview: { primary: '#A78BFA', secondary: '#C084FC', accent: '#E879F9' }
	},
	{
		id: 'ocean_deep',
		name: 'Ocean Deep',
		description: 'Cool and professional',
		primaryColor: '6 182 212',
		preview: { primary: '#06B6D4', secondary: '#0EA5E9', accent: '#3B82F6' }
	}
];

const PALETTE_STORAGE_KEY = 'preferred_palette';
const DEFAULT_PALETTE: ColorPalette = 'cyber_blue';

/**
 * Get the initial palette from localStorage or default
 */
function getInitialPalette(): ColorPalette {
	if (!browser) return DEFAULT_PALETTE;

	const stored = localStorage.getItem(PALETTE_STORAGE_KEY);
	const validPalette = PALETTES.find((p) => p.id === stored);

	return validPalette ? (stored as ColorPalette) : DEFAULT_PALETTE;
}

/**
 * Apply palette attribute to HTML element
 */
function applyPalette(palette: ColorPalette): void {
	if (!browser) return;

	document.documentElement.setAttribute('data-palette', palette);
}

/**
 * Create palette store with localStorage persistence
 */
function createPaletteStore() {
	const { subscribe, set } = writable<ColorPalette>(getInitialPalette());

	return {
		subscribe,
		set: (value: ColorPalette) => {
			if (browser) {
				localStorage.setItem(PALETTE_STORAGE_KEY, value);
				applyPalette(value);
			}
			set(value);
		},
		initialize: () => {
			const palette = getInitialPalette();
			applyPalette(palette);
			set(palette);
		}
	};
}

export const palette = createPaletteStore();
