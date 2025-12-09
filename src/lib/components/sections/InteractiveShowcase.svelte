<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Project } from '$lib/types/database';

	export let projects: Project[] = [];

	let containerElement: HTMLDivElement | null = null;
	let mouseX = 0;
	let mouseY = 0;
	let animationFrameId: number;

	// Generate random positions for floating cards
	$: floatingCards = projects.slice(0, 9).map((project, index) => ({
		project,
		// Random-ish positions based on index
		x: (index % 3) * 33 + Math.random() * 10,
		y: Math.floor(index / 3) * 33 + Math.random() * 10,
		rotation: (Math.random() - 0.5) * 15,
		scale: 0.8 + Math.random() * 0.4,
		depth: Math.random()
	}));

	function handleMouseMove(event: MouseEvent) {
		if (!containerElement) return;

		const rect = containerElement.getBoundingClientRect();
		mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
		mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
	}

	function updateParallax() {
		const cards = containerElement?.querySelectorAll('.floating-card');
		cards?.forEach((card, index) => {
			const depth = floatingCards[index]?.depth || 0.5;
			const moveX = mouseX * 30 * depth;
			const moveY = mouseY * 30 * depth;
			const rotateX = mouseY * 5 * depth;
			const rotateY = -mouseX * 5 * depth;

			(card as HTMLElement).style.transform = `
				translate(${moveX}px, ${moveY}px)
				rotateX(${rotateX}deg)
				rotateY(${rotateY}deg)
				rotate(${floatingCards[index]?.rotation || 0}deg)
				scale(${floatingCards[index]?.scale || 1})
			`;
		});

		animationFrameId = requestAnimationFrame(updateParallax);
	}

	onMount(() => {
		if (containerElement) {
			animationFrameId = requestAnimationFrame(updateParallax);
		}
	});

	onDestroy(() => {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}
	});
</script>

<section id="interactive-showcase" class="py-20 bg-surface overflow-hidden">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div class="text-center mb-12">
			<h2 class="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Made with Passion</h2>
			<p class="text-lg text-text-secondary">Explore my work</p>
		</div>

		<!-- Interactive Floating Cards -->
		<div
			bind:this={containerElement}
			class="relative h-[500px] lg:h-[600px] perspective-1000"
			role="presentation"
			on:mousemove={handleMouseMove}
		>
			{#each floatingCards as card, _index}
				<a
					href="/projects/{card.project.slug}"
					class="floating-card absolute block w-40 h-28 sm:w-56 sm:h-40 lg:w-64 lg:h-44 rounded-xl overflow-hidden shadow-2xl transition-shadow duration-300 hover:shadow-primary/20"
					style="
						left: {card.x}%;
						top: {card.y}%;
						z-index: {Math.round(card.depth * 10)};
					"
				>
					<img
						src={card.project.featured_image_url}
						alt={card.project.title}
						class="w-full h-full object-cover"
						loading="lazy"
					/>
					<div
						class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-3"
					>
						<span class="text-white text-sm font-medium">{card.project.title}</span>
					</div>
				</a>
			{/each}

			<!-- Center text overlay -->
			<div class="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
				<div class="text-center bg-background/80 backdrop-blur-sm px-8 py-6 rounded-2xl">
					<p class="text-2xl font-bold text-text-primary">Made with</p>
					<p class="text-3xl font-bold text-primary">Zeddrix</p>
				</div>
			</div>
		</div>

		<!-- Mobile Fallback: Simple Grid -->
		<div class="lg:hidden mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
			{#each projects.slice(0, 6) as project}
				<a href="/projects/{project.slug}" class="group block">
					<div class="aspect-video rounded-lg overflow-hidden bg-background">
						<img
							src={project.featured_image_url}
							alt={project.title}
							class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
							loading="lazy"
						/>
					</div>
					<p class="mt-2 text-sm text-text-primary truncate">{project.title}</p>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.perspective-1000 {
		perspective: 1000px;
		transform-style: preserve-3d;
	}

	.floating-card {
		transform-style: preserve-3d;
		transition: transform 0.1s ease-out;
		will-change: transform;
	}

	/* Hide interactive showcase on mobile, show simple grid instead */
	@media (max-width: 1023px) {
		.perspective-1000 {
			display: none;
		}
	}
</style>
