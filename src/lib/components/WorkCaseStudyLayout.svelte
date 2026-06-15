<script>
	import {
		caseStudyProjects,
		getMoreProjectsForCaseStudies
	} from '$lib/data/portfolio';
	import OptimizedImage from '$lib/components/OptimizedImage.svelte';
	import ProjectCardCompact from '$lib/components/ProjectCardCompact.svelte';
	import {
		getProjectTypeLabel,
		getStatusLabel
	} from '$lib/utils/portfolio-display';
	import { appPath } from '$lib/utils/app-path';

	const moreProjects = getMoreProjectsForCaseStudies();

	/** @param {import('$lib/types/portfolio').PortfolioProject} project @param {string} title */
	function getDetailSection(project, title) {
		return project.detailSections.find((section) => section.title === title)?.body ?? '';
	}
</script>

<div class="space-y-14">
	{#each caseStudyProjects as project (project.slug)}
		<article
			data-testid={'case-study-' + project.slug}
			class="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm"
		>
			<div class="grid gap-0 lg:grid-cols-2">
				{#if project.primaryImage}
					<OptimizedImage
						src={project.primaryImage}
						alt={project.name + ' case study preview'}
						className="min-h-[240px]"
						sizes="(max-width: 1024px) 100vw, 50vw"
						loading="lazy"
					/>
				{:else}
					<div class="min-h-[240px] bg-zinc-100"></div>
				{/if}
				<div class="space-y-5 p-6 sm:p-8">
					<div class="flex flex-wrap gap-2">
						<span class="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
							{getProjectTypeLabel(project)}
						</span>
						<span class="rounded-full bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
							{getStatusLabel(project.status)}
						</span>
					</div>
					<h3 class="text-3xl font-bold tracking-tight text-zinc-950">{project.name}</h3>
					<p class="text-base font-medium text-zinc-500">{project.role}</p>
					{#if project.outcome}
						<p class="text-lg leading-relaxed text-zinc-700">{project.outcome}</p>
					{/if}
					<div class="grid gap-4 sm:grid-cols-2">
						<div class="rounded-2xl bg-zinc-50 p-4">
							<p class="text-sm font-semibold text-zinc-900">Problem</p>
							<p class="mt-2 text-sm leading-relaxed text-zinc-600">
								{getDetailSection(project, 'Problem')}
							</p>
						</div>
						<div class="rounded-2xl bg-zinc-50 p-4">
							<p class="text-sm font-semibold text-zinc-900">Approach</p>
							<p class="mt-2 text-sm leading-relaxed text-zinc-600">
								{getDetailSection(project, 'Approach')}
							</p>
						</div>
					</div>
					<a
						data-testid={'case-study-link-' + project.slug}
						href={appPath('/projects/' + project.slug)}
						class="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
					>
						View full case study
					</a>
				</div>
			</div>
		</article>
	{/each}

	<div data-testid="work-more-projects" class="space-y-4">
		<h3 class="text-2xl font-semibold text-zinc-900">More projects</h3>
		<ul class="grid gap-4 md:grid-cols-2">
			{#each moreProjects as project (project.slug)}
				<li>
					<ProjectCardCompact {project} />
				</li>
			{/each}
		</ul>
	</div>
</div>
