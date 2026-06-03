<script>
	import { projects } from '$lib/data/portfolio';
	import ProjectCardCompact from '$lib/components/ProjectCardCompact.svelte';
	import { filterProjectsByWorkFilter } from '$lib/utils/portfolio-display';

	/** @type {import('$lib/types/portfolio').WorkProjectFilter} */
	let activeFilter = 'all';

	const filters = [
		{ id: 'all', label: 'All', testId: 'work-filter-all' },
		{ id: 'personal', label: 'Personal', testId: 'work-filter-personal' },
		{ id: 'client', label: 'Client', testId: 'work-filter-client' }
	];

	$: visibleProjects = filterProjectsByWorkFilter(projects, activeFilter);
</script>

<div data-testid="work-featured-grid" class="space-y-6">
	<div class="flex flex-wrap gap-2" role="group" aria-label="Filter projects">
		{#each filters as filter (filter.id)}
			<button
				type="button"
				data-testid={filter.testId}
				class={'rounded-full px-4 py-2 text-sm font-semibold transition-colors ' +
					(activeFilter === filter.id
						? 'bg-zinc-900 text-white'
						: 'bg-white text-zinc-600 ring-1 ring-zinc-200 hover:text-zinc-900')}
				aria-pressed={activeFilter === filter.id}
				on:click={() => (activeFilter = /** @type {import('$lib/types/portfolio').WorkProjectFilter} */ (filter.id))}
			>
				{filter.label}
			</button>
		{/each}
	</div>
	<ul class="grid gap-4 md:grid-cols-2">
		{#each visibleProjects as project (project.slug)}
			<li>
				<ProjectCardCompact {project} />
			</li>
		{/each}
	</ul>
</div>
