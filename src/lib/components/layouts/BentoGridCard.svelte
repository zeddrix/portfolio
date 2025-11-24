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
				return 'bg-gradient-to-br from-primary/20 to-secondary/20';
			case 'project':
				return 'border-primary/30';
			case 'skill':
				return 'border-secondary/30';
			case 'contact':
				return 'border-accent/30';
			case 'about':
				return 'bg-gradient-to-br from-surface to-background';
			default:
				return '';
		}
	}
</script>

<div
	class={`relative overflow-hidden rounded-2xl bg-surface border border-border transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:scale-[1.02] ${getSizeClasses()} ${getCardTypeClasses()}`}
	on:mouseenter={() => (isHovered = true)}
	on:mouseleave={() => (isHovered = false)}
	role="article"
>
	{#if link}
		<a href={link} class="block w-full h-full min-h-[200px] no-underline">
			<!-- Image Background (if provided) -->
			{#if imageUrl}
				<div class="absolute inset-0 w-full h-full">
					<img src={imageUrl} alt={title} class="w-full h-full object-cover" loading="lazy" />
				</div>
			{/if}

			<!-- Glassmorphism Overlay -->
			<div
				class={`relative w-full h-full p-6 bg-surface/60 backdrop-blur-sm transition-all duration-300 ${isHovered ? 'bg-surface/80 backdrop-blur-md' : ''}`}
			>
				<!-- Content Slot -->
				<div class="relative z-10 h-full flex flex-col justify-center">
					{#if title}
						<h3 class="text-xl sm:text-2xl font-bold text-primary mb-2">{title}</h3>
					{/if}
					{#if description}
						<p class="text-text-secondary text-sm sm:text-base">{description}</p>
					{/if}
					<slot />
				</div>

				<!-- Hover Indicator -->
				{#if isHovered}
					<div
						class="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center bg-primary rounded-full animate-bounce"
					>
						<svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
		<div class="block w-full h-full min-h-[200px] no-underline">
			<!-- Image Background (if provided) -->
			{#if imageUrl}
				<div class="absolute inset-0 w-full h-full">
					<img src={imageUrl} alt={title} class="w-full h-full object-cover" loading="lazy" />
				</div>
			{/if}

			<!-- Glassmorphism Overlay -->
			<div
				class="relative w-full h-full p-6 bg-surface/60 backdrop-blur-sm transition-all duration-300"
			>
				<!-- Content Slot -->
				<div class="relative z-10 h-full flex flex-col justify-center">
					{#if title}
						<h3 class="text-xl sm:text-2xl font-bold text-primary mb-2">{title}</h3>
					{/if}
					{#if description}
						<p class="text-text-secondary text-sm sm:text-base">{description}</p>
					{/if}
					<slot />
				</div>
			</div>
		</div>
	{/if}
</div>
