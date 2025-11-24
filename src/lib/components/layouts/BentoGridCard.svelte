<script lang="ts">
	/**
	 * Card type for different bento grid cells
	 */
	export let cardType: 'hero' | 'project' | 'skill' | 'contact' | 'about' = 'project';

	/**
	 * Grid size (affects how much space the card takes)
	 */
	export let size: 'small' | 'medium' | 'large' = 'medium';

	/**
	 * Optional content props
	 */
	export let title = '';
	export let description = '';
	export let imageUrl: string | null = null;
	export let link: string | null = null;

	/**
	 * Hover state
	 */
	let isHovered = false;

	/**
	 * Get size classes
	 */
	function getSizeClasses(): string {
		switch (size) {
			case 'small':
				return 'col-span-1 row-span-1';
			case 'medium':
				return 'col-span-1 sm:col-span-2 row-span-1';
			case 'large':
				return 'col-span-1 sm:col-span-2 lg:col-span-3 row-span-2';
			default:
				return 'col-span-1 row-span-1';
		}
	}

	/**
	 * Get card type classes
	 */
	function getCardTypeClasses(): string {
		switch (cardType) {
			case 'hero':
				return 'bento-hero';
			case 'project':
				return 'bento-project';
			case 'skill':
				return 'bento-skill';
			case 'contact':
				return 'bento-contact';
			case 'about':
				return 'bento-about';
			default:
				return '';
		}
	}
</script>

<div
	class={`bento-card ${getSizeClasses()} ${getCardTypeClasses()}`}
	on:mouseenter={() => (isHovered = true)}
	on:mouseleave={() => (isHovered = false)}
	role="article"
>
	{#if link}
		<a href={link} class="card-wrapper">
			<!-- Image Background (if provided) -->
			{#if imageUrl}
				<div class="image-background">
					<img src={imageUrl} alt={title} loading="lazy" />
				</div>
			{/if}

			<!-- Glassmorphism Overlay -->
			<div class="glass-overlay" class:hovered={isHovered}>
				<!-- Content Slot -->
				<div class="card-content">
					{#if title}
						<h3 class="card-title">{title}</h3>
					{/if}
					{#if description}
						<p class="card-description">{description}</p>
					{/if}
					<slot />
				</div>

				<!-- Hover Indicator -->
				{#if isHovered}
					<div class="hover-indicator">
						<svg class="arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 8l4 4m0 0l-4 4m4-4H3"
							/>
						</svg>
					</div>
				{/if}
			</div>
		</a>
	{:else}
		<div class="card-wrapper">
			<!-- Image Background (if provided) -->
			{#if imageUrl}
				<div class="image-background">
					<img src={imageUrl} alt={title} loading="lazy" />
				</div>
			{/if}

			<!-- Glassmorphism Overlay -->
			<div class="glass-overlay">
				<!-- Content Slot -->
				<div class="card-content">
					{#if title}
						<h3 class="card-title">{title}</h3>
					{/if}
					{#if description}
						<p class="card-description">{description}</p>
					{/if}
					<slot />
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.bento-card {
		@apply relative overflow-hidden rounded-2xl;
		@apply bg-surface border border-border;
		@apply transition-all duration-300;
	}

	.bento-card:hover {
		@apply shadow-xl border-primary/50 scale-[1.02];
	}

	.card-wrapper {
		@apply block w-full h-full min-h-[200px] no-underline;
	}

	.image-background {
		@apply absolute inset-0 w-full h-full;
	}

	.image-background img {
		@apply w-full h-full object-cover;
	}

	.glass-overlay {
		@apply relative w-full h-full p-6;
		@apply bg-surface/60 backdrop-blur-sm;
		@apply transition-all duration-300;
	}

	.glass-overlay.hovered {
		@apply bg-surface/80 backdrop-blur-md;
	}

	.card-content {
		@apply relative z-10 h-full flex flex-col justify-center;
	}

	.card-title {
		@apply text-xl sm:text-2xl font-bold text-primary mb-2;
	}

	.card-description {
		@apply text-text-secondary text-sm sm:text-base;
	}

	.hover-indicator {
		@apply absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center;
		@apply bg-primary rounded-full;
		@apply animate-bounce;
	}

	.arrow {
		@apply w-5 h-5 text-white;
	}

	/* Card Type Specific Styles */
	.bento-hero {
		@apply bg-gradient-to-br from-primary/20 to-secondary/20;
	}

	.bento-project {
		@apply border-primary/30;
	}

	.bento-skill {
		@apply border-secondary/30;
	}

	.bento-contact {
		@apply border-accent/30;
	}

	.bento-about {
		@apply bg-gradient-to-br from-surface to-background;
	}
</style>
