/**
 * Responsive Design Utilities
 * Utilities for responsive breakpoints, mobile detection, and viewport handling
 */

import { writable, derived, type Readable } from 'svelte/store';

/**
 * Tailwind CSS Breakpoints
 * These match the default Tailwind breakpoints
 */
export const breakpoints = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	'2xl': 1536
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Create a media query store that updates when the query changes
 */
export function mediaQuery(query: string): Readable<boolean> {
	const store = writable(false);

	if (typeof window !== 'undefined') {
		const mediaQueryList = window.matchMedia(query);
		store.set(mediaQueryList.matches);

		const handler = (e: MediaQueryListEvent) => store.set(e.matches);
		mediaQueryList.addEventListener('change', handler);

		// Cleanup on unmount (handled by Svelte automatically)
		return {
			subscribe: store.subscribe
		};
	}

	return store;
}

/**
 * Create breakpoint stores for responsive design
 */
export const isMobile = mediaQuery(`(max-width: ${breakpoints.md - 1}px)`);
export const isTablet = mediaQuery(
	`(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`
);
export const isDesktop = mediaQuery(`(min-width: ${breakpoints.lg}px)`);
export const isLargeDesktop = mediaQuery(`(min-width: ${breakpoints.xl}px)`);

/**
 * Get current breakpoint name
 */
export const currentBreakpoint = derived(
	[isMobile, isTablet, isDesktop, isLargeDesktop],
	([$isMobile, $isTablet, $isDesktop, $isLargeDesktop]) => {
		if ($isLargeDesktop) return 'xl';
		if ($isDesktop) return 'lg';
		if ($isTablet) return 'md';
		if ($isMobile) return 'sm';
		return 'xs';
	}
);

/**
 * Viewport size store
 */
export function createViewportStore() {
	const { subscribe, set } = writable({
		width: typeof window !== 'undefined' ? window.innerWidth : 0,
		height: typeof window !== 'undefined' ? window.innerHeight : 0
	});

	if (typeof window !== 'undefined') {
		const handleResize = () => {
			set({
				width: window.innerWidth,
				height: window.innerHeight
			});
		};

		window.addEventListener('resize', handleResize);
		// Initial call
		handleResize();
	}

	return { subscribe };
}

export const viewport = createViewportStore();

/**
 * Check if device is touch-enabled
 */
export function isTouchDevice(): boolean {
	if (typeof window === 'undefined') return false;
	return (
		'ontouchstart' in window ||
		navigator.maxTouchPoints > 0 ||
		// @ts-expect-error - msMaxTouchPoints is deprecated but still present in some browsers
		navigator.msMaxTouchPoints > 0
	);
}

/**
 * Check if user is on a slow connection
 */
export function isSlowConnection(): boolean {
	if (typeof navigator === 'undefined' || !('connection' in navigator)) return false;

	const connection = (navigator as Navigator & { connection?: { effectiveType?: string } })
		.connection;
	if (!connection || !connection.effectiveType) return false;

	return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
}

/**
 * Get device pixel ratio for high-DPI displays
 */
export function getDevicePixelRatio(): number {
	if (typeof window === 'undefined') return 1;
	return window.devicePixelRatio || 1;
}

/**
 * Check if viewport width matches a breakpoint
 */
export function matchesBreakpoint(breakpoint: Breakpoint): boolean {
	if (typeof window === 'undefined') return false;
	return window.innerWidth >= breakpoints[breakpoint];
}

/**
 * Get optimal image width based on viewport and DPR
 */
export function getOptimalImageWidth(containerWidth: number): number {
	const dpr = getDevicePixelRatio();
	const optimalWidth = containerWidth * dpr;

	// Round to nearest standard width for better caching
	const standardWidths = [400, 600, 800, 1000, 1200, 1600, 1920, 2400];
	return standardWidths.find((w) => w >= optimalWidth) || standardWidths[standardWidths.length - 1];
}

/**
 * Detect if device is iOS
 */
export function isIOS(): boolean {
	if (typeof window === 'undefined') return false;
	return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Detect if device is Android
 */
export function isAndroid(): boolean {
	if (typeof window === 'undefined') return false;
	return /Android/.test(navigator.userAgent);
}

/**
 * Get safe area insets for mobile devices (iOS notch, etc.)
 */
export function getSafeAreaInsets() {
	if (typeof window === 'undefined') {
		return { top: 0, right: 0, bottom: 0, left: 0 };
	}

	const style = getComputedStyle(document.documentElement);
	return {
		top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0'),
		right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0'),
		bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
		left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0')
	};
}
