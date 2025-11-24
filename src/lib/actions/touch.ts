/**
 * Touch Interaction Actions for Svelte
 * Provides enhanced touch interactions for mobile devices
 */

interface SwipeDetail {
	direction: 'left' | 'right' | 'up' | 'down';
	distance: number;
	duration: number;
	velocity: number;
}

interface SwipeOptions {
	threshold?: number; // Minimum distance in pixels (default: 50)
	timeout?: number; // Maximum duration in ms (default: 500)
	verticalThreshold?: number; // Max vertical movement for horizontal swipe (default: 50)
}

/**
 * Swipe gesture action
 * Detects swipe gestures on mobile devices
 */
export function swipe(node: HTMLElement, options: SwipeOptions = {}): { destroy: () => void } {
	const { threshold = 50, timeout = 500, verticalThreshold = 50 } = options;

	let startX = 0;
	let startY = 0;
	let startTime = 0;

	function handleTouchStart(e: TouchEvent) {
		const touch = e.touches[0];
		startX = touch.clientX;
		startY = touch.clientY;
		startTime = Date.now();
	}

	function handleTouchEnd(e: TouchEvent) {
		const touch = e.changedTouches[0];
		const endX = touch.clientX;
		const endY = touch.clientY;
		const endTime = Date.now();

		const deltaX = endX - startX;
		const deltaY = endY - startY;
		const duration = endTime - startTime;

		// Check if swipe duration is within timeout
		if (duration > timeout) return;

		const absX = Math.abs(deltaX);
		const absY = Math.abs(deltaY);

		// Horizontal swipe
		if (absX > threshold && absY < verticalThreshold) {
			const direction = deltaX > 0 ? 'right' : 'left';
			const velocity = absX / duration;

			node.dispatchEvent(
				new CustomEvent<SwipeDetail>('swipe', {
					detail: { direction, distance: absX, duration, velocity }
				})
			);
		}

		// Vertical swipe
		if (absY > threshold && absX < verticalThreshold) {
			const direction = deltaY > 0 ? 'down' : 'up';
			const velocity = absY / duration;

			node.dispatchEvent(
				new CustomEvent<SwipeDetail>('swipe', {
					detail: { direction, distance: absY, duration, velocity }
				})
			);
		}
	}

	node.addEventListener('touchstart', handleTouchStart, { passive: true });
	node.addEventListener('touchend', handleTouchEnd, { passive: true });

	return {
		destroy() {
			node.removeEventListener('touchstart', handleTouchStart);
			node.removeEventListener('touchend', handleTouchEnd);
		}
	};
}

interface LongPressOptions {
	duration?: number; // Duration in ms (default: 500)
	allowMove?: boolean; // Allow small movement during press (default: false)
	moveThreshold?: number; // Max movement in pixels (default: 10)
}

/**
 * Long press action
 * Detects long press gestures on mobile devices
 */
export function longPress(
	node: HTMLElement,
	options: LongPressOptions = {}
): { destroy: () => void } {
	const { duration = 500, allowMove = false, moveThreshold = 10 } = options;

	let pressTimer: ReturnType<typeof setTimeout> | null = null;
	let startX = 0;
	let startY = 0;

	function handleTouchStart(e: TouchEvent) {
		const touch = e.touches[0];
		startX = touch.clientX;
		startY = touch.clientY;

		pressTimer = setTimeout(() => {
			node.dispatchEvent(new CustomEvent('longpress'));
		}, duration);
	}

	function handleTouchMove(e: TouchEvent) {
		if (!allowMove && pressTimer) {
			const touch = e.touches[0];
			const deltaX = Math.abs(touch.clientX - startX);
			const deltaY = Math.abs(touch.clientY - startY);

			if (deltaX > moveThreshold || deltaY > moveThreshold) {
				clearTimeout(pressTimer);
				pressTimer = null;
			}
		}
	}

	function handleTouchEnd() {
		if (pressTimer) {
			clearTimeout(pressTimer);
			pressTimer = null;
		}
	}

	node.addEventListener('touchstart', handleTouchStart, { passive: true });
	node.addEventListener('touchmove', handleTouchMove, { passive: true });
	node.addEventListener('touchend', handleTouchEnd, { passive: true });
	node.addEventListener('touchcancel', handleTouchEnd, { passive: true });

	return {
		destroy() {
			if (pressTimer) clearTimeout(pressTimer);
			node.removeEventListener('touchstart', handleTouchStart);
			node.removeEventListener('touchmove', handleTouchMove);
			node.removeEventListener('touchend', handleTouchEnd);
			node.removeEventListener('touchcancel', handleTouchEnd);
		}
	};
}

/**
 * Tap action with haptic feedback
 * Provides enhanced tap interaction with optional haptic feedback
 */
export function tap(
	node: HTMLElement,
	options: { haptic?: boolean } = {}
): { destroy: () => void } {
	const { haptic = false } = options;

	function handleTouchEnd(e: TouchEvent) {
		// Provide haptic feedback on supported devices
		if (haptic && 'vibrate' in navigator) {
			navigator.vibrate(10); // Short vibration
		}

		node.dispatchEvent(new CustomEvent('tap', { detail: e }));
	}

	node.addEventListener('touchend', handleTouchEnd, { passive: true });

	return {
		destroy() {
			node.removeEventListener('touchend', handleTouchEnd);
		}
	};
}

/**
 * Add active class on touch for better mobile feedback
 */
export function touchActive(
	node: HTMLElement,
	className: string = 'touch-active'
): { destroy: () => void } {
	function handleTouchStart() {
		node.classList.add(className);
	}

	function handleTouchEnd() {
		node.classList.remove(className);
	}

	node.addEventListener('touchstart', handleTouchStart, { passive: true });
	node.addEventListener('touchend', handleTouchEnd, { passive: true });
	node.addEventListener('touchcancel', handleTouchEnd, { passive: true });

	return {
		destroy() {
			node.removeEventListener('touchstart', handleTouchStart);
			node.removeEventListener('touchend', handleTouchEnd);
			node.removeEventListener('touchcancel', handleTouchEnd);
		}
	};
}

/**
 * Prevent pull-to-refresh on mobile browsers
 */
export function preventPullToRefresh(node: HTMLElement): { destroy: () => void } {
	let startY = 0;

	function handleTouchStart(e: TouchEvent) {
		startY = e.touches[0].clientY;
	}

	function handleTouchMove(e: TouchEvent) {
		const y = e.touches[0].clientY;

		// Prevent pull-to-refresh when scrolled to top and pulling down
		if (y > startY && node.scrollTop === 0) {
			e.preventDefault();
		}
	}

	node.addEventListener('touchstart', handleTouchStart, { passive: true });
	node.addEventListener('touchmove', handleTouchMove, { passive: false });

	return {
		destroy() {
			node.removeEventListener('touchstart', handleTouchStart);
			node.removeEventListener('touchmove', handleTouchMove);
		}
	};
}
