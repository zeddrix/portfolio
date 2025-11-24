<script lang="ts">
	import Navigation from '$lib/components/shared/Navigation.svelte';
	import Hero from '$lib/components/shared/Hero.svelte';
	import CaseStudyCard from './CaseStudyCard.svelte';
	import ContactSection from '$lib/components/shared/ContactSection.svelte';

	// TODO: Replace with actual data fetching in Phase 7
	const mockProjects = [
		{
			id: '1',
			title: 'Example Project',
			slug: 'example-project',
			shortDescription: 'A brief description of the project showcasing key features.',
			challenge:
				'The main challenge was to create a scalable architecture that could handle high traffic.',
			solution:
				'Implemented a microservices architecture with proper load balancing and caching strategies.',
			techStack: ['SvelteKit', 'TypeScript', 'PostgreSQL', 'Docker'],
			featuredImageUrl: 'https://via.placeholder.com/1200x600',
			metrics: {
				'Load Time': '< 1s',
				'User Growth': '+150%',
				Performance: '95/100'
			}
		}
	];
</script>

<div class="min-h-screen bg-background">
	<Navigation />

	<!-- Hero Section -->
	<Hero variant="case_study" />

	<!-- Projects Section -->
	<section id="projects" class="py-20">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4">
					Featured Projects
				</h2>
				<p class="text-lg text-text-secondary">Detailed case studies of my recent work</p>
			</div>

			<div class="space-y-20">
				{#each mockProjects as project (project.id)}
					<CaseStudyCard
						title={project.title}
						slug={project.slug}
						shortDescription={project.shortDescription}
						challenge={project.challenge}
						solution={project.solution}
						techStack={project.techStack}
						featuredImageUrl={project.featuredImageUrl}
						metrics={project.metrics}
					/>
				{/each}
			</div>
		</div>
	</section>

	<!-- Contact Section -->
	<ContactSection variant="full" />

	<!-- Footer -->
	<footer class="py-8 border-t border-border">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<p class="text-center text-text-secondary text-sm">
				&copy; {new Date().getFullYear()} Zeddrix. All rights reserved.
			</p>
		</div>
	</footer>
</div>
