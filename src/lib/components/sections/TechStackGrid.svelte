<script lang="ts">
	import type { Skill, SkillCategoryType } from '$lib/types/database';

	export let skills: Skill[] = [];
	export let showCategories: boolean = false;

	// Group skills by category
	$: skillsByCategory = skills.reduce(
		(acc, skill) => {
			if (!acc[skill.category]) {
				acc[skill.category] = [];
			}
			acc[skill.category].push(skill);
			return acc;
		},
		{} as Record<SkillCategoryType, Skill[]>
	);

	const categoryLabels: Record<SkillCategoryType, string> = {
		programming: 'Programming Languages',
		frontend: 'Frontend',
		backend: 'Backend',
		devops: 'DevOps',
		tools: 'Tools & Others'
	};

	function getCategoryLabel(category: string): string {
		return categoryLabels[category as SkillCategoryType] || category;
	}

	function getProficiencyLabel(level: number): string {
		if (level >= 5) return 'Expert';
		if (level >= 4) return 'Advanced';
		if (level >= 3) return 'Intermediate';
		if (level >= 2) return 'Beginner';
		return 'Learning';
	}
</script>

<div class="space-y-8">
	{#if showCategories}
		<!-- Categorized View -->
		{#each Object.entries(skillsByCategory) as [category, categorySkills]}
			<div>
				<h3 class="text-lg font-semibold text-text-primary mb-4">
					{getCategoryLabel(category)}
				</h3>
				<div class="flex flex-wrap gap-3">
					{#each categorySkills as skill}
						<div
							class="group relative flex items-center gap-2 px-4 py-2 bg-background rounded-lg border border-border hover:border-primary transition-all duration-300"
						>
							{#if skill.icon_url}
								<img src={skill.icon_url} alt={skill.name} class="w-6 h-6" loading="lazy" />
							{/if}
							<span class="text-text-primary">{skill.name}</span>

							<!-- Tooltip with proficiency -->
							<div
								class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-surface text-text-primary text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
							>
								{getProficiencyLabel(skill.proficiency_level)}
								<div class="flex gap-1 mt-1">
									{#each Array(5) as _, i}
										<div
											class="w-2 h-2 rounded-full {i < skill.proficiency_level
												? 'bg-primary'
												: 'bg-border'}"
										/>
									{/each}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	{:else}
		<!-- Flat Grid View -->
		<div class="flex flex-wrap justify-center gap-4">
			{#each skills as skill}
				<div
					class="group relative flex items-center gap-3 px-5 py-3 bg-background rounded-xl border border-border hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-105"
				>
					{#if skill.icon_url}
						<img src={skill.icon_url} alt={skill.name} class="w-8 h-8" loading="lazy" />
					{:else}
						<div class="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
							<span class="text-primary font-bold text-sm">{skill.name.charAt(0)}</span>
						</div>
					{/if}
					<span class="text-text-primary font-medium">{skill.name}</span>

					<!-- Proficiency indicator -->
					<div class="flex gap-0.5">
						{#each Array(5) as _, i}
							<div
								class="w-1.5 h-1.5 rounded-full transition-colors {i < skill.proficiency_level
									? 'bg-primary'
									: 'bg-border'}"
							/>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
