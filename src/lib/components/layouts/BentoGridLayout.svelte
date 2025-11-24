<script lang="ts">
	import Navigation from '$lib/components/shared/Navigation.svelte';
	import BentoGridCard from './BentoGridCard.svelte';
	import SkillBadge from '$lib/components/shared/SkillBadge.svelte';
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
	export let skills: Skill[] = [];
	// These props are passed by layout system but not used in bento grid layout
	export let certifications: Certification[] = [];
	export let experiences: Experience[] = [];
	export let socialLinks: SocialLink[] = [];

	// Get featured skills or top 6 skills
	const displaySkills = skills.filter((s) => s.is_featured).slice(0, 6);

	// Acknowledge unused props to suppress warnings (layout props passed by system)
	const _unusedProps = { certifications, experiences };

	// Get featured projects or first 3 projects
	const displayProjects = projects.slice(0, 3);
</script>

<div class="min-h-screen bg-background">
	<Navigation />

	<!-- Main Content -->
	<div class="min-h-[calc(100vh-8rem)]">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<!-- Bento Grid Container -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[200px] gap-4">
				<!-- Hero Card (Large) -->
				<BentoGridCard
					cardType="hero"
					size="large"
					title={profile?.full_name || 'Portfolio'}
					description={profile?.tagline || 'Full Stack Developer'}
				>
					<div class="mt-6 flex gap-4">
						<a
							href="#projects"
							class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
						>
							View Work
						</a>
						<a
							href="#contact"
							class="inline-flex items-center px-4 py-2 bg-surface text-text-primary rounded-lg border border-border hover:bg-background transition-colors"
						>
							Contact
						</a>
					</div>
				</BentoGridCard>

				<!-- About Card (Medium) -->
				<BentoGridCard
					cardType="about"
					size="medium"
					title="About Me"
					description={profile?.bio.slice(0, 120) + '...' || 'Loading...'}
				/>

				<!-- Project Cards -->
				{#if displayProjects.length > 0}
					{#each displayProjects as project, index}
						{#if index === 0}
							<!-- First project - Medium -->
							<BentoGridCard
								cardType="project"
								size="medium"
								title={project.title}
								description={project.short_description}
								imageUrl={project.featured_image_url}
								link={`/projects/${project.slug}`}
							/>
						{:else}
							<!-- Other projects - Small -->
							<BentoGridCard
								cardType="project"
								size="small"
								title={project.title}
								imageUrl={project.featured_image_url}
								link={`/projects/${project.slug}`}
							/>
						{/if}
					{/each}
				{/if}

				<!-- Skills Card (Medium) -->
				<BentoGridCard cardType="skill" size="medium" title="Tech Stack">
					{#if displaySkills.length > 0}
						<div class="flex flex-wrap gap-2 mt-4">
							{#each displaySkills as skill}
								<SkillBadge
									name={skill.name}
									category={skill.category}
									proficiencyLevel={skill.proficiency_level}
									iconUrl={skill.icon_url}
								/>
							{/each}
						</div>
					{:else}
						<p class="text-sm text-text-secondary mt-4">No skills listed yet.</p>
					{/if}
				</BentoGridCard>

				<!-- Contact Card (Medium) -->
				<BentoGridCard cardType="contact" size="medium" title="Let's Connect">
					<div class="mt-4 space-y-3">
						{#if profile?.email}
							<a
								href="mailto:{profile.email}"
								class="flex items-center gap-2 text-text-primary hover:text-primary transition-colors"
							>
								<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								<span>Email Me</span>
							</a>
						{/if}
						{#each socialLinks.slice(0, 2) as link}
							<a
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-2 text-text-primary hover:text-primary transition-colors"
							>
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									{#if link.icon_name === 'github'}
										<path
											d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
										/>
									{:else}
										<circle cx="12" cy="12" r="10" />
									{/if}
								</svg>
								<span>{link.platform}</span>
							</a>
						{/each}
					</div>
				</BentoGridCard>

				<!-- Additional Info Card (Small) -->
				<BentoGridCard cardType="about" size="small" title="Status">
					<p class="text-sm text-text-secondary mt-2">
						{profile?.available_for_work ? 'Open to new opportunities' : 'Currently unavailable'}
					</p>
				</BentoGridCard>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<Footer {socialLinks} {profile} />
</div>
