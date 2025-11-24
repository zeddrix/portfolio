<script lang="ts">
	/**
	 * Skill data
	 */
	export let name: string;
	export let category: 'programming' | 'frontend' | 'backend' | 'devops' | 'tools' = 'programming';
	export let proficiencyLevel: number = 3;
	export let iconUrl: string | null = null;
	export let isFeatured = false;

	/**
	 * Get category color classes
	 */
	function getCategoryColor(): string {
		switch (category) {
			case 'programming':
				return 'bg-primary/10 text-primary border-primary/30';
			case 'frontend':
				return 'bg-secondary/10 text-secondary border-secondary/30';
			case 'backend':
				return 'bg-accent/10 text-accent border-accent/30';
			case 'devops':
				return 'bg-success/10 text-success border-success/30';
			case 'tools':
				return 'bg-text-secondary/10 text-text-secondary border-text-secondary/30';
			default:
				return 'bg-primary/10 text-primary border-primary/30';
		}
	}

	/**
	 * Get proficiency stars
	 */
	function getProficiencyStars(): number[] {
		return Array.from({ length: 5 }, (_, i) => i + 1);
	}
</script>

<div class={`skill-badge ${getCategoryColor()}`} class:featured={isFeatured}>
	<!-- Icon -->
	{#if iconUrl}
		<img src={iconUrl} alt={name} class="skill-icon" loading="lazy" />
	{/if}

	<!-- Name -->
	<span class="skill-name">{name}</span>

	<!-- Proficiency Level -->
	<div class="proficiency-stars" aria-label={`Proficiency: ${proficiencyLevel} out of 5`}>
		{#each getProficiencyStars() as star}
			<svg
				class="star"
				class:filled={star <= proficiencyLevel}
				fill="currentColor"
				viewBox="0 0 20 20"
				aria-hidden="true"
			>
				<path
					d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
				/>
			</svg>
		{/each}
	</div>
</div>

<style>
	.skill-badge {
		@apply inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-all;
		@apply hover:shadow-md hover:scale-105;
	}

	.skill-badge.featured {
		@apply ring-2 ring-primary ring-offset-2 ring-offset-background;
	}

	.skill-icon {
		@apply w-5 h-5 object-contain;
	}

	.skill-name {
		@apply font-medium text-sm;
	}

	.proficiency-stars {
		@apply flex items-center gap-0.5 ml-auto;
	}

	.star {
		@apply w-3 h-3 text-text-secondary;
	}

	.star.filled {
		@apply text-current;
	}
</style>
