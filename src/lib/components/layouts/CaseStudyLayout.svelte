<script lang="ts">
	import Navigation from '$lib/components/shared/Navigation.svelte';
	import Hero from '$lib/components/shared/Hero.svelte';
	import CaseStudyCard from './CaseStudyCard.svelte';
	import ContactSection from '$lib/components/shared/ContactSection.svelte';
	import Footer from '$lib/components/shared/Footer.svelte';
	import type { Database } from '$lib/types/database';

	type Profile = Database['public']['Tables']['profile']['Row'];
	type Project = Database['public']['Tables']['projects']['Row'];
	type Skill = Database['public']['Tables']['skills']['Row'];
	type Certification = Database['public']['Tables']['certifications']['Row'];
	type Experience = Database['public']['Tables']['experiences']['Row'];
	type SocialLink = Database['public']['Tables']['social_links']['Row'];

	export let profile: Profile | null = null;
	export let projects: Project[] = [];
	// These props are passed by layout system but not used in case study layout
	export let skills: Skill[] = [];
	export let certifications: Certification[] = [];
	export let experiences: Experience[] = [];
	export let socialLinks: SocialLink[] = [];

	// Get featured projects or all projects
	const displayProjects = projects.filter((p) => p.is_featured) || projects;

	// Acknowledge unused props to suppress warnings (layout props passed by system)
	const _unusedProps = { skills, certifications, experiences };
</script>

<div class="min-h-screen bg-background">
	<Navigation />

	<!-- Hero Section -->
	<Hero {profile} />

	<!-- Projects Section -->
	<section id="projects" class="py-20">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4">
					Featured Projects
				</h2>
				<p class="text-lg text-text-secondary">Detailed case studies of my recent work</p>
			</div>

			{#if displayProjects.length > 0}
				<div class="space-y-20">
					{#each displayProjects as project (project.id)}
						<CaseStudyCard
							title={project.title}
							slug={project.slug}
							shortDescription={project.short_description}
							challenge={project.challenge || ''}
							solution={project.solution || ''}
							techStack={project.tech_stack}
							featuredImageUrl={project.featured_image_url}
							metrics={project.metrics}
						/>
					{/each}
				</div>
			{:else}
				<div class="text-center py-20">
					<p class="text-text-secondary text-lg">No projects available yet.</p>
				</div>
			{/if}
		</div>
	</section>

	<!-- Contact Section -->
	<ContactSection variant="full" {profile} />

	<!-- Footer -->
	<Footer {socialLinks} {profile} />
</div>
