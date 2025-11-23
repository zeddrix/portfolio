import { primary, neutral, semantic, background, text } from './src/lib/styles/colors';
import {
	fontFamilies,
	fontSizes,
	fontWeights,
	lineHeights,
	letterSpacing
} from './src/lib/styles/typography';
import { spacing, containerWidths, breakpoints } from './src/lib/styles/spacing';
import { durations, easings } from './src/lib/styles/animations';
import { borderRadius, borderWidths, shadows } from './src/lib/styles/borders';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		// Override default breakpoints with our design system
		screens: {
			sm: breakpoints.sm,
			md: breakpoints.md,
			lg: breakpoints.lg,
			xl: breakpoints.xl,
			'2xl': breakpoints['2xl']
		},
		extend: {
			// Colors
			colors: {
				primary: Object.fromEntries(
					Object.entries(primary).map(([key, value]) => [key, value.hex])
				),
				neutral: Object.fromEntries(
					Object.entries(neutral).map(([key, value]) => [key, value.hex])
				),
				success: semantic.success.hex,
				'success-light': semantic.successLight.hex,
				'success-dark': semantic.successDark.hex,
				error: semantic.error.hex,
				'error-light': semantic.errorLight.hex,
				'error-dark': semantic.errorDark.hex,
				warning: semantic.warning.hex,
				'warning-light': semantic.warningLight.hex,
				'warning-dark': semantic.warningDark.hex,
				info: semantic.info.hex,
				'info-light': semantic.infoLight.hex,
				'info-dark': semantic.infoDark.hex,
				'bg-primary': background.primary.hex,
				'bg-secondary': background.secondary.hex,
				'bg-tertiary': background.tertiary.hex,
				'bg-dark': background.dark.hex,
				'text-primary': text.primary.hex,
				'text-secondary': text.secondary.hex,
				'text-tertiary': text.tertiary.hex,
				'text-disabled': text.disabled.hex,
				'text-inverse': text.inverse.hex,
				'text-link': text.link.hex,
				'text-link-hover': text.linkHover.hex
			},
			// Typography
			fontFamily: {
				sans: fontFamilies.primary.stack.split(', '),
				mono: fontFamilies.mono.stack.split(', ')
			},
			fontSize: {
				xs: [fontSizes.xs.base, { lineHeight: fontSizes.xs.lineHeight }],
				sm: [fontSizes.sm.base, { lineHeight: fontSizes.sm.lineHeight }],
				base: [fontSizes.base.base, { lineHeight: fontSizes.base.lineHeight }],
				lg: [fontSizes.lg.base, { lineHeight: fontSizes.lg.lineHeight }],
				xl: [fontSizes.xl.base, { lineHeight: fontSizes.xl.lineHeight }],
				'2xl': [fontSizes['2xl'].base, { lineHeight: fontSizes['2xl'].lineHeight }],
				'3xl': [fontSizes['3xl'].base, { lineHeight: fontSizes['3xl'].lineHeight }],
				'4xl': [fontSizes['4xl'].base, { lineHeight: fontSizes['4xl'].lineHeight }],
				'5xl': [fontSizes['5xl'].base, { lineHeight: fontSizes['5xl'].lineHeight }],
				'6xl': [fontSizes['6xl'].base, { lineHeight: fontSizes['6xl'].lineHeight }]
			},
			fontWeight: fontWeights,
			lineHeight: lineHeights,
			letterSpacing: letterSpacing,
			// Spacing
			spacing: Object.fromEntries(Object.entries(spacing).map(([key, value]) => [key, value.rem])),
			// Container
			maxWidth: containerWidths,
			// Borders
			borderRadius: borderRadius,
			borderWidth: borderWidths,
			// Shadows
			boxShadow: Object.fromEntries(
				Object.entries(shadows).map(([key, value]) => [key, value.value])
			),
			// Animations
			transitionDuration: durations,
			transitionTimingFunction: easings,
			// Custom keyframe animations
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				fadeOut: {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				slideInUp: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				slideInDown: {
					'0%': { opacity: '0', transform: 'translateY(-20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				slideInLeft: {
					'0%': { opacity: '0', transform: 'translateX(-20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				slideInRight: {
					'0%': { opacity: '0', transform: 'translateX(20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				scaleIn: {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				scaleOut: {
					'0%': { opacity: '1', transform: 'scale(1)' },
					'100%': { opacity: '0', transform: 'scale(0.95)' }
				},
				spin: {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				pulse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				bounce: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			},
			animation: {
				'fade-in': 'fadeIn 300ms ease-out',
				'fade-out': 'fadeOut 150ms ease-in',
				'slide-in-up': 'slideInUp 300ms ease-out',
				'slide-in-down': 'slideInDown 300ms ease-out',
				'slide-in-left': 'slideInLeft 300ms ease-out',
				'slide-in-right': 'slideInRight 300ms ease-out',
				'scale-in': 'scaleIn 300ms ease-out',
				'scale-out': 'scaleOut 150ms ease-in',
				spin: 'spin 1s linear infinite',
				pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				bounce: 'bounce 1s ease-in-out infinite'
			}
		}
	},
	plugins: []
};
