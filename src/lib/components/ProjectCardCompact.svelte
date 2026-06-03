<script>
	import { getProjectTypeLabel, getStatusLabel } from '$lib/utils/portfolio-display';
	import { resolveStaticAsset } from '$lib/utils/static-asset';
	import { appPath } from '$lib/utils/app-path';

	/** @type {import('$lib/types/portfolio').PortfolioProject} */
	export let project;

	/** @param {import('$lib/types/portfolio').PortfolioProject} item */
	function primaryHref(item) {
		if (item.links.length > 0) {
			return item.links[0].url;
		}
		return appPath('/projects/' + item.slug);
	}

	/** @param {import('$lib/types/portfolio').PortfolioProject} item */
	function isExternalPrimary(item) {
		return item.links.length > 0 && item.links[0].external;
	}
</script>

<article
	data-testid={'project-card-' + project.slug}
	class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md"
>
	<div class="grid gap-0 sm:grid-cols-[160px_1fr]">
		{#if project.primaryImage}
			<img
				data-testid={'project-image-' + project.slug}
				src={resolveStaticAsset(project.primaryImage)}
				alt={project.name + ' preview'}
				class="h-full min-h-[132px] w-full object-cover"
				loading="lazy"
			/>
		{:else}
			<div class="min-h-[132px] bg-zinc-100"></div>
		{/if}
		<div class="space-y-3 p-5">
			<div class="flex flex-wrap items-center gap-2">
				<span
					data-testid={'project-type-label-' + project.slug}
					class="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-600"
				>
					{getProjectTypeLabel(project)}
				</span>
				<span class="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
					{getStatusLabel(project.status)}
				</span>
			</div>
			<p class="text-xl font-semibold text-zinc-950">{project.name}</p>
			<p class="text-sm text-zinc-600">{project.tagline}</p>
			<p class="text-sm font-medium text-zinc-500">{project.role}</p>
			<div class="flex flex-wrap gap-2">
				{#each project.techStack.slice(0, 4) as tech (tech)}
					<span class="rounded-full bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-600">
						{tech}
					</span>
				{/each}
			</div>
			<div class="flex flex-wrap gap-3 pt-1">
				<a
					data-testid={'project-link-' + project.slug}
					href={primaryHref(project)}
					target={isExternalPrimary(project) ? '_blank' : undefined}
					rel={isExternalPrimary(project) ? 'noopener noreferrer' : undefined}
					class="text-sm font-semibold text-[#136ef6] hover:text-[#0f5dcc]"
				>
					{isExternalPrimary(project) ? 'Visit' : 'Open'}
				</a>
				<a
					href={appPath('/projects/' + project.slug)}
					class="text-sm font-semibold text-zinc-500 hover:text-zinc-800"
				>
					Details
				</a>
			</div>
		</div>
	</div>
</article>
