<script lang="ts">
	/**
	 * Header Component
	 *
	 * A fixed header with scroll behavior that changes appearance on scroll.
	 * Supports logo slot and integrates navigation components.
	 */

	import { onMount } from 'svelte';

	export let sticky: boolean = true;
	export let transparent: boolean = false;
	export let showShadow: boolean = true;

	let scrolled = false;

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 20;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	$: headerClasses = sticky ? 'fixed top-0 left-0 right-0 z-50' : 'relative';
	$: bgClass =
		transparent && !scrolled
			? 'bg-transparent'
			: scrolled
				? 'bg-white/95 backdrop-blur-md'
				: 'bg-white';
	$: shadowClass = showShadow && scrolled ? 'shadow-md' : '';
</script>

<header
	class="transition-all duration-300 ease-out {headerClasses} {bgClass} {shadowClass}"
	{...$$restProps}
>
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16 md:h-20">
			<div class="header-logo">
				<slot name="logo" />
			</div>

			<nav class="header-nav hidden md:block">
				<slot name="nav" />
			</nav>

			<div class="header-actions flex items-center gap-4">
				<slot name="actions" />
			</div>

			<div class="header-mobile-toggle md:hidden">
				<slot name="mobile-toggle" />
			</div>
		</div>
	</div>
</header>
