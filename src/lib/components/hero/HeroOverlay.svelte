<script lang="ts">
	import type { Project } from '$lib/types/database';

	export let project: Project;

	// Get button text based on mode
	$: buttonText = getButtonText(project);

	function getButtonText(proj: Project): string {
		if (proj.button_text_mode === 'custom' && proj.button_text) {
			return proj.button_text;
		}
		// Default fallback
		return proj.button_text || 'Explore Project';
	}
</script>

<div class="absolute inset-0 z-10 flex items-center justify-center">
	<div class="text-center max-w-3xl mx-auto px-4">
		<!-- Project Title -->
		<h1
			class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 drop-shadow-lg"
		>
			{project.title}
		</h1>

		<!-- Short Description -->
		<p class="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
			{project.short_description}
		</p>

		<!-- CTA Button -->
		<a
			href="/projects/{project.slug}"
			class="inline-flex items-center px-8 py-4 bg-white text-black font-semibold rounded-lg
				   hover:bg-primary hover:text-white transition-all duration-300
				   shadow-lg hover:shadow-xl hover:scale-105
				   focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50"
		>
			{buttonText}
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
	</div>
</div>
