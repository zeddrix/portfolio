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

<!-- Squarespace-style bottom thumbnail strip -->
<div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
	<!-- Thumbnail container - centered -->
	<div
		bind:this={containerElement}
		class="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory max-w-[90vw] px-4"
		role="tablist"
		aria-label="Project carousel thumbnails"
	>
		{#each projects.slice(0, 5) as project, index}
			<button
				type="button"
				class="flex-shrink-0 snap-center relative group cursor-pointer focus:outline-none rounded-lg overflow-hidden transition-all duration-300 shadow-lg
					   {index === currentIndex
					? 'ring-2 ring-white scale-110 shadow-xl'
					: 'opacity-80 hover:opacity-100 hover:scale-105'}"
				role="tab"
				aria-selected={index === currentIndex}
				aria-label="View {project.title}"
				on:click={() => onSelect(index)}
				on:keydown={(e) => handleKeyDown(e, index)}
			>
				<div class="w-28 h-16 sm:w-32 sm:h-20">
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
			</button>
		{/each}
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
