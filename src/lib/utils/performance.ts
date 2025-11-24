/**
 * Performance optimization utilities
 *
 * This module provides utilities and best practices for optimizing
 * application performance including caching, lazy loading, and resource hints.
 */

/**
 * Debounce function to limit how often a function can fire
 *
 * Usage:
 * ```typescript
 * const handleSearch = debounce((query: string) => {
 *   // Expensive search operation
 * }, 300);
 * ```
 */
export function debounce<T extends unknown[]>(
	func: (...args: T) => void,
	wait: number
): (...args: T) => void {
	let timeout: ReturnType<typeof setTimeout> | undefined;

	return function executedFunction(...args: T) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

/**
 * Throttle function to ensure a function is called at most once in a specified period
 *
 * Usage:
 * ```typescript
 * const handleScroll = throttle(() => {
 *   // Scroll handling logic
 * }, 100);
 * ```
 */
export function throttle<T extends unknown[]>(
	func: (...args: T) => void,
	limit: number
): (...args: T) => void {
	let inThrottle: boolean;

	return function executedFunction(...args: T) {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			setTimeout(() => {
				inThrottle = false;
			}, limit);
		}
	};
}

/**
 * Request idle callback wrapper with fallback
 */
export function requestIdleCallback(callback: () => void, options?: { timeout?: number }): void {
	if (typeof window === 'undefined') return;

	if ('requestIdleCallback' in window) {
		window.requestIdleCallback(callback, options);
	} else {
		// Fallback for browsers that don't support requestIdleCallback
		setTimeout(callback, 1);
	}
}

/**
 * Preload a resource for faster subsequent loads
 *
 * @param href - URL of the resource to preload
 * @param as - Type of resource (image, script, style, font, etc.)
 * @param type - MIME type (optional, recommended for fonts)
 */
export function preloadResource(
	href: string,
	as: 'image' | 'script' | 'style' | 'font' | 'fetch',
	type?: string
): void {
	if (typeof document === 'undefined') return;

	// Check if already preloaded
	const existing = document.querySelector(`link[rel="preload"][href="${href}"]`);
	if (existing) return;

	const link = document.createElement('link');
	link.rel = 'preload';
	link.href = href;
	link.as = as;

	if (type) {
		link.type = type;
	}

	// Fonts need crossorigin
	if (as === 'font') {
		link.crossOrigin = 'anonymous';
	}

	document.head.appendChild(link);
}

/**
 * Prefetch a resource for future navigation
 *
 * @param href - URL of the resource to prefetch
 */
export function prefetchResource(href: string): void {
	if (typeof document === 'undefined') return;

	// Check if already prefetched
	const existing = document.querySelector(`link[rel="prefetch"][href="${href}"]`);
	if (existing) return;

	const link = document.createElement('link');
	link.rel = 'prefetch';
	link.href = href;

	document.head.appendChild(link);
}

/**
 * DNS prefetch for external domains
 *
 * @param domain - Domain to prefetch DNS for
 */
export function dnsPrefetch(domain: string): void {
	if (typeof document === 'undefined') return;

	const existing = document.querySelector(`link[rel="dns-prefetch"][href="${domain}"]`);
	if (existing) return;

	const link = document.createElement('link');
	link.rel = 'dns-prefetch';
	link.href = domain;

	document.head.appendChild(link);
}

/**
 * Preconnect to external domains for faster connections
 *
 * @param domain - Domain to preconnect to
 * @param crossorigin - Whether to use crossorigin attribute
 */
export function preconnect(domain: string, crossorigin: boolean = false): void {
	if (typeof document === 'undefined') return;

	const existing = document.querySelector(`link[rel="preconnect"][href="${domain}"]`);
	if (existing) return;

	const link = document.createElement('link');
	link.rel = 'preconnect';
	link.href = domain;

	if (crossorigin) {
		link.crossOrigin = 'anonymous';
	}

	document.head.appendChild(link);
}

/**
 * Check if the user has a slow connection
 */
export function isSlowConnection(): boolean {
	if (typeof navigator === 'undefined' || !('connection' in navigator)) {
		return false;
	}

	const connection = (navigator as Navigator & { connection?: { effectiveType?: string } })
		.connection;
	if (!connection) return false;

	// Consider 2g and slow-2g as slow connections
	return connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g';
}

/**
 * Check if the user has data saver enabled
 */
export function hasDataSaver(): boolean {
	if (typeof navigator === 'undefined' || !('connection' in navigator)) {
		return false;
	}

	const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
	return connection?.saveData === true;
}

/**
 * Check if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined') return false;

	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Simple in-memory cache with TTL (Time To Live)
 */
export class MemoryCache<T> {
	private cache: Map<string, { value: T; expires: number }> = new Map();

	/**
	 * Set a value in the cache with TTL in milliseconds
	 */
	set(key: string, value: T, ttl: number = 60000): void {
		this.cache.set(key, {
			value,
			expires: Date.now() + ttl
		});
	}

	/**
	 * Get a value from the cache
	 * Returns undefined if not found or expired
	 */
	get(key: string): T | undefined {
		const item = this.cache.get(key);
		if (!item) return undefined;

		if (Date.now() > item.expires) {
			this.cache.delete(key);
			return undefined;
		}

		return item.value;
	}

	/**
	 * Check if a key exists and is not expired
	 */
	has(key: string): boolean {
		return this.get(key) !== undefined;
	}

	/**
	 * Delete a key from the cache
	 */
	delete(key: string): void {
		this.cache.delete(key);
	}

	/**
	 * Clear all expired entries
	 */
	clearExpired(): void {
		const now = Date.now();
		for (const [key, item] of this.cache.entries()) {
			if (now > item.expires) {
				this.cache.delete(key);
			}
		}
	}

	/**
	 * Clear the entire cache
	 */
	clear(): void {
		this.cache.clear();
	}

	/**
	 * Get the size of the cache
	 */
	get size(): number {
		return this.cache.size;
	}
}

/**
 * Measure performance of a function
 */
export async function measurePerformance<T>(name: string, fn: () => T | Promise<T>): Promise<T> {
	const start = performance.now();

	try {
		const result = await fn();
		const duration = performance.now() - start;

		console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);

		return result;
	} catch (error) {
		const duration = performance.now() - start;
		console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms:`, error);
		throw error;
	}
}

/**
 * Report Web Vitals to console (useful for development)
 * In production, you would send these to your analytics service
 */
export function reportWebVitals(): void {
	if (typeof window === 'undefined') return;

	// Largest Contentful Paint (LCP)
	new PerformanceObserver((list) => {
		const entries = list.getEntries();
		const lastEntry = entries[entries.length - 1];
		console.log('[Web Vitals] LCP:', lastEntry.startTime.toFixed(2), 'ms');
	}).observe({ entryTypes: ['largest-contentful-paint'] });

	// First Input Delay (FID)
	new PerformanceObserver((list) => {
		const entries = list.getEntries();
		entries.forEach((entry) => {
			const fid = (entry as PerformanceEventTiming).processingStart - entry.startTime;
			console.log('[Web Vitals] FID:', fid.toFixed(2), 'ms');
		});
	}).observe({ entryTypes: ['first-input'] });

	// Cumulative Layout Shift (CLS)
	let clsScore = 0;
	new PerformanceObserver((list) => {
		const entries = list.getEntries();
		entries.forEach((entry) => {
			if (!(entry as LayoutShift).hadRecentInput) {
				clsScore += (entry as LayoutShift).value;
			}
		});
		console.log('[Web Vitals] CLS:', clsScore.toFixed(4));
	}).observe({ entryTypes: ['layout-shift'] });
}

// Type definitions for Web Vitals
interface LayoutShift extends PerformanceEntry {
	value: number;
	hadRecentInput: boolean;
}
