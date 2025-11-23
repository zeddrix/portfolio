/**
 * Color Design Tokens
 *
 * Squarespace-inspired color palette with semantic naming.
 * Organized by usage category for clarity and maintainability.
 */

export interface ColorToken {
	hex: string;
	rgb: string;
	hsl: string;
}

export interface ColorPalette {
	primary: Record<string, ColorToken>;
	neutral: Record<string, ColorToken>;
	semantic: Record<string, ColorToken>;
	background: Record<string, ColorToken>;
	text: Record<string, ColorToken>;
}

/**
 * Primary Colors
 * Used for brand identity, primary CTAs, and interactive elements
 */
export const primary = {
	50: { hex: '#f0f9ff', rgb: '240, 249, 255', hsl: '204, 100%, 97%' },
	100: { hex: '#e0f2fe', rgb: '224, 242, 254', hsl: '204, 100%, 94%' },
	200: { hex: '#bae6fd', rgb: '186, 230, 253', hsl: '201, 94%, 86%' },
	300: { hex: '#7dd3fc', rgb: '125, 211, 252', hsl: '199, 95%, 74%' },
	400: { hex: '#38bdf8', rgb: '56, 189, 248', hsl: '199, 93%, 60%' },
	500: { hex: '#0ea5e9', rgb: '14, 165, 233', hsl: '199, 89%, 48%' },
	600: { hex: '#0284c7', rgb: '2, 132, 199', hsl: '200, 98%, 39%' },
	700: { hex: '#0369a1', rgb: '3, 105, 161', hsl: '201, 96%, 32%' },
	800: { hex: '#075985', rgb: '7, 89, 133', hsl: '201, 90%, 27%' },
	900: { hex: '#0c4a6e', rgb: '12, 74, 110', hsl: '202, 80%, 24%' }
} as const;

/**
 * Neutral Colors
 * Used for UI elements, borders, backgrounds, and text hierarchy
 */
export const neutral = {
	0: { hex: '#ffffff', rgb: '255, 255, 255', hsl: '0, 0%, 100%' },
	50: { hex: '#fafafa', rgb: '250, 250, 250', hsl: '0, 0%, 98%' },
	100: { hex: '#f5f5f5', rgb: '245, 245, 245', hsl: '0, 0%, 96%' },
	200: { hex: '#e5e5e5', rgb: '229, 229, 229', hsl: '0, 0%, 90%' },
	300: { hex: '#d4d4d4', rgb: '212, 212, 212', hsl: '0, 0%, 83%' },
	400: { hex: '#a3a3a3', rgb: '163, 163, 163', hsl: '0, 0%, 64%' },
	500: { hex: '#737373', rgb: '115, 115, 115', hsl: '0, 0%, 45%' },
	600: { hex: '#525252', rgb: '82, 82, 82', hsl: '0, 0%, 32%' },
	700: { hex: '#404040', rgb: '64, 64, 64', hsl: '0, 0%, 25%' },
	800: { hex: '#262626', rgb: '38, 38, 38', hsl: '0, 0%, 15%' },
	900: { hex: '#171717', rgb: '23, 23, 23', hsl: '0, 0%, 9%' },
	950: { hex: '#0a0a0a', rgb: '10, 10, 10', hsl: '0, 0%, 4%' }
} as const;

/**
 * Semantic Colors
 * Used for feedback states and alerts
 */
export const semantic = {
	success: { hex: '#10b981', rgb: '16, 185, 129', hsl: '160, 84%, 39%' },
	successLight: { hex: '#d1fae5', rgb: '209, 250, 229', hsl: '149, 80%, 90%' },
	successDark: { hex: '#047857', rgb: '4, 120, 87', hsl: '160, 94%, 24%' },
	error: { hex: '#ef4444', rgb: '239, 68, 68', hsl: '0, 84%, 60%' },
	errorLight: { hex: '#fee2e2', rgb: '254, 226, 226', hsl: '0, 93%, 94%' },
	errorDark: { hex: '#991b1b', rgb: '153, 27, 27', hsl: '0, 70%, 35%' },
	warning: { hex: '#f59e0b', rgb: '245, 158, 11', hsl: '38, 92%, 50%' },
	warningLight: { hex: '#fef3c7', rgb: '254, 243, 199', hsl: '48, 96%, 89%' },
	warningDark: { hex: '#92400e', rgb: '146, 64, 14', hsl: '23, 83%, 31%' },
	info: { hex: '#3b82f6', rgb: '59, 130, 246', hsl: '217, 91%, 60%' },
	infoLight: { hex: '#dbeafe', rgb: '219, 234, 254', hsl: '214, 95%, 93%' },
	infoDark: { hex: '#1e40af', rgb: '30, 64, 175', hsl: '224, 76%, 40%' }
} as const;

/**
 * Background Colors
 * Used for page and section backgrounds
 */
export const background = {
	primary: { hex: '#ffffff', rgb: '255, 255, 255', hsl: '0, 0%, 100%' },
	secondary: { hex: '#fafafa', rgb: '250, 250, 250', hsl: '0, 0%, 98%' },
	tertiary: { hex: '#f5f5f5', rgb: '245, 245, 245', hsl: '0, 0%, 96%' },
	dark: { hex: '#0a0a0a', rgb: '10, 10, 10', hsl: '0, 0%, 4%' },
	overlay: { hex: '#000000', rgb: '0, 0, 0', hsl: '0, 0%, 0%' }
} as const;

/**
 * Text Colors
 * Used for typography with appropriate contrast ratios
 */
export const text = {
	primary: { hex: '#171717', rgb: '23, 23, 23', hsl: '0, 0%, 9%' },
	secondary: { hex: '#525252', rgb: '82, 82, 82', hsl: '0, 0%, 32%' },
	tertiary: { hex: '#737373', rgb: '115, 115, 115', hsl: '0, 0%, 45%' },
	disabled: { hex: '#a3a3a3', rgb: '163, 163, 163', hsl: '0, 0%, 64%' },
	inverse: { hex: '#ffffff', rgb: '255, 255, 255', hsl: '0, 0%, 100%' },
	link: { hex: '#0ea5e9', rgb: '14, 165, 233', hsl: '199, 89%, 48%' },
	linkHover: { hex: '#0284c7', rgb: '2, 132, 199', hsl: '200, 98%, 39%' }
} as const;

/**
 * Complete Color Palette
 * Exported for use in design system documentation
 */
export const colors: ColorPalette = {
	primary,
	neutral,
	semantic,
	background,
	text
};
