<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Project } from '$lib/types/database';

	export let projects: Project[] = [];

	let containerElement: HTMLDivElement | null = null;
	let mouseX = 0;
	let mouseY = 0;
	let animationFrameId: number;
	let sectionVisible = false;

	// Predefined card positions for a more dramatic, Squarespace-like layout
	// These mimic the scattered, varied-size look from the inspiration
	const cardConfigs = [
		// Row 1 - Top
		{ x: 2, y: 3, scale: 0.6, rotation: -8, depth: 0.4 },
		{ x: 35, y: 0, scale: 0.85, rotation: 3, depth: 0.7 },
		{ x: 68, y: 5, scale: 0.55, rotation: 6, depth: 0.3 },
		{ x: 88, y: 2, scale: 0.5, rotation: -5, depth: 0.35 },
		// Row 2 - Upper middle
		{ x: 8, y: 25, scale: 0.75, rotation: 5, depth: 0.6 },
		{ x: 55, y: 22, scale: 1.0, rotation: -2, depth: 0.9 },
		{ x: 82, y: 28, scale: 0.7, rotation: 8, depth: 0.5 },
		// Row 3 - Center (around "Made with Zeddrix")
		{ x: 0, y: 45, scale: 0.65, rotation: -6, depth: 0.45 },
		{ x: 78, y: 42, scale: 0.8, rotation: 4, depth: 0.65 },
		// Row 4 - Lower middle
		{ x: 5, y: 65, scale: 0.7, rotation: 7, depth: 0.55 },
		{ x: 32, y: 70, scale: 0.6, rotation: -4, depth: 0.4 },
		{ x: 60, y: 62, scale: 0.9, rotation: 2, depth: 0.75 },
		{ x: 85, y: 68, scale: 0.55, rotation: -7, depth: 0.35 },
		// Row 5 - Bottom
		{ x: 15, y: 85, scale: 0.5, rotation: 5, depth: 0.3 },
		{ x: 45, y: 88, scale: 0.65, rotation: -3, depth: 0.5 },
		{ x: 75, y: 82, scale: 0.6, rotation: 6, depth: 0.4 }
	];

	// Generate floating cards with dramatic positioning
	$: floatingCards = projects.slice(0, 16).map((project, index) => {
		const config = cardConfigs[index] || {
			x: Math.random() * 80 + 5,
			y: Math.random() * 80 + 5,
			scale: 0.5 + Math.random() * 0.5,
			rotation: (Math.random() - 0.5) * 16,
			depth: 0.3 + Math.random() * 0.6
		};
		return { project, ...config };
	});

	function handleMouseMove(event: MouseEvent) {
		if (!containerElement) return;

		const rect = containerElement.getBoundingClientRect();
		mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
		mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
	}

	function updateParallax() {
		const cards = containerElement?.querySelectorAll('.floating-card');
		cards?.forEach((card, index) => {
			const cardData = floatingCards[index];
			if (!cardData) return;

			const depth = cardData.depth;
			const moveX = mouseX * 50 * depth;
			const moveY = mouseY * 50 * depth;
			const rotateX = mouseY * 12 * depth;
			const rotateY = -mouseX * 12 * depth;

			(card as HTMLElement).style.transform = `
				translate(${moveX}px, ${moveY}px)
				rotateX(${rotateX}deg)
				rotateY(${rotateY}deg)
				rotate(${cardData.rotation}deg)
				scale(${cardData.scale})
			`;
		});

		animationFrameId = requestAnimationFrame(updateParallax);
	}

	onMount(() => {
		if (containerElement) {
			animationFrameId = requestAnimationFrame(updateParallax);
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						sectionVisible = true;
					}
				});
			},
			{ threshold: 0.1 }
		);

		const section = document.getElementById('interactive-showcase');
		if (section) {
			observer.observe(section);
		}

		return () => {
			observer.disconnect();
		};
	});

	onDestroy(() => {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}
	});
</script>

<!-- Interactive Showcase - Squarespace Dark Dramatic Style -->
<section id="interactive-showcase" class="relative py-16 sm:py-24 bg-black overflow-hidden">
	<!-- Top Header Text -->
	<div
		class="text-center mb-4 transition-all duration-700"
		class:opacity-100={sectionVisible}
		class:opacity-0={!sectionVisible}
	>
		<p class="text-sm sm:text-base text-gray-400">Trusted by clients worldwide</p>
	</div>

	<!-- Full-width Floating Cards Container -->
	<div
		bind:this={containerElement}
		class="relative w-full h-[600px] sm:h-[700px] lg:h-[800px] perspective-container transition-all duration-700"
		class:opacity-100={sectionVisible}
		class:opacity-0={!sectionVisible}
		role="presentation"
		on:mousemove={handleMouseMove}
	>
		{#each floatingCards as card, index}
			<a
				href="/projects/{card.project.slug}"
				class="floating-card absolute block rounded-lg overflow-hidden shadow-2xl shadow-black/50 transition-shadow duration-300 hover:shadow-white/20"
				class:card-small={card.scale < 0.65}
				class:card-medium={card.scale >= 0.65 && card.scale < 0.85}
				class:card-large={card.scale >= 0.85}
				style="
					left: {card.x}%;
					top: {card.y}%;
					z-index: {Math.round(card.depth * 20) + index};
				"
			>
				{#if card.project.featured_image_url}
					<img
						src={card.project.featured_image_url}
						alt={card.project.title}
						class="w-full h-full object-cover"
						loading="lazy"
					/>
				{:else}
					<div
						class="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center"
					>
						<span class="text-white/50 text-sm">{card.project.title}</span>
					</div>
				{/if}
				<div
					class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-3"
				>
					<span class="text-white text-xs sm:text-sm font-medium truncate"
						>{card.project.title}</span
					>
				</div>
			</a>
		{/each}

		<!-- Center text overlay - Squarespace "Made with" Style -->
		<div class="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
			<div class="text-center px-4">
				<p class="text-base sm:text-lg text-gray-500 mb-2">Made with</p>
				<p class="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight">Zeddrix</p>
			</div>
		</div>
	</div>

	<!-- Mobile Fallback: Simple Grid -->
	<div
		class="lg:hidden px-4 sm:px-6 mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 transition-all duration-700"
		class:opacity-100={sectionVisible}
		class:opacity-0={!sectionVisible}
	>
		{#each projects.slice(0, 6) as project}
			<a href="/projects/{project.slug}" class="group block">
				<div class="aspect-video rounded-lg overflow-hidden bg-zinc-900">
					{#if project.featured_image_url}
						<img
							src={project.featured_image_url}
							alt={project.title}
							class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
							loading="lazy"
						/>
					{:else}
						<div class="w-full h-full flex items-center justify-center text-white/50 text-sm">
							{project.title}
						</div>
					{/if}
				</div>
				<p class="mt-2 text-xs text-white/80 truncate">{project.title}</p>
			</a>
		{/each}
	</div>

	<!-- Bottom CTA -->
	<div
		class="text-center mt-8 sm:mt-12 transition-all duration-700 delay-200"
		class:opacity-100={sectionVisible}
		class:opacity-0={!sectionVisible}
	>
		<a href="#contact" class="btn-white"> Start Your Project </a>
	</div>
</section>

<style>
	.perspective-container {
		perspective: 1500px;
		transform-style: preserve-3d;
	}

	.floating-card {
		transform-style: preserve-3d;
		transition:
			transform 0.12s ease-out,
			box-shadow 0.3s ease;
		will-change: transform;
	}

	/* Card size classes */
	.card-small {
		width: 140px;
		height: 100px;
	}

	.card-medium {
		width: 200px;
		height: 140px;
	}

	.card-large {
		width: 280px;
		height: 200px;
	}

	@media (min-width: 640px) {
		.card-small {
			width: 180px;
			height: 130px;
		}

		.card-medium {
			width: 260px;
			height: 180px;
		}

		.card-large {
			width: 360px;
			height: 250px;
		}
	}

	@media (min-width: 1024px) {
		.card-small {
			width: 220px;
			height: 160px;
		}

		.card-medium {
			width: 320px;
			height: 220px;
		}

		.card-large {
			width: 440px;
			height: 300px;
		}
	}

	/* Hide floating cards on mobile, show simple grid instead */
	@media (max-width: 1023px) {
		.perspective-container {
			display: none;
		}
	}
</style>
