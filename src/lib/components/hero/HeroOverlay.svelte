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
	<div class="text-center max-w-4xl mx-auto px-4">
		<!-- Project Title - Squarespace Style Elegant Serif -->
		<h1 class="heading-hero text-white mb-6 drop-shadow-lg">
			{project.title}
		</h1>

		<!-- Short Description -->
		<p class="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow-md">
			{project.short_description}
		</p>

		<!-- CTA Button - Squarespace Style -->
		<a href="/projects/{project.slug}" class="btn-white group">
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
