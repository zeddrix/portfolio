<script lang="ts">
	import { animate_on_scroll } from '$lib/actions/animate';
	import Navigation from '$lib/components/shared/Navigation.svelte';
	import Hero from '$lib/components/shared/Hero.svelte';
	import ProjectCard from '$lib/components/shared/ProjectCard.svelte';
	import SkillBadge from '$lib/components/shared/SkillBadge.svelte';
	import TimelineComponent from '$lib/components/shared/TimelineComponent.svelte';
	import ContactSection from '$lib/components/shared/ContactSection.svelte';
	import ScrollIndicator from '$lib/components/shared/ScrollIndicator.svelte';
	import type { TimelineItem } from '$lib/types/timeline';

	// TODO: Replace with actual data fetching in Phase 7
	const mockProjects = [
		{
			title: 'Example Project 1',
			slug: 'example-project-1',
			shortDescription: 'A brief description of the first project.',
			techStack: ['SvelteKit', 'TypeScript', 'Tailwind'],
			featuredImageUrl: 'https://via.placeholder.com/600x400',
			isFeatured: true
		},
		{
			title: 'Example Project 2',
			slug: 'example-project-2',
			shortDescription: 'A brief description of the second project.',
			techStack: ['React', 'Node.js', 'PostgreSQL'],
			featuredImageUrl: 'https://via.placeholder.com/600x400',
			isFeatured: false
		}
	];

	const mockSkills = [
		{ name: 'TypeScript', category: 'programming' as const, proficiencyLevel: 5, isFeatured: true },
		{ name: 'SvelteKit', category: 'frontend' as const, proficiencyLevel: 5, isFeatured: true },
		{ name: 'Tailwind CSS', category: 'frontend' as const, proficiencyLevel: 5, isFeatured: false },
		{ name: 'Node.js', category: 'backend' as const, proficiencyLevel: 4, isFeatured: false }
	];

	const mockExperiences: TimelineItem[] = [
		{
			id: '1',
			title: 'Senior Developer',
			subtitle: 'Company Name',
			description: 'Leading development of web applications using modern technologies.',
			startDate: '2022-01-01',
			endDate: null,
			isCurrent: true
		}
	];
</script>

<div class="min-h-screen bg-background">
	<Navigation />

	<!-- Hero Section -->
	<Hero variant="single_page" />
	<ScrollIndicator targetId="about" />

	<!-- About Section -->
	<section id="about" class="py-20">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2
				use:animate_on_scroll={{ type: 'fadeInUp' }}
				class="text-3xl sm:text-4xl font-bold text-primary mb-12 text-center"
			>
				About Me
			</h2>
			<div class="max-w-3xl mx-auto">
				<p
					use:animate_on_scroll={{ type: 'fadeInUp', delay: 0.2 }}
					class="text-lg text-text-secondary leading-relaxed"
				>
					I'm a passionate full-stack developer with expertise in modern web technologies. I love
					creating beautiful, functional, and user-friendly applications.
				</p>
			</div>
		</div>
	</section>

	<!-- Projects Section -->
	<section id="projects" class="py-20 bg-surface">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2
				use:animate_on_scroll={{ type: 'fadeInUp' }}
				class="text-3xl sm:text-4xl font-bold text-primary mb-12 text-center"
			>
				Projects
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
				{#each mockProjects as project}
					<ProjectCard
						variant="grid"
						title={project.title}
						slug={project.slug}
						shortDescription={project.shortDescription}
						techStack={project.techStack}
						featuredImageUrl={project.featuredImageUrl}
						isFeatured={project.isFeatured}
					/>
				{/each}
			</div>
		</div>
	</section>

	<!-- Skills Section -->
	<section id="skills" class="py-20">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2
				use:animate_on_scroll={{ type: 'fadeInUp' }}
				class="text-3xl sm:text-4xl font-bold text-primary mb-12 text-center"
			>
				Skills & Technologies
			</h2>
			<div class="flex flex-wrap justify-center gap-4">
				{#each mockSkills as skill}
					<SkillBadge
						name={skill.name}
						category={skill.category}
						proficiencyLevel={skill.proficiencyLevel}
						isFeatured={skill.isFeatured}
						iconUrl={null}
					/>
				{/each}
			</div>
		</div>
	</section>

	<!-- Experience Section -->
	<section id="experience" class="py-20 bg-surface">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2
				use:animate_on_scroll={{ type: 'fadeInUp' }}
				class="text-3xl sm:text-4xl font-bold text-primary mb-12 text-center"
			>
				Experience
			</h2>
			<div class="max-w-3xl mx-auto">
				<TimelineComponent items={mockExperiences} type="experience" />
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
