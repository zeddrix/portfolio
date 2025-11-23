<script lang="ts">
	/**
	 * Container Component
	 *
	 * A responsive container that centers content and applies consistent
	 * horizontal padding. Supports multiple max-width options.
	 */

	export let maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' = 'xl';
	export let padding: boolean = true;
	export let center: boolean = true;

	$: maxWidthClasses = {
		sm: 'max-w-screen-sm',
		md: 'max-w-screen-md',
		lg: 'max-w-screen-lg',
		xl: 'max-w-screen-xl',
		'2xl': 'max-w-screen-2xl',
		full: 'max-w-full'
	}[maxWidth];

	$: paddingClass = padding ? 'px-4 sm:px-6 lg:px-8' : '';
	$: centerClass = center ? 'mx-auto' : '';
</script>

<div class="{maxWidthClasses} {paddingClass} {centerClass}" {...$$restProps}>
	<slot />
</div>
