<script lang="ts">
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

<div class="single-page-layout">
	<Navigation />

	<!-- Hero Section -->
	<Hero variant="single_page" />
	<ScrollIndicator targetId="about" />

	<!-- About Section -->
	<section id="about" class="section">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 class="section-title">About Me</h2>
			<div class="max-w-3xl mx-auto">
				<p class="about-text">
					I'm a passionate full-stack developer with expertise in modern web technologies. I love
					creating beautiful, functional, and user-friendly applications.
				</p>
			</div>
		</div>
	</section>

	<!-- Projects Section -->
	<section id="projects" class="section bg-surface">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 class="section-title">Projects</h2>
			<div class="projects-grid">
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
	<section id="skills" class="section">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 class="section-title">Skills & Technologies</h2>
			<div class="skills-grid">
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
	<section id="experience" class="section bg-surface">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 class="section-title">Experience</h2>
			<div class="max-w-3xl mx-auto">
				<TimelineComponent items={mockExperiences} type="experience" />
			</div>
		</div>
	</section>

	<!-- Contact Section -->
	<ContactSection variant="full" />

	<!-- Footer -->
	<footer class="footer">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<p class="footer-text">&copy; {new Date().getFullYear()} Zeddrix. All rights reserved.</p>
		</div>
	</footer>
</div>

<style>
	.single-page-layout {
		@apply min-h-screen bg-background;
	}

	.section {
		@apply py-20;
	}

	.section-title {
		@apply text-3xl sm:text-4xl font-bold text-primary mb-12 text-center;
	}

	.about-text {
		@apply text-lg text-text-secondary leading-relaxed;
	}

	.projects-grid {
		@apply grid grid-cols-1 md:grid-cols-2 gap-8;
	}

	.skills-grid {
		@apply flex flex-wrap justify-center gap-4;
	}

	.footer {
		@apply py-8 border-t border-border;
	}

	.footer-text {
		@apply text-center text-text-secondary text-sm;
	}
</style>
