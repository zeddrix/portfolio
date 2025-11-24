/**
 * Svelte Actions for Animations
 * Use these actions to add scroll-triggered animations to elements
 */

import { animate } from 'motion';
import {
	createScrollObserver,
	fadeInUp,
	fadeIn,
	slideInLeft,
	slideInRight,
	scaleIn,
	defaultAnimationConfig,
	createParallax,
	type AnimationKeyframes
} from '$lib/utils/animations';

/**
 * Animation type for action parameter
 */
export type AnimationType = 'fadeInUp' | 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scaleIn';

/**
 * Parameters for the animate action
 */
export interface AnimateActionParams {
	type?: AnimationType;
	animation?: AnimationKeyframes;
	duration?: number;
	delay?: number;
	threshold?: number;
	rootMargin?: string;
	once?: boolean;
}

/**
 * Map animation types to their configurations
 */
const animationMap: Record<AnimationType, AnimationKeyframes> = {
	fadeInUp,
	fadeIn,
	slideInLeft,
	slideInRight,
	scaleIn
};

/**
 * Svelte action to animate element on scroll
 * @example
 * <div use:animate={{ type: 'fadeInUp' }}>Content</div>
 * <div use:animate={{ animation: customAnimation, duration: 1.0 }}>Content</div>
 */
export function animate_on_scroll(
	node: HTMLElement,
	params: AnimateActionParams = {}
): { destroy: () => void } {
	const {
		type = 'fadeInUp',
		animation,
		duration = defaultAnimationConfig.duration,
		delay = 0,
		threshold = 0.1,
		rootMargin = '0px 0px -10% 0px',
		once = true
	} = params;

	// Get animation config from type or use custom
	const animationConfig = animation || animationMap[type];

	// Set initial state (hidden)
	node.style.opacity = '0';

	// Create observer
	const observer = createScrollObserver(
		() => {
			// @ts-expect-error - Motion One's type definitions are complex, but this works at runtime
			animate(node, animationConfig, {
				duration,
				delay,
				easing: defaultAnimationConfig.easing
			});

			if (once) {
				observer.disconnect();
			}
		},
		{ threshold, rootMargin, once }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}

/**
 * Parameters for the parallax action
 */
export interface ParallaxActionParams {
	speed?: number;
}

/**
 * Svelte action to add parallax scroll effect
 * @example
 * <div use:parallax={{ speed: 0.5 }}>Content</div>
 */
export function parallax(
	node: HTMLElement,
	params: ParallaxActionParams = {}
): { destroy: () => void } {
	const { speed = 0.5 } = params;
	const cleanup = createParallax(node, speed);

	return {
		destroy() {
			cleanup();
		}
	};
}

/**
 * Parameters for the stagger children action
 */
export interface StaggerChildrenParams {
	type?: AnimationType;
	staggerDelay?: number;
	duration?: number;
	threshold?: number;
	once?: boolean;
}

/**
 * Svelte action to stagger animate children on scroll
 * @example
 * <ul use:stagger_children={{ type: 'fadeInUp', staggerDelay: 0.1 }}>
 *   <li>Item 1</li>
 *   <li>Item 2</li>
 *   <li>Item 3</li>
 * </ul>
 */
export function stagger_children(
	node: HTMLElement,
	params: StaggerChildrenParams = {}
): { destroy: () => void } {
	const {
		type = 'fadeInUp',
		staggerDelay = 0.1,
		duration = defaultAnimationConfig.duration,
		threshold = 0.1,
		once = true
	} = params;

	const animationConfig = animationMap[type];
	const children = Array.from(node.children) as HTMLElement[];

	// Set initial state for children
	children.forEach((child) => {
		child.style.opacity = '0';
	});

	const observer = createScrollObserver(
		() => {
			children.forEach((child, index) => {
				// @ts-expect-error - Motion One's type definitions are complex, but this works at runtime
				animate(child, animationConfig, {
					duration,
					delay: index * staggerDelay,
					easing: defaultAnimationConfig.easing
				});
			});

			if (once) {
				observer.disconnect();
			}
		},
		{ threshold, once }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}

/**
 * Svelte action for smooth scroll navigation
 * @example
 * <a href="#section" use:smooth_scroll>Link</a>
 */
export function smooth_scroll(node: HTMLAnchorElement): { destroy: () => void } {
	const handleClick = (event: MouseEvent) => {
		const href = node.getAttribute('href');
		if (!href || !href.startsWith('#')) return;

		event.preventDefault();
		const target = document.querySelector(href);

		if (target) {
			const headerOffset = 80; // Adjust based on your header height
			const elementPosition = target.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth'
			});
		}
	};

	node.addEventListener('click', handleClick);

	return {
		destroy() {
			node.removeEventListener('click', handleClick);
		}
	};
}
