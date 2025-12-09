/**
 * CSS Variable injection utility for dynamic theme colors
 * Supports real-time theme switching without page reload
 */

import type { ColorCombination, ThemeModeType } from '$lib/types/database';

/**
 * Inject CSS variables from a color combination
 */
export function injectColorVariables(
	combination: ColorCombination,
	themeMode: ThemeModeType
): void {
	const root = document.documentElement;
	const isDark = themeMode === 'dark';

	// Primary colors (convert hex to RGB for Tailwind compatibility)
	root.style.setProperty('--color-primary', hexToRgb(combination.primary_color));
	root.style.setProperty('--color-secondary', hexToRgb(combination.secondary_color));
	root.style.setProperty('--color-accent', hexToRgb(combination.accent_color));

	// Theme-specific colors
	const background = isDark ? combination.background_dark : combination.background_light;
	const surface = isDark ? combination.surface_dark : combination.surface_light;
	const textPrimary = isDark ? combination.text_primary_dark : combination.text_primary_light;
	const textSecondary = isDark ? combination.text_secondary_dark : combination.text_secondary_light;
	const border = isDark ? combination.border_dark : combination.border_light;

	root.style.setProperty('--color-background', hexToRgb(background));
	root.style.setProperty('--color-surface', hexToRgb(surface));
	root.style.setProperty('--color-text-primary', hexToRgb(textPrimary));
	root.style.setProperty('--color-text-secondary', hexToRgb(textSecondary));
	root.style.setProperty('--color-border', hexToRgb(border));

	// Also set the hex values for direct use
	root.style.setProperty('--hex-primary', combination.primary_color);
	root.style.setProperty('--hex-secondary', combination.secondary_color);
	root.style.setProperty('--hex-accent', combination.accent_color);
	root.style.setProperty('--hex-background', background);
	root.style.setProperty('--hex-surface', surface);
	root.style.setProperty('--hex-text-primary', textPrimary);
	root.style.setProperty('--hex-text-secondary', textSecondary);
	root.style.setProperty('--hex-border', border);
}

/**
 * Convert hex color to RGB values (space-separated for Tailwind)
 */
export function hexToRgb(hex: string): string {
	// Remove # if present
	const cleanHex = hex.replace('#', '');

	// Parse hex to RGB
	const r = parseInt(cleanHex.substring(0, 2), 16);
	const g = parseInt(cleanHex.substring(2, 4), 16);
	const b = parseInt(cleanHex.substring(4, 6), 16);

	return `${r} ${g} ${b}`;
}

/**
 * Get CSS variable value
 */
export function getCssVariable(name: string): string {
	return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Generate gradient string from primary and secondary colors
 */
export function generateGradient(
	combination: ColorCombination,
	direction: string = 'to right'
): string {
	return `linear-gradient(${direction}, ${combination.primary_color}, ${combination.secondary_color})`;
}

/**
 * Generate glow shadow from accent color
 */
export function generateGlow(combination: ColorCombination, intensity: number = 0.3): string {
	return `0 0 30px ${combination.accent_color}${Math.round(intensity * 255)
		.toString(16)
		.padStart(2, '0')}`;
}
