<script lang="ts">
	import { animate_on_scroll, smooth_scroll } from '$lib/actions/animate';
	import type { Database } from '$lib/types/database';

	type Profile = Database['public']['Tables']['profile']['Row'];

	/**
	 * Hero variant for different layouts
	 */
	export let variant: 'case_study' | 'single_page' | 'bento_grid' = 'single_page';

	/**
	 * Profile data from database
	 */
	export let profile: Profile | null = null;

	// Extract profile data with fallbacks
	const fullName = profile?.full_name || 'Zeddrix';
	const tagline = profile?.tagline || 'Full Stack Developer';
	const bio =
		profile?.bio ||
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

<section id="hero" class={`relative overflow-hidden ${getVariantClasses()}`}>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
		<div class="text-center">
			{#if variant === 'case_study'}
				<!-- Full-width hero for case study layout -->
				<h1
					use:animate_on_scroll={{ type: 'fadeInUp', duration: 0.8 }}
					class="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary mb-6"
				>
					{fullName}
				</h1>
				<p
					use:animate_on_scroll={{ type: 'fadeInUp', duration: 0.8, delay: 0.2 }}
					class="text-2xl sm:text-3xl text-text-primary mb-8"
				>
					{tagline}
				</p>
				<p
					use:animate_on_scroll={{ type: 'fadeInUp', duration: 0.8, delay: 0.4 }}
					class="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto mb-12"
				>
					{bio}
				</p>
			{:else if variant === 'single_page'}
				<!-- Traditional single-page hero -->
				<h1
					use:animate_on_scroll={{ type: 'fadeInUp', duration: 0.8 }}
					class="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-4"
				>
					Hi, I'm {fullName}
				</h1>
				<p
					use:animate_on_scroll={{ type: 'fadeInUp', duration: 0.8, delay: 0.2 }}
					class="text-xl sm:text-2xl text-text-primary mb-6"
				>
					{tagline}
				</p>
				<p
					use:animate_on_scroll={{ type: 'fadeInUp', duration: 0.8, delay: 0.4 }}
					class="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-8"
				>
					{bio}
				</p>
			{:else}
				<!-- Compact hero for bento grid -->
				<h1
					use:animate_on_scroll={{ type: 'fadeInUp', duration: 0.8 }}
					class="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-3"
				>
					{fullName}
				</h1>
				<p
					use:animate_on_scroll={{ type: 'fadeInUp', duration: 0.8, delay: 0.2 }}
					class="text-lg sm:text-xl text-text-primary mb-4"
				>
					{tagline}
				</p>
				<p
					use:animate_on_scroll={{ type: 'fadeInUp', duration: 0.8, delay: 0.4 }}
					class="text-sm sm:text-base text-text-secondary max-w-xl mx-auto"
				>
					{bio}
				</p>
			{/if}

			<!-- CTA Buttons -->
			<div
				use:animate_on_scroll={{ type: 'fadeInUp', duration: 0.8, delay: 0.6 }}
				class="flex flex-col sm:flex-row gap-4 justify-center items-center"
			>
				<a
					href="#projects"
					use:smooth_scroll
					class="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-accent/40 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
				>
					View My Work
					<svg
						class="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
				</a>
				<a
					href="#contact"
					use:smooth_scroll
					class="inline-flex items-center px-8 py-4 bg-surface text-text-primary font-semibold rounded-lg border-2 border-primary/30 hover:border-primary hover:bg-primary/10 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
				>
					Get In Touch
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	/* Optional: Add animated background gradient */
	section::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -10;
		opacity: 0.2;
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
