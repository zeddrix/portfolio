<script lang="ts">
	import type { Project } from '$lib/types/database';

	export let projects: Project[] = [];
	export let currentIndex: number = 0;
	export let onSelect: (index: number) => void = () => {};

	let containerElement: HTMLDivElement | null = null;

	// Auto-scroll to keep active thumbnail visible
	$: if (containerElement && projects.length > 0) {
		const thumbnailWidth = 160; // Approximate width + gap
		const scrollPosition =
			currentIndex * thumbnailWidth - containerElement.clientWidth / 2 + thumbnailWidth / 2;
		containerElement.scrollTo({ left: Math.max(0, scrollPosition), behavior: 'smooth' });
	}

	function handleKeyDown(event: KeyboardEvent, index: number) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onSelect(index);
		}
	}
</script>

<div class="absolute bottom-0 left-0 right-0 z-20 pb-6">
	<div class="max-w-6xl mx-auto px-4">
		<!-- Thumbnail container -->
		<div
			bind:this={containerElement}
			class="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
			role="tablist"
			aria-label="Project carousel thumbnails"
		>
			{#each projects as project, index}
				<button
					type="button"
					class="flex-shrink-0 snap-start relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg overflow-hidden transition-all duration-300 {index ===
					currentIndex
						? 'ring-2 ring-primary scale-105'
						: 'opacity-70 hover:opacity-100'}"
					role="tab"
					aria-selected={index === currentIndex}
					aria-label="View {project.title}"
					on:click={() => onSelect(index)}
					on:keydown={(e) => handleKeyDown(e, index)}
				>
					<div class="w-36 h-20 sm:w-40 sm:h-24">
						{#if project.demo_video_url}
							<video
								src={project.demo_video_url}
								class="w-full h-full object-cover"
								muted
								playsinline
								preload="metadata"
							>
								<track kind="captions" />
							</video>
						{:else}
							<img
								src={project.featured_image_url}
								alt={project.title}
								class="w-full h-full object-cover"
								loading="lazy"
							/>
						{/if}
					</div>

					<!-- Hover overlay with title -->
					<div
						class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2"
					>
						<span class="text-xs text-white font-medium truncate">{project.title}</span>
					</div>

					<!-- Active indicator -->
					{#if index === currentIndex}
						<div class="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
					{/if}
				</button>
			{/each}
		</div>

		<!-- Progress indicators -->
		<div class="flex justify-center gap-2 mt-3">
			{#each projects as _, index}
				<button
					type="button"
					class="w-2 h-2 rounded-full transition-all duration-300 {index === currentIndex
						? 'bg-primary w-6'
						: 'bg-text-secondary/30 hover:bg-text-secondary/50'}"
					aria-label="Go to slide {index + 1}"
					on:click={() => onSelect(index)}
				/>
			{/each}
		</div>
	</div>
</div>

<style>
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>
