/**
 * Typography Design Tokens
 *
 * Squarespace-inspired typography system with modular scale.
 * Includes font families, sizes, weights, line heights, and letter spacing.
 */

export interface FontFamily {
	name: string;
	fallback: string;
	stack: string;
}

export interface FontSize {
	base: string;
	sm?: string;
	md?: string;
	lg?: string;
	xl?: string;
}

export interface TypographyToken {
	fontSize: FontSize;
	fontWeight: number;
	lineHeight: string;
	letterSpacing?: string;
}

/**
 * Font Families
 * Primary: For headings and emphasis
 * Secondary: For body text and UI
 * Mono: For code and technical content
 */
export const fontFamilies = {
	primary: {
		name: 'Inter',
		fallback: 'system-ui',
		stack:
			'"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
	},
	secondary: {
		name: 'Inter',
		fallback: 'system-ui',
		stack:
			'"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
	},
	mono: {
		name: 'JetBrains Mono',
		fallback: 'monospace',
		stack: '"JetBrains Mono", "Fira Code", Consolas, Monaco, "Courier New", monospace'
	}
} as const;

/**
 * Font Weight Scale
 * Defines available font weights for typography hierarchy
 */
export const fontWeights = {
	thin: 100,
	extralight: 200,
	light: 300,
	normal: 400,
	medium: 500,
	semibold: 600,
	bold: 700,
	extrabold: 800,
	black: 900
} as const;

/**
 * Font Size Scale (Mobile-First with Responsive Values)
 * Base: Mobile size
 * sm: Small tablets (640px+)
 * md: Tablets (768px+)
 * lg: Desktop (1024px+)
 * xl: Large desktop (1280px+)
 */
export const fontSizes = {
	xs: {
		base: '0.75rem', // 12px
		lineHeight: '1rem' // 16px
	},
	sm: {
		base: '0.875rem', // 14px
		lineHeight: '1.25rem' // 20px
	},
	base: {
		base: '1rem', // 16px
		lineHeight: '1.5rem' // 24px
	},
	lg: {
		base: '1.125rem', // 18px
		lineHeight: '1.75rem' // 28px
	},
	xl: {
		base: '1.25rem', // 20px
		md: '1.5rem', // 24px
		lineHeight: '1.75rem' // 28px
	},
	'2xl': {
		base: '1.5rem', // 24px
		md: '1.875rem', // 30px
		lineHeight: '2rem' // 32px
	},
	'3xl': {
		base: '1.875rem', // 30px
		md: '2.25rem', // 36px
		lineHeight: '2.25rem' // 36px
	},
	'4xl': {
		base: '2.25rem', // 36px
		md: '3rem', // 48px
		lg: '3.5rem', // 56px
		lineHeight: '2.5rem' // 40px
	},
	'5xl': {
		base: '3rem', // 48px
		md: '3.75rem', // 60px
		lg: '4.5rem', // 72px
		lineHeight: '1' // Tight
	},
	'6xl': {
		base: '3.75rem', // 60px
		md: '4.5rem', // 72px
		lg: '6rem', // 96px
		lineHeight: '1' // Tight
	}
} as const;

/**
 * Line Height Scale
 * Used for consistent vertical rhythm
 */
export const lineHeights = {
	none: '1',
	tight: '1.25',
	snug: '1.375',
	normal: '1.5',
	relaxed: '1.625',
	loose: '2'
} as const;

/**
 * Letter Spacing Scale
 * Used for fine-tuning typography
 */
export const letterSpacing = {
	tighter: '-0.05em',
	tight: '-0.025em',
	normal: '0em',
	wide: '0.025em',
	wider: '0.05em',
	widest: '0.1em'
} as const;

/**
 * Typography Presets
 * Pre-configured combinations for common use cases
 */
export const typographyPresets = {
	// Headings
	h1: {
		fontSize: fontSizes['5xl'],
		fontWeight: fontWeights.bold,
		lineHeight: lineHeights.tight,
		letterSpacing: letterSpacing.tight
	},
	h2: {
		fontSize: fontSizes['4xl'],
		fontWeight: fontWeights.bold,
		lineHeight: lineHeights.tight,
		letterSpacing: letterSpacing.tight
	},
	h3: {
		fontSize: fontSizes['3xl'],
		fontWeight: fontWeights.semibold,
		lineHeight: lineHeights.snug,
		letterSpacing: letterSpacing.normal
	},
	h4: {
		fontSize: fontSizes['2xl'],
		fontWeight: fontWeights.semibold,
		lineHeight: lineHeights.snug,
		letterSpacing: letterSpacing.normal
	},
	h5: {
		fontSize: fontSizes.xl,
		fontWeight: fontWeights.semibold,
		lineHeight: lineHeights.normal,
		letterSpacing: letterSpacing.normal
	},
	h6: {
		fontSize: fontSizes.lg,
		fontWeight: fontWeights.semibold,
		lineHeight: lineHeights.normal,
		letterSpacing: letterSpacing.normal
	},
	// Body text
	bodyLarge: {
		fontSize: fontSizes.lg,
		fontWeight: fontWeights.normal,
		lineHeight: lineHeights.relaxed,
		letterSpacing: letterSpacing.normal
	},
	body: {
		fontSize: fontSizes.base,
		fontWeight: fontWeights.normal,
		lineHeight: lineHeights.normal,
		letterSpacing: letterSpacing.normal
	},
	bodySmall: {
		fontSize: fontSizes.sm,
		fontWeight: fontWeights.normal,
		lineHeight: lineHeights.normal,
		letterSpacing: letterSpacing.normal
	},
	// Utility
	caption: {
		fontSize: fontSizes.xs,
		fontWeight: fontWeights.normal,
		lineHeight: lineHeights.normal,
		letterSpacing: letterSpacing.wide
	},
	overline: {
		fontSize: fontSizes.xs,
		fontWeight: fontWeights.semibold,
		lineHeight: lineHeights.normal,
		letterSpacing: letterSpacing.widest
	},
	button: {
		fontSize: fontSizes.sm,
		fontWeight: fontWeights.semibold,
		lineHeight: lineHeights.normal,
		letterSpacing: letterSpacing.wide
	},
	link: {
		fontSize: fontSizes.base,
		fontWeight: fontWeights.medium,
		lineHeight: lineHeights.normal,
		letterSpacing: letterSpacing.normal
	}
} as const;

/**
 * Export all typography tokens
 */
export const typography = {
	fontFamilies,
	fontWeights,
	fontSizes,
	lineHeights,
	letterSpacing,
	presets: typographyPresets
};
