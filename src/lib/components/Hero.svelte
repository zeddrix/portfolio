<script lang="ts">
	/**
	 * Hero Component
	 *
	 * A full-width hero section with support for backgrounds, text overlay,
	 * and call-to-action buttons. Responsive typography and entrance animations.
	 * Enhanced with Squarespace-quality dramatic typography (72px headings) and rich overlays.
	 */

	import { fly } from 'svelte/transition';

	export let title: string = '';
	export let subtitle: string = '';
	export let background: 'white' | 'gray' | 'dark' | 'gradient' | 'image' = 'white';
	export let backgroundImage: string = '';
	export let alignment: 'left' | 'center' | 'right' = 'center';
	export let height: 'small' | 'medium' | 'large' | 'full' = 'large';
	export let animate: boolean = true;

	$: bgClasses = {
		white: 'bg-white',
		gray: 'bg-neutral-50',
		dark: 'bg-neutral-900 text-white',
		gradient: 'bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white',
		image: 'bg-cover bg-center bg-no-repeat'
	}[background];

	$: alignmentClasses = {
		left: 'text-left items-start',
		center: 'text-center items-center',
		right: 'text-right items-end'
	}[alignment];

	$: heightClasses = {
		small: 'min-h-[500px]',
		medium: 'min-h-[600px]',
		large: 'min-h-[700px]',
		full: 'min-h-screen'
	}[height];

	$: bgStyle =
		backgroundImage && background === 'image' ? `background-image: url(${backgroundImage});` : '';
</script>

<section
	class="relative w-full {heightClasses} {bgClasses} flex items-center justify-center overflow-hidden"
	style={bgStyle}
	{...$$restProps}
>
	{#if backgroundImage && background === 'image'}
		<div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/45 to-black/50" />
	{/if}

	<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
		<div class="flex flex-col {alignmentClasses} gap-8 max-w-5xl mx-auto">
			{#if title}
				<h1
					class="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] xl:text-[90px] font-light leading-[1.1] tracking-tight"
					in:fly={animate ? { y: 30, duration: 700, delay: 100, opacity: 0 } : undefined}
				>
					{title}
				</h1>
			{/if}

			{#if subtitle}
				<p
					class="text-xl md:text-2xl lg:text-3xl opacity-95 max-w-3xl font-light leading-relaxed"
					in:fly={animate ? { y: 30, duration: 700, delay: 300, opacity: 0 } : undefined}
				>
					{subtitle}
				</p>
			{/if}

			<div
				class="flex flex-wrap gap-6 mt-4 {alignment === 'center'
					? 'justify-center'
					: alignment === 'right'
						? 'justify-end'
						: 'justify-start'}"
				in:fly={animate ? { y: 30, duration: 700, delay: 500, opacity: 0 } : undefined}
			>
				<slot name="cta" />
			</div>

			<slot />
		</div>
	</div>
</section>
