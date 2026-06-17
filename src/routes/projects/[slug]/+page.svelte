<script>
	import SeoHead from '$lib/components/SeoHead.svelte';
	import OptimizedImage from '$lib/components/OptimizedImage.svelte';
	import { getBandsForProject } from '$lib/data/portfolio';
	import { buildProjectMeta, homeSeo } from '$lib/data/seo';
	import {
		getProjectTypeLabel,
		getStatusLabel
	} from '$lib/utils/portfolio-display';
	import { appPath } from '$lib/utils/app-path';

	export let data;

	$: relatedBands = data.project ? getBandsForProject(data.project.slug) : [];
	$: pageSeo = data.project
		? buildProjectMeta(data.project)
		: {
				title: `Project Not Found | Zeddrix Fabian Portfolio`,
				description: homeSeo.description,
				path: '/'
			};
</script>

<SeoHead
	title={pageSeo.title}
	description={pageSeo.description}
	path={pageSeo.path}
	ogImage={pageSeo.ogImage}
/>

<div class="min-h-screen bg-[#f5f5f5] text-zinc-950">
	<main class="mx-auto w-[90%] max-w-[1400px] py-8 sm:py-10 md:py-14">
		{#if !data.project}
			<section
				data-testid="project-not-found"
				class="mx-auto max-w-3xl rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm sm:p-12"
			>
				<h1 class="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">Project not found</h1>
				<p class="mt-4 text-lg font-medium text-zinc-600">
					The project you are looking for does not exist or has been removed.
				</p>
				<a
					data-testid="project-not-found-home-link"
					href={appPath('/')}
					class="mt-8 inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
				>
					Back to home
				</a>
			</section>
		{:else}
			<section class="space-y-8">
				<a
					data-testid="project-detail-back-link"
					href={appPath('/')}
					class="inline-flex text-sm font-semibold text-[#136ef6] hover:text-[#0f5dcc]"
				>
					← Back to homepage
				</a>

				<div class="space-y-4">
					<div class="flex flex-wrap gap-2">
						<span
							data-testid="project-detail-type"
							class="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-700"
						>
							{getProjectTypeLabel(data.project)}
						</span>
						<span
							data-testid="project-detail-status"
							class="rounded-full bg-zinc-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-600"
						>
							{getStatusLabel(data.project.status)}
						</span>
					</div>
					<p data-testid="project-detail-role" class="text-base font-semibold text-zinc-600">
						{data.project.role}
					</p>
					{#if data.project.displayPeriod}
						<p
							data-testid="project-detail-period"
							class="text-base font-medium text-zinc-500"
						>
							{data.project.displayPeriod}
						</p>
					{/if}
					<h1
						data-testid="project-detail-title"
						class="text-[clamp(2.7rem,calc(0.35rem+4.8vw),4.5rem)] font-bold leading-[1.1] tracking-[-0.04em] text-black"
					>
						{data.project.name}
					</h1>
					<p class="max-w-4xl text-xl font-medium leading-[1.5] text-zinc-600">{data.project.description}</p>
					{#if data.project.outcome}
						<p data-testid="project-detail-outcome" class="max-w-4xl text-lg leading-relaxed text-zinc-700">
							{data.project.outcome}
						</p>
					{/if}
				</div>

				<div
					data-testid="project-detail-tech-stack"
					class="flex flex-wrap gap-2 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
				>
					{#each data.project.techStack as tech (tech)}
						<span class="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold tracking-wide text-zinc-700">
							{tech}
						</span>
					{/each}
				</div>

				{#if data.project.primaryImage}
					<div class="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
						<OptimizedImage
							testId="project-detail-hero-image"
							src={data.project.primaryImage}
							alt={data.project.name + ' hero preview'}
							fit="contain"
							sizes="(max-width: 768px) 100vw, 920px"
							loading="eager"
							fetchpriority="high"
						/>
					</div>
				{/if}

				{#if data.project.galleryImages.length > 0}
					<section
						class="grid gap-5 {data.project.galleryColumns === 3
							? 'md:grid-cols-3'
							: 'md:grid-cols-2'}"
					>
						{#each data.project.galleryImages as image, index (image)}
							<figure class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
								<OptimizedImage
									testId={'project-detail-gallery-image-' + (index + 1)}
									src={image}
									alt={data.project.name + ' gallery image ' + (index + 1)}
									fit="contain"
									sizes="(max-width: 768px) 100vw, 50vw"
									loading="lazy"
								/>
							</figure>
						{/each}
					</section>
				{/if}

				<section class="grid gap-5 md:grid-cols-2">
					{#each data.project.detailSections as section (section.title)}
						<article class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
							<h2 class="text-xl font-semibold text-zinc-900">{section.title}</h2>
							<p class="mt-3 text-base leading-relaxed text-zinc-600">{section.body}</p>
						</article>
					{/each}
				</section>

				{#if relatedBands.length > 0}
					<section
						data-testid="project-detail-related-capabilities"
						class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
					>
						<h2 class="text-2xl font-semibold text-zinc-900">Related capabilities</h2>
						<ul class="mt-4 flex flex-wrap gap-2">
							{#each relatedBands as band (band.id)}
								<li>
									<span class="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-700">
										{band.title}
									</span>
								</li>
							{/each}
						</ul>
					</section>
				{/if}

				<section
					data-testid="project-detail-links-section"
					class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
				>
					<h2 class="text-2xl font-semibold text-zinc-900">Links</h2>
					{#if data.project.links.length === 0}
						<p class="mt-3 text-base text-zinc-600">No external links added for this project yet.</p>
					{:else}
						<ul class="mt-4 space-y-3">
							{#each data.project.links as link, index (link.url)}
								<li>
									<a
										data-testid={'project-external-link-' + index}
										href={link.url}
										target={link.external ? '_blank' : undefined}
										rel={link.external ? 'noopener noreferrer' : undefined}
										class="text-base font-semibold text-[#136ef6] hover:text-[#0f5dcc]"
									>
										{link.label}
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				</section>
			</section>
		{/if}
	</main>
</div>
