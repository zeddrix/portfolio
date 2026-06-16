<script>
	import OptimizedImage from '$lib/components/OptimizedImage.svelte';
	import { getProjectTypeLabel, getStatusLabel } from '$lib/utils/portfolio-display';
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
	{#if project.primaryImage}
		<div class="aspect-[16/10] bg-zinc-50">
			<OptimizedImage
				testId={'project-image-' + project.slug}
				src={project.primaryImage}
				alt={project.name + ' preview'}
				className="h-full w-full"
				fit="contain"
				sizes="(max-width: 768px) 100vw, 50vw"
				preferredWidth={640}
				loading="lazy"
			/>
		</div>
	{:else}
		<div class="aspect-[16/10] bg-zinc-100"></div>
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
				data-testid={'project-details-link-' + project.slug}
				href={appPath('/projects/' + project.slug)}
				class="text-sm font-semibold text-zinc-500 hover:text-zinc-800"
			>
				Details
			</a>
		</div>
	</div>
</article>
