<script lang="ts">
	import { animate_on_scroll } from '$lib/actions/animate';

	/**
	 * Skill data
	 */
	export let name: string;
	export let category: 'programming' | 'frontend' | 'backend' | 'devops' | 'tools' = 'programming';
	export let proficiencyLevel: number = 3;
	export let iconUrl: string | null = null;
	export let isFeatured = false;

	/**
	 * Get category color classes with gradients
	 */
	function getCategoryColor(): string {
		switch (category) {
			case 'programming':
				return 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/30 hover:from-primary/20 hover:to-secondary/20 hover:border-primary';
			case 'frontend':
				return 'bg-gradient-to-r from-secondary/10 to-accent/10 text-secondary border-secondary/30 hover:from-secondary/20 hover:to-accent/20 hover:border-secondary';
			case 'backend':
				return 'bg-gradient-to-r from-accent/10 to-primary/10 text-accent border-accent/30 hover:from-accent/20 hover:to-primary/20 hover:border-accent';
			case 'devops':
				return 'bg-gradient-to-r from-success/10 to-primary/10 text-success border-success/30 hover:from-success/20 hover:to-primary/20 hover:border-success';
			case 'tools':
				return 'bg-gradient-to-r from-text-secondary/10 to-primary/10 text-text-secondary border-text-secondary/30 hover:from-text-secondary/20 hover:to-primary/20';
			default:
				return 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/30 hover:from-primary/20 hover:to-secondary/20 hover:border-primary';
		}
	}

	/**
	 * Get proficiency stars
	 */
	function getProficiencyStars(): number[] {
		return Array.from({ length: 5 }, (_, i) => i + 1);
	}
</script>

<div
	use:animate_on_scroll={{ type: 'scaleIn', duration: 0.5 }}
	class={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:shadow-lg hover:scale-105 ${getCategoryColor()} ${isFeatured ? 'ring-2 ring-accent ring-offset-2 ring-offset-background shadow-md shadow-accent/30' : ''}`}
>
	<!-- Icon -->
	{#if iconUrl}
		<img src={iconUrl} alt={name} class="w-5 h-5 object-contain" loading="lazy" />
	{/if}

	<!-- Name -->
	<span class="font-medium text-sm">{name}</span>

	<!-- Proficiency Level -->
	<div
		class="flex items-center gap-0.5 ml-auto"
		aria-label={`Proficiency: ${proficiencyLevel} out of 5`}
	>
		{#each getProficiencyStars() as star}
			<svg
				class={`w-3 h-3 ${star <= proficiencyLevel ? 'text-current' : 'text-text-secondary'}`}
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
