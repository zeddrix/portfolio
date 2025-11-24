/**
 * Lazy loading utilities for heavy components
 *
 * This module provides utilities for dynamically importing components
 * to reduce initial bundle size and improve performance.
 */

import type { ComponentType, SvelteComponent } from 'svelte';

/**
 * Lazy load a Svelte component with dynamic import
 *
 * Usage:
 * ```svelte
 * <script>
 *   import { lazyComponent } from '$lib/utils/lazy';
 *   const RichTextEditor = lazyComponent(() => import('$lib/components/admin/RichTextEditor.svelte'));
 * </script>
 *
 * <svelte:component this={RichTextEditor} {...props} />
 * ```
 */
export function lazyComponent<T extends SvelteComponent>(
	importFn: () => Promise<{ default: ComponentType<T> }>
): Promise<ComponentType<T>> {
	return importFn().then((module) => module.default);
}

/**
 * Check if we're in the browser
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Preload a component for faster subsequent loads
 */
export function preloadComponent<T extends SvelteComponent>(
	importFn: () => Promise<{ default: ComponentType<T> }>
): void {
	if (isBrowser) {
		// Trigger the import but don't wait for it
		importFn().catch((error) => {
			console.warn('Failed to preload component:', error);
		});
	}
}

/**
 * Lazy load multiple components in parallel
 */
export async function lazyComponents(
	imports: Record<string, () => Promise<{ default: ComponentType<SvelteComponent> }>>
): Promise<Record<string, ComponentType<SvelteComponent>>> {
	const entries = Object.entries(imports);
	const results = await Promise.all(
		entries.map(async ([key, importFn]) => {
			const module = await importFn();
			return [key, module.default] as const;
		})
	);

	return Object.fromEntries(results);
}

/**
 * Create a lazy loading wrapper component with loading state
 * This is useful for showing a loading indicator while the component loads
 */
export interface LazyLoadOptions {
	/** Show loading indicator */
	showLoader?: boolean;
	/** Custom loading message */
	loadingMessage?: string;
	/** Delay before showing loader (ms) */
	loaderDelay?: number;
}

/**
 * Intersection Observer based lazy loading
 * Loads a component only when it enters the viewport
 */
export function lazyLoadOnVisible<T extends SvelteComponent>(
	element: HTMLElement,
	importFn: () => Promise<{ default: ComponentType<T> }>,
	options: IntersectionObserverInit = {}
): { destroy: () => void } {
	if (!isBrowser) {
		return { destroy: () => {} };
	}

	let loaded = false;
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting && !loaded) {
				loaded = true;
				importFn().catch((error) => {
					console.error('Failed to lazy load component:', error);
				});
				observer.disconnect();
			}
		});
	}, options);

	observer.observe(element);

	return {
		destroy: () => {
			observer.disconnect();
		}
	};
}
