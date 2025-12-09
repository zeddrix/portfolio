<script lang="ts">
	import { animate_on_scroll } from '$lib/actions/animate';
	import Navigation from '$lib/components/shared/Navigation.svelte';
	import Hero from '$lib/components/shared/Hero.svelte';
	import ProjectCard from '$lib/components/shared/ProjectCard.svelte';
	import SkillBadge from '$lib/components/shared/SkillBadge.svelte';
	import TimelineComponent from '$lib/components/shared/TimelineComponent.svelte';
	import ContactSection from '$lib/components/shared/ContactSection.svelte';
	import ScrollIndicator from '$lib/components/shared/ScrollIndicator.svelte';
	import Footer from '$lib/components/shared/Footer.svelte';
	import type { TimelineItem } from '$lib/types/timeline';
	import type { Database } from '$lib/types/database';

	type Profile = Database['public']['Tables']['profile']['Row'];
	type Project = Database['public']['Tables']['projects']['Row'];
	type Skill = Database['public']['Tables']['skills']['Row'];
	type Certification = Database['public']['Tables']['certifications']['Row'];
	type Experience = Database['public']['Tables']['experiences']['Row'];
	type SocialLink = Database['public']['Tables']['social_links']['Row'];

	export let profile: Profile | null = null;
	export let projects: Project[] = [];
	export let skills: Skill[] = [];
	export let certifications: Certification[] = [];
	export let experiences: Experience[] = [];
	export let socialLinks: SocialLink[] = [];

	// Convert experiences to timeline items
	const experienceTimeline: TimelineItem[] = experiences.map((exp) => ({
		id: exp.id,
		title: exp.position,
		subtitle: exp.company,
		description: exp.description,
		startDate: exp.start_date,
		endDate: exp.end_date,
		isCurrent: exp.is_current,
		location: exp.location
	}));

	// Convert certifications to timeline items
	const certificationTimeline: TimelineItem[] = certifications.map((cert) => ({
		id: cert.id,
		title: cert.title,
		subtitle: cert.issuer,
		description: cert.credential_id || '',
		startDate: cert.issue_date,
		endDate: cert.expiry_date,
		isCurrent: false,
		url: cert.credential_url
	}));
</script>

<div class="min-h-screen bg-background">
	<Navigation />

	<!-- Hero Section -->
	<Hero {profile} />
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
					use:animate_on_scroll={{ type: 'fadeInUp', delay: 200 }}
					class="text-lg text-text-secondary leading-relaxed"
				>
					{profile?.bio || 'Loading...'}
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
			{#if projects.length > 0}
				<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
					{#each projects as project}
						<ProjectCard variant="grid" {project} />
					{/each}
				</div>
			{:else}
				<div class="text-center py-12">
					<p class="text-text-secondary">No projects available yet.</p>
				</div>
			{/if}
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
			{#if skills.length > 0}
				<div class="flex flex-wrap justify-center gap-4">
					{#each skills as skill}
						<SkillBadge
							name={skill.name}
							category={skill.category}
							proficiencyLevel={skill.proficiency_level}
							isFeatured={skill.is_featured}
							iconUrl={skill.icon_url}
						/>
					{/each}
				</div>
			{:else}
				<div class="text-center py-12">
					<p class="text-text-secondary">No skills listed yet.</p>
				</div>
			{/if}
		</div>
	</section>

	<!-- Experience Section -->
	{#if experienceTimeline.length > 0}
		<section id="experience" class="py-20 bg-surface">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2
					use:animate_on_scroll={{ type: 'fadeInUp' }}
					class="text-3xl sm:text-4xl font-bold text-primary mb-12 text-center"
				>
					Experience
				</h2>
				<div class="max-w-3xl mx-auto">
					<TimelineComponent items={experienceTimeline} type="experience" />
				</div>
			</div>
		</section>
	{/if}

	<!-- Certifications Section -->
	{#if certificationTimeline.length > 0}
		<section id="certifications" class="py-20">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2
					use:animate_on_scroll={{ type: 'fadeInUp' }}
					class="text-3xl sm:text-4xl font-bold text-primary mb-12 text-center"
				>
					Certifications
				</h2>
				<div class="max-w-3xl mx-auto">
					<TimelineComponent items={certificationTimeline} type="certification" />
				</div>
			</div>
		</section>
	{/if}

	<!-- Contact Section -->
	<ContactSection variant="full" {profile} />

	<!-- Footer -->
	<Footer {socialLinks} {profile} />
</div>
