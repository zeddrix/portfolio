<script lang="ts">
	import { onMount } from 'svelte';
	import type { DevelopmentProcessStep } from '$lib/types/database';

	export let steps: DevelopmentProcessStep[] = [];

	let activeStep = 0;
	let sectionVisible = false;

	// Icon mapping
	const iconMap: Record<string, string> = {
		search: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
		palette:
			'M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z',
		code: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
		rocket:
			'M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z'
	};

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						sectionVisible = true;
					}
				});
			},
			{ threshold: 0.2 }
		);

		const section = document.getElementById('development-process');
		if (section) {
			observer.observe(section);
		}

		return () => observer.disconnect();
	});

	function handleKeyDown(event: KeyboardEvent, index: number) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			activeStep = index;
		}
	}
</script>

<section id="development-process" class="py-20 bg-background">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div class="text-center mb-16">
			<h2 class="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Development Process</h2>
			<p class="text-lg text-text-secondary max-w-2xl mx-auto">
				A systematic approach to delivering high-quality solutions
			</p>
		</div>

		<!-- Desktop: Horizontal Timeline -->
		<div class="hidden lg:block">
			<div class="relative">
				<!-- Connection Line -->
				<div class="absolute top-12 left-0 right-0 h-1 bg-border">
					<div
						class="h-full bg-primary transition-all duration-500"
						style="width: {((activeStep + 1) / steps.length) * 100}%"
					/>
				</div>

				<!-- Steps -->
				<div class="relative flex justify-between">
					{#each steps as step, index}
						<button
							type="button"
							class="flex flex-col items-center w-1/4 group focus:outline-none"
							class:opacity-100={sectionVisible}
							class:opacity-0={!sectionVisible}
							style="transition-delay: {index * 150}ms"
							on:click={() => (activeStep = index)}
							on:keydown={(e) => handleKeyDown(e, index)}
						>
							<!-- Icon Circle -->
							<div
								class="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 {activeStep >=
								index
									? 'bg-primary text-white shadow-lg shadow-primary/30'
									: 'bg-surface text-text-secondary border-2 border-border group-hover:border-primary'}"
							>
								<svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.5"
										d={iconMap[step.icon || 'code']}
									/>
								</svg>
							</div>

							<!-- Title -->
							<h3
								class="mt-4 text-lg font-semibold transition-colors {activeStep === index
									? 'text-primary'
									: 'text-text-primary'}"
							>
								{step.title}
							</h3>

							<!-- Description (shown when active) -->
							<p
								class="mt-2 text-sm text-text-secondary text-center max-w-[200px] transition-opacity {activeStep ===
								index
									? 'opacity-100'
									: 'opacity-0'}"
							>
								{step.description}
							</p>
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Mobile: Vertical Timeline -->
		<div class="lg:hidden space-y-6">
			{#each steps as step, index}
				<div
					class="flex gap-4 opacity-0 animate-fade-in"
					style="animation-delay: {index * 150}ms; animation-fill-mode: forwards;"
				>
					<!-- Icon -->
					<div
						class="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center {activeStep >=
						index
							? 'bg-primary text-white'
							: 'bg-surface text-text-secondary border-2 border-border'}"
					>
						<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d={iconMap[step.icon || 'code']}
							/>
						</svg>
					</div>

					<!-- Content -->
					<div class="flex-1 pb-6 border-l-2 border-border pl-4 -ml-7 pt-1">
						<h3 class="text-lg font-semibold text-text-primary">{step.title}</h3>
						<p class="mt-1 text-text-secondary">{step.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.5s ease-out;
	}
</style>
