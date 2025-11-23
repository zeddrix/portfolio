/**
 * Border and Shadow Design Tokens
 *
 * Squarespace-inspired borders, radius, and elevation system.
 * Includes border widths, radius scale, and layered shadow definitions.
 */

export interface ShadowToken {
	value: string;
	description: string;
}

/**
 * Border Width Scale
 * Consistent border thickness values
 */
export const borderWidths = {
	0: '0px',
	1: '1px',
	2: '2px',
	4: '4px',
	8: '8px'
} as const;

/**
 * Border Radius Scale
 * Rounded corner values for various UI elements
 *
 * Usage guidelines:
 * - none: Sharp corners (cards, containers in some contexts)
 * - sm: Subtle rounding (buttons, inputs)
 * - md: Standard rounding (cards, modals)
 * - lg: Prominent rounding (large cards, images)
 * - xl: Very rounded (badges, pills)
 * - 2xl-3xl: Highly rounded elements
 * - full: Perfect circles (avatars, icon buttons)
 */
export const borderRadius = {
	none: '0px',
	sm: '0.125rem', // 2px
	md: '0.375rem', // 6px
	lg: '0.5rem', // 8px
	xl: '0.75rem', // 12px
	'2xl': '1rem', // 16px
	'3xl': '1.5rem', // 24px
	full: '9999px'
} as const;

/**
 * Box Shadow Definitions
 * Elevation system with subtle, layered shadows
 *
 * Follows Material Design elevation principles:
 * - xs: Minimal elevation (hover states)
 * - sm: Slight elevation (cards at rest)
 * - md: Moderate elevation (dropdowns, popovers)
 * - lg: High elevation (modals, dialogs)
 * - xl: Very high elevation (notifications)
 * - 2xl: Maximum elevation (overlays)
 *
 * Each shadow uses multiple layers for depth and realism
 */
export const shadows = {
	none: {
		value: 'none',
		description: 'No shadow'
	},
	xs: {
		value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
		description: 'Minimal shadow for subtle hover states'
	},
	sm: {
		value: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
		description: 'Small shadow for cards and containers'
	},
	md: {
		value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
		description: 'Medium shadow for elevated elements'
	},
	lg: {
		value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
		description: 'Large shadow for modals and popovers'
	},
	xl: {
		value: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
		description: 'Extra large shadow for high elevation'
	},
	'2xl': {
		value: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
		description: 'Maximum shadow for prominent overlays'
	},
	inner: {
		value: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
		description: 'Inset shadow for pressed states'
	}
} as const;

/**
 * Focus Ring Definitions
 * Accessible focus indicators for interactive elements
 */
export const focusRings = {
	default: {
		width: '2px',
		offset: '2px',
		color: 'rgba(14, 165, 233, 0.5)', // primary-500 with opacity
		style: 'solid'
	},
	error: {
		width: '2px',
		offset: '2px',
		color: 'rgba(239, 68, 68, 0.5)', // error with opacity
		style: 'solid'
	},
	success: {
		width: '2px',
		offset: '2px',
		color: 'rgba(16, 185, 129, 0.5)', // success with opacity
		style: 'solid'
	}
} as const;

/**
 * Outline Styles
 * Used for outlined button variants and borders
 */
export const outlines = {
	default: {
		width: borderWidths[1],
		color: 'rgba(212, 212, 212, 1)', // neutral-300
		style: 'solid'
	},
	thick: {
		width: borderWidths[2],
		color: 'rgba(212, 212, 212, 1)', // neutral-300
		style: 'solid'
	},
	primary: {
		width: borderWidths[1],
		color: 'rgba(14, 165, 233, 1)', // primary-500
		style: 'solid'
	},
	dashed: {
		width: borderWidths[1],
		color: 'rgba(212, 212, 212, 1)', // neutral-300
		style: 'dashed'
	}
} as const;

/**
 * Divider Styles
 * Horizontal and vertical separators
 */
export const dividers = {
	horizontal: {
		width: borderWidths[1],
		color: 'rgba(229, 229, 229, 1)', // neutral-200
		style: 'solid'
	},
	vertical: {
		width: borderWidths[1],
		color: 'rgba(229, 229, 229, 1)', // neutral-200
		style: 'solid'
	},
	thick: {
		width: borderWidths[2],
		color: 'rgba(212, 212, 212, 1)', // neutral-300
		style: 'solid'
	}
} as const;

/**
 * Export all border and shadow tokens
 */
export const borders = {
	widths: borderWidths,
	radius: borderRadius,
	shadows,
	focusRings,
	outlines,
	dividers
};
