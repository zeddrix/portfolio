/**
 * Hero animation actions for different animation types
 * Supports: fade_up, typewriter, slide_in
 */

import type { HeroAnimationType } from '$lib/types/database';

interface AnimationOptions {
	type: HeroAnimationType;
	delay?: number;
	duration?: number;
}

/**
 * Apply hero animation to an element
 */
export function heroAnimation(node: HTMLElement, options: AnimationOptions) {
	const { type, delay = 0, duration = 800 } = options;

	// Set initial state
	node.style.opacity = '0';

	switch (type) {
		case 'fade_up':
			node.style.transform = 'translateY(30px)';
			break;
		case 'slide_in':
			node.style.transform = 'translateX(-50px)';
			break;
		case 'typewriter':
			// For typewriter, we'll handle it differently
			break;
	}

	// Trigger animation after delay
	const timeoutId = setTimeout(() => {
		node.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
		node.style.opacity = '1';
		node.style.transform = 'translateY(0) translateX(0)';

		if (type === 'typewriter') {
			typewriterEffect(node, duration);
		}
	}, delay);

	return {
		destroy() {
			clearTimeout(timeoutId);
		}
	};
}

/**
 * Typewriter effect for text elements
 */
function typewriterEffect(node: HTMLElement, duration: number) {
	const text = node.textContent || '';
	const chars = text.split('');
	node.textContent = '';
	node.style.opacity = '1';

	const charDelay = duration / chars.length;

	chars.forEach((char, index) => {
		setTimeout(() => {
			node.textContent += char;
		}, index * charDelay);
	});
}

/**
 * Staggered animation for multiple elements
 */
export function staggerAnimation(
	node: HTMLElement,
	options: { type: HeroAnimationType; index: number; baseDelay?: number; staggerDelay?: number }
) {
	const { type, index, baseDelay = 0, staggerDelay = 150 } = options;
	const delay = baseDelay + index * staggerDelay;

	return heroAnimation(node, { type, delay });
}
