/**
 * Animation Utilities using Motion One
 * Provides scroll-triggered animations, transitions, and performance-optimized effects
 * Mobile-optimized with reduced motion detection
 */

import { animate, stagger } from 'motion';

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
	if (typeof window === 'undefined') return false;
	return window.innerWidth < 768 || 'ontouchstart' in window;
}

/**
 * Get animation config based on device and user preferences
 */
export function getAnimationConfig() {
	const reducedMotion = prefersReducedMotion();
	const isMobile = isMobileDevice();

	return {
		shouldAnimate: !reducedMotion,
		duration: reducedMotion ? 0 : isMobile ? 0.3 : 0.5,
		reduceDuration: isMobile ? 0.6 : 1,
		reduceComplexity: isMobile || reducedMotion
	};
}

/**
 * Intersection Observer configuration for scroll animations
 */
export interface ScrollAnimationOptions {
	threshold?: number;
	rootMargin?: string;
	once?: boolean;
}

/**
 * Creates an Intersection Observer for scroll-triggered animations
 * @param callback - Function to call when element enters viewport
 * @param options - Observer configuration options
 * @returns IntersectionObserver instance
 */
export function createScrollObserver(
	callback: (entry: IntersectionObserverEntry) => void,
	options: ScrollAnimationOptions = {}
): IntersectionObserver {
	const { threshold = 0.1, rootMargin = '0px 0px -10% 0px', once = true } = options;

	const observedElements = new WeakSet<Element>();

	return new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					if (once && observedElements.has(entry.target)) {
						return;
					}
					observedElements.add(entry.target);
					callback(entry);
				}
			});
		},
		{ threshold, rootMargin }
	);
}

/**
 * Animation keyframes type
 */
export interface AnimationKeyframes {
	opacity?: number[];
	transform?: string[];
}

/**
 * Fade in animation from bottom
 */
export const fadeInUp: AnimationKeyframes = {
	opacity: [0, 1],
	transform: ['translateY(30px)', 'translateY(0)']
};

/**
 * Fade in animation
 */
export const fadeIn: AnimationKeyframes = {
	opacity: [0, 1]
};

/**
 * Slide in from left
 */
export const slideInLeft: AnimationKeyframes = {
	opacity: [0, 1],
	transform: ['translateX(-30px)', 'translateX(0)']
};

/**
 * Slide in from right
 */
export const slideInRight: AnimationKeyframes = {
	opacity: [0, 1],
	transform: ['translateX(30px)', 'translateX(0)']
};

/**
 * Scale and fade in
 */
export const scaleIn: AnimationKeyframes = {
	opacity: [0, 1],
	transform: ['scale(0.9)', 'scale(1)']
};

/**
 * Default animation duration and easing
 */
export const defaultAnimationConfig = {
	duration: 0.6,
	easing: [0.25, 0.46, 0.45, 0.94] // easeOutQuad
};

/**
 * Fast animation config
 */
export const fastAnimationConfig = {
	duration: 0.3,
	easing: [0.25, 0.46, 0.45, 0.94]
};

/**
 * Slow animation config
 */
export const slowAnimationConfig = {
	duration: 1.0,
	easing: [0.25, 0.46, 0.45, 0.94]
};

/**
 * Animates elements with stagger effect
 * @param elements - Elements to animate
 * @param animation - Animation keyframes
 * @param staggerDelay - Delay between each element (seconds)
 */
export function animateStagger(
	elements: Element | Element[],
	animation: AnimationKeyframes,
	staggerDelay: number = 0.1
) {
	// @ts-expect-error - Motion One's type definitions are complex, but this works at runtime
	return animate(elements, animation, {
		...defaultAnimationConfig,
		delay: stagger(staggerDelay)
	});
}

/**
 * Smooth scroll to element
 * @param target - Element or selector to scroll to
 * @param offset - Offset from top (pixels)
 */
export function smoothScrollTo(target: string | Element, offset: number = 0) {
	const element = typeof target === 'string' ? document.querySelector(target) : target;

	if (!element) return;

	const elementPosition = element.getBoundingClientRect().top;
	const offsetPosition = elementPosition + window.pageYOffset - offset;

	window.scrollTo({
		top: offsetPosition,
		behavior: 'smooth'
	});
}

/**
 * Animates element on scroll into view
 * @param element - Element to animate
 * @param animation - Animation keyframes
 * @param options - Scroll animation options
 */
export function animateOnScroll(
	element: Element,
	animation: AnimationKeyframes,
	options: ScrollAnimationOptions = {}
) {
	const observer = createScrollObserver(() => {
		// @ts-expect-error - Motion One's type definitions are complex, but this works at runtime
		animate(element, animation, defaultAnimationConfig);
		if (options.once !== false) {
			observer.disconnect();
		}
	}, options);

	observer.observe(element);

	return () => observer.disconnect();
}

/**
 * Parallax scroll effect
 * @param element - Element to apply parallax
 * @param speed - Parallax speed (0.1 to 1.0, lower = slower)
 */
export function createParallax(element: Element, speed: number = 0.5) {
	let rafId: number | null = null;

	const handleScroll = () => {
		if (rafId) return;

		rafId = requestAnimationFrame(() => {
			const scrolled = window.pageYOffset;
			const elementTop = element.getBoundingClientRect().top + scrolled;
			const distance = scrolled - elementTop;
			const offset = distance * speed;

			(element as HTMLElement).style.transform = `translateY(${offset}px)`;
			rafId = null;
		});
	};

	window.addEventListener('scroll', handleScroll, { passive: true });

	return () => {
		if (rafId) cancelAnimationFrame(rafId);
		window.removeEventListener('scroll', handleScroll);
	};
}

/**
 * Layout transition animation when switching layouts
 */
export function animateLayoutTransition(element: Element) {
	const keyframes: AnimationKeyframes = {
		opacity: [0, 1],
		transform: ['scale(0.98)', 'scale(1)']
	};

	// @ts-expect-error - Motion One's type definitions are complex, but this works at runtime
	return animate(element, keyframes, {
		duration: 0.4,
		easing: [0.25, 0.46, 0.45, 0.94]
	});
}
