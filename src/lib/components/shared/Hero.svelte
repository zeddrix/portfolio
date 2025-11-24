<script lang="ts">
	/**
	 * Hero variant for different layouts
	 */
	export let variant: 'case_study' | 'single_page' | 'bento_grid' = 'single_page';

	/**
	 * Profile data
	 */
	export let fullName = 'Zeddrix';
	export let tagline = 'Full Stack Developer';
	export let bio =
		'Building modern web applications with cutting-edge technologies and creative solutions.';

	/**
	 * Get variant-specific classes
	 */
	function getVariantClasses(): string {
		switch (variant) {
			case 'case_study':
				return 'min-h-screen flex items-center';
			case 'single_page':
				return 'min-h-[80vh] flex items-center';
			case 'bento_grid':
				return 'min-h-[60vh] flex items-center';
			default:
				return 'min-h-screen flex items-center';
		}
	}
</script>

<section id="hero" class={`hero ${getVariantClasses()}`}>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
		<div class="text-center">
			{#if variant === 'case_study'}
				<!-- Full-width hero for case study layout -->
				<h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary mb-6">
					{fullName}
				</h1>
				<p class="text-2xl sm:text-3xl text-text-primary mb-8">
					{tagline}
				</p>
				<p class="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto mb-12">
					{bio}
				</p>
			{:else if variant === 'single_page'}
				<!-- Traditional single-page hero -->
				<h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-4">
					Hi, I'm {fullName}
				</h1>
				<p class="text-xl sm:text-2xl text-text-primary mb-6">
					{tagline}
				</p>
				<p class="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-8">
					{bio}
				</p>
			{:else}
				<!-- Compact hero for bento grid -->
				<h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-3">
					{fullName}
				</h1>
				<p class="text-lg sm:text-xl text-text-primary mb-4">
					{tagline}
				</p>
				<p class="text-sm sm:text-base text-text-secondary max-w-xl mx-auto">
					{bio}
				</p>
			{/if}

			<!-- CTA Buttons -->
			<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
				<a
					href="#projects"
					class="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
				>
					View My Work
				</a>
				<a
					href="#contact"
					class="inline-flex items-center px-6 py-3 bg-surface text-text-primary font-medium rounded-lg border border-border hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
				>
					Get In Touch
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		@apply relative overflow-hidden;
	}

	/* Optional: Add animated background gradient */
	.hero::before {
		content: '';
		@apply absolute inset-0 -z-10 opacity-20;
		background: radial-gradient(
			circle at 50% 50%,
			rgb(var(--color-primary) / 0.3),
			transparent 70%
		);
		animation: pulse 8s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.2;
		}
		50% {
			opacity: 0.3;
		}
	}
</style>
