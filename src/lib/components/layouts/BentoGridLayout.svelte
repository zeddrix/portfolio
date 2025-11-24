<script lang="ts">
	import Navigation from '$lib/components/shared/Navigation.svelte';
	import BentoGridCard from './BentoGridCard.svelte';
	import SkillBadge from '$lib/components/shared/SkillBadge.svelte';

	// TODO: Replace with actual data fetching in Phase 7
	const mockSkills = [
		{ name: 'TypeScript', category: 'programming' as const, proficiencyLevel: 5 },
		{ name: 'SvelteKit', category: 'frontend' as const, proficiencyLevel: 5 },
		{ name: 'Tailwind', category: 'frontend' as const, proficiencyLevel: 5 },
		{ name: 'Node.js', category: 'backend' as const, proficiencyLevel: 4 }
	];
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
					title="Zeddrix"
					description="Full Stack Developer crafting modern web experiences"
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
					description="Passionate about building scalable applications with modern technologies."
				/>

				<!-- Project Card 1 (Medium) -->
				<BentoGridCard
					cardType="project"
					size="medium"
					title="Example Project"
					description="A showcase of my latest work using SvelteKit and TypeScript"
					imageUrl="https://via.placeholder.com/600x400"
					link="/projects/example"
				/>

				<!-- Skills Card (Medium) -->
				<BentoGridCard cardType="skill" size="medium" title="Tech Stack">
					<div class="flex flex-wrap gap-2 mt-4">
						{#each mockSkills as skill}
							<SkillBadge
								name={skill.name}
								category={skill.category}
								proficiencyLevel={skill.proficiencyLevel}
								iconUrl={null}
							/>
						{/each}
					</div>
				</BentoGridCard>

				<!-- Project Card 2 (Small) -->
				<BentoGridCard
					cardType="project"
					size="small"
					title="Project Two"
					imageUrl="https://via.placeholder.com/400x400"
					link="/projects/example-2"
				/>

				<!-- Project Card 3 (Small) -->
				<BentoGridCard
					cardType="project"
					size="small"
					title="Project Three"
					imageUrl="https://via.placeholder.com/400x400"
					link="/projects/example-3"
				/>

				<!-- Contact Card (Medium) -->
				<BentoGridCard cardType="contact" size="medium" title="Let's Connect">
					<div class="mt-4 space-y-3">
						<a
							href="mailto:contact@example.com"
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
						<a
							href="https://github.com"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 text-text-primary hover:text-primary transition-colors"
						>
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
								/>
							</svg>
							<span>GitHub</span>
						</a>
					</div>
				</BentoGridCard>

				<!-- Additional Info Card (Small) -->
				<BentoGridCard cardType="about" size="small" title="Available">
					<p class="text-sm text-text-secondary mt-2">Open to new opportunities</p>
				</BentoGridCard>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<footer class="py-8 border-t border-border">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<p class="text-center text-text-secondary text-sm">
				&copy; {new Date().getFullYear()} Zeddrix. All rights reserved.
			</p>
		</div>
	</footer>
</div>
