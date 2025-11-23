/**
 * Animation Design Tokens
 *
 * Squarespace-inspired animation system with smooth, purposeful motion.
 * Includes duration scales, easing functions, and common transitions.
 */

export interface AnimationToken {
	duration: string;
	easing: string;
	property?: string;
}

/**
 * Animation Durations
 * Consistent timing scale for all animations
 *
 * Usage guidelines:
 * - instant: State changes with no animation
 * - fast: Micro-interactions (hover, focus)
 * - normal: Standard transitions (modals, dropdowns)
 * - slow: Page transitions, complex animations
 * - slower: Large layout changes, hero animations
 */
export const durations = {
	instant: '0ms',
	fast: '150ms',
	normal: '300ms',
	slow: '500ms',
	slower: '700ms'
} as const;

/**
 * Easing Functions
 * Cubic bezier curves for natural motion
 *
 * Usage guidelines:
 * - linear: Constant speed (loading spinners)
 * - easeIn: Accelerating (elements leaving)
 * - easeOut: Decelerating (elements entering)
 * - easeInOut: Both (smooth transitions)
 * - spring: Bouncy, energetic (attention-grabbing)
 * - smooth: Very smooth, polished (Squarespace-style)
 */
export const easings = {
	linear: 'linear',
	easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
	easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
	easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
	spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
	smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
} as const;

/**
 * Common Transition Combinations
 * Pre-configured transitions for common use cases
 */
export const transitions = {
	// Hover effects
	buttonHover: {
		duration: durations.fast,
		easing: easings.easeOut,
		property: 'background-color, color, transform, box-shadow'
	},
	linkHover: {
		duration: durations.fast,
		easing: easings.easeOut,
		property: 'color, opacity'
	},
	cardHover: {
		duration: durations.normal,
		easing: easings.easeOut,
		property: 'transform, box-shadow'
	},
	// State changes
	fadeIn: {
		duration: durations.normal,
		easing: easings.easeOut,
		property: 'opacity'
	},
	fadeOut: {
		duration: durations.fast,
		easing: easings.easeIn,
		property: 'opacity'
	},
	slideIn: {
		duration: durations.normal,
		easing: easings.easeOut,
		property: 'transform, opacity'
	},
	slideOut: {
		duration: durations.fast,
		easing: easings.easeIn,
		property: 'transform, opacity'
	},
	// Modal and overlay
	modalEnter: {
		duration: durations.normal,
		easing: easings.smooth,
		property: 'opacity, transform'
	},
	modalExit: {
		duration: durations.fast,
		easing: easings.easeIn,
		property: 'opacity, transform'
	},
	overlayEnter: {
		duration: durations.normal,
		easing: easings.easeOut,
		property: 'opacity'
	},
	overlayExit: {
		duration: durations.fast,
		easing: easings.easeIn,
		property: 'opacity'
	},
	// Mobile menu
	menuSlideIn: {
		duration: durations.normal,
		easing: easings.smooth,
		property: 'transform'
	},
	menuSlideOut: {
		duration: durations.fast,
		easing: easings.easeIn,
		property: 'transform'
	},
	// Form inputs
	inputFocus: {
		duration: durations.fast,
		easing: easings.easeOut,
		property: 'border-color, box-shadow'
	},
	// Generic
	all: {
		duration: durations.normal,
		easing: easings.easeInOut,
		property: 'all'
	},
	colors: {
		duration: durations.fast,
		easing: easings.easeOut,
		property: 'background-color, border-color, color, fill, stroke'
	},
	opacity: {
		duration: durations.normal,
		easing: easings.easeInOut,
		property: 'opacity'
	},
	transform: {
		duration: durations.normal,
		easing: easings.easeOut,
		property: 'transform'
	}
} as const;

/**
 * Keyframe Animations
 * Named animation sequences for complex effects
 */
export const keyframes = {
	// Fade animations
	fadeIn: {
		name: 'fadeIn',
		definition: `
			@keyframes fadeIn {
				from { opacity: 0; }
				to { opacity: 1; }
			}
		`
	},
	fadeOut: {
		name: 'fadeOut',
		definition: `
			@keyframes fadeOut {
				from { opacity: 1; }
				to { opacity: 0; }
			}
		`
	},
	// Slide animations
	slideInUp: {
		name: 'slideInUp',
		definition: `
			@keyframes slideInUp {
				from {
					opacity: 0;
					transform: translateY(20px);
				}
				to {
					opacity: 1;
					transform: translateY(0);
				}
			}
		`
	},
	slideInDown: {
		name: 'slideInDown',
		definition: `
			@keyframes slideInDown {
				from {
					opacity: 0;
					transform: translateY(-20px);
				}
				to {
					opacity: 1;
					transform: translateY(0);
				}
			}
		`
	},
	slideInLeft: {
		name: 'slideInLeft',
		definition: `
			@keyframes slideInLeft {
				from {
					opacity: 0;
					transform: translateX(-20px);
				}
				to {
					opacity: 1;
					transform: translateX(0);
				}
			}
		`
	},
	slideInRight: {
		name: 'slideInRight',
		definition: `
			@keyframes slideInRight {
				from {
					opacity: 0;
					transform: translateX(20px);
				}
				to {
					opacity: 1;
					transform: translateX(0);
				}
			}
		`
	},
	// Scale animations
	scaleIn: {
		name: 'scaleIn',
		definition: `
			@keyframes scaleIn {
				from {
					opacity: 0;
					transform: scale(0.95);
				}
				to {
					opacity: 1;
					transform: scale(1);
				}
			}
		`
	},
	scaleOut: {
		name: 'scaleOut',
		definition: `
			@keyframes scaleOut {
				from {
					opacity: 1;
					transform: scale(1);
				}
				to {
					opacity: 0;
					transform: scale(0.95);
				}
			}
		`
	},
	// Spin animation (for loading)
	spin: {
		name: 'spin',
		definition: `
			@keyframes spin {
				from { transform: rotate(0deg); }
				to { transform: rotate(360deg); }
			}
		`
	},
	// Pulse animation (for loading/attention)
	pulse: {
		name: 'pulse',
		definition: `
			@keyframes pulse {
				0%, 100% { opacity: 1; }
				50% { opacity: 0.5; }
			}
		`
	},
	// Bounce animation
	bounce: {
		name: 'bounce',
		definition: `
			@keyframes bounce {
				0%, 100% {
					transform: translateY(0);
				}
				50% {
					transform: translateY(-10px);
				}
			}
		`
	}
} as const;

/**
 * Export all animation tokens
 */
export const animations = {
	durations,
	easings,
	transitions,
	keyframes
};
