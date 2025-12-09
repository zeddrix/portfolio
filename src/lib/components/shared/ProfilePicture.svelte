<script lang="ts">
	export let src: string;
	export let alt: string = 'Profile picture';
	export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
	export let shape: 'circle' | 'rounded' = 'rounded';

	const sizeClasses = {
		sm: 'w-10 h-10',
		md: 'w-16 h-16',
		lg: 'w-32 h-32',
		xl: 'w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96'
	};

	const shapeClasses = {
		circle: 'rounded-full',
		rounded: 'rounded-2xl'
	};

	let imageLoaded = false;
	let imageError = false;

	function handleLoad() {
		imageLoaded = true;
	}

	function handleError() {
		imageError = true;
	}
</script>

<div
	class="relative overflow-hidden {sizeClasses[size]} {shapeClasses[
		shape
	]} bg-surface border-2 border-primary/20"
>
	<!-- Blur placeholder -->
	{#if !imageLoaded && !imageError}
		<div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse" />
	{/if}

	<!-- Actual image -->
	{#if !imageError}
		<img
			{src}
			{alt}
			class="w-full h-full object-cover transition-opacity duration-300 {imageLoaded
				? 'opacity-100'
				: 'opacity-0'}"
			loading="lazy"
			on:load={handleLoad}
			on:error={handleError}
		/>
	{:else}
		<!-- Fallback initial -->
		<div
			class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20"
		>
			<span
				class="text-primary font-bold {size === 'xl'
					? 'text-6xl'
					: size === 'lg'
						? 'text-4xl'
						: 'text-2xl'}"
			>
				{alt.charAt(0).toUpperCase()}
			</span>
		</div>
	{/if}

	<!-- Decorative border glow -->
	<div
		class="absolute inset-0 {shapeClasses[
			shape
		]} ring-2 ring-primary/30 ring-inset pointer-events-none"
	/>
</div>
