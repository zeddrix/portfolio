/**
 * Spacing Design Tokens
 *
 * Consistent spacing scale based on 4px base unit system.
 * Used for padding, margin, gap, and positioning.
 */

export interface SpacingToken {
	px: string;
	rem: string;
}

/**
 * Base Unit: 4px (0.25rem)
 * All spacing values are multiples of the base unit for consistency
 */
const BASE_UNIT = 4;

/**
 * Spacing Scale
 * Follows a consistent multiplier pattern for predictable layouts
 *
 * Usage guidelines:
 * - 0-2: Fine adjustments, small gaps
 * - 3-6: Component internal spacing
 * - 8-12: Component external spacing, section padding
 * - 16-24: Large section spacing, hero padding
 * - 32+: Exceptional cases, large layout spacing
 */
export const spacing = {
	0: {
		px: '0px',
		rem: '0rem'
	},
	1: {
		px: `${BASE_UNIT}px`,
		rem: '0.25rem'
	},
	2: {
		px: `${BASE_UNIT * 2}px`,
		rem: '0.5rem'
	},
	3: {
		px: `${BASE_UNIT * 3}px`,
		rem: '0.75rem'
	},
	4: {
		px: `${BASE_UNIT * 4}px`,
		rem: '1rem'
	},
	5: {
		px: `${BASE_UNIT * 5}px`,
		rem: '1.25rem'
	},
	6: {
		px: `${BASE_UNIT * 6}px`,
		rem: '1.5rem'
	},
	7: {
		px: `${BASE_UNIT * 7}px`,
		rem: '1.75rem'
	},
	8: {
		px: `${BASE_UNIT * 8}px`,
		rem: '2rem'
	},
	9: {
		px: `${BASE_UNIT * 9}px`,
		rem: '2.25rem'
	},
	10: {
		px: `${BASE_UNIT * 10}px`,
		rem: '2.5rem'
	},
	11: {
		px: `${BASE_UNIT * 11}px`,
		rem: '2.75rem'
	},
	12: {
		px: `${BASE_UNIT * 12}px`,
		rem: '3rem'
	},
	14: {
		px: `${BASE_UNIT * 14}px`,
		rem: '3.5rem'
	},
	16: {
		px: `${BASE_UNIT * 16}px`,
		rem: '4rem'
	},
	20: {
		px: `${BASE_UNIT * 20}px`,
		rem: '5rem'
	},
	24: {
		px: `${BASE_UNIT * 24}px`,
		rem: '6rem'
	},
	28: {
		px: `${BASE_UNIT * 28}px`,
		rem: '7rem'
	},
	32: {
		px: `${BASE_UNIT * 32}px`,
		rem: '8rem'
	},
	36: {
		px: `${BASE_UNIT * 36}px`,
		rem: '9rem'
	},
	40: {
		px: `${BASE_UNIT * 40}px`,
		rem: '10rem'
	},
	44: {
		px: `${BASE_UNIT * 44}px`,
		rem: '11rem'
	},
	48: {
		px: `${BASE_UNIT * 48}px`,
		rem: '12rem'
	},
	52: {
		px: `${BASE_UNIT * 52}px`,
		rem: '13rem'
	},
	56: {
		px: `${BASE_UNIT * 56}px`,
		rem: '14rem'
	},
	60: {
		px: `${BASE_UNIT * 60}px`,
		rem: '15rem'
	},
	64: {
		px: `${BASE_UNIT * 64}px`,
		rem: '16rem'
	},
	72: {
		px: `${BASE_UNIT * 72}px`,
		rem: '18rem'
	},
	80: {
		px: `${BASE_UNIT * 80}px`,
		rem: '20rem'
	},
	96: {
		px: `${BASE_UNIT * 96}px`,
		rem: '24rem'
	}
} as const;

/**
 * Common Spacing Patterns
 * Pre-defined combinations for common use cases
 */
export const spacingPatterns = {
	// Button padding
	buttonSmall: {
		x: spacing[3],
		y: spacing[2]
	},
	buttonMedium: {
		x: spacing[4],
		y: spacing[2]
	},
	buttonLarge: {
		x: spacing[6],
		y: spacing[3]
	},
	// Card padding
	cardSmall: spacing[4],
	cardMedium: spacing[6],
	cardLarge: spacing[8],
	// Section padding
	sectionSmall: {
		y: spacing[12],
		x: spacing[4]
	},
	sectionMedium: {
		y: spacing[16],
		x: spacing[6]
	},
	sectionLarge: {
		y: spacing[24],
		x: spacing[8]
	},
	// Container padding
	containerMobile: spacing[4],
	containerTablet: spacing[6],
	containerDesktop: spacing[8],
	// Grid gaps
	gridTight: spacing[2],
	gridNormal: spacing[4],
	gridRelaxed: spacing[6],
	gridLoose: spacing[8]
} as const;

/**
 * Container Max Widths
 * Defines maximum content widths for responsive layouts
 */
export const containerWidths = {
	sm: '640px',
	md: '768px',
	lg: '1024px',
	xl: '1280px',
	'2xl': '1536px',
	full: '100%'
} as const;

/**
 * Breakpoints
 * Media query breakpoints for responsive design
 */
export const breakpoints = {
	sm: '640px',
	md: '768px',
	lg: '1024px',
	xl: '1280px',
	'2xl': '1536px'
} as const;
