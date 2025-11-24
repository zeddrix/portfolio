<script lang="ts">
	import { animate_on_scroll } from '$lib/actions/animate';
	import ProjectCard from '$lib/components/shared/ProjectCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const { project, relatedProjects } = data;
</script>

<svelte:head>
	<title>{project.title} - Zeddrix Portfolio</title>
	<meta name="description" content={project.short_description} />
	<meta property="og:title" content={project.title} />
	<meta property="og:description" content={project.short_description} />
	<meta property="og:image" content={project.featured_image_url} />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="min-h-screen bg-background">
	<!-- Navigation Breadcrumb -->
	<nav
		class="container mx-auto px-4 py-6"
		use:animate_on_scroll={{ type: 'fadeIn' }}
		aria-label="Breadcrumb"
	>
		<ol class="flex items-center space-x-2 text-sm text-text-secondary">
			<li><a href="/" class="hover:text-primary transition-colors">Home</a></li>
			<li><span class="text-border">/</span></li>
			<li><span class="text-text-primary">{project.title}</span></li>
		</ol>
	</nav>

	<!-- Project Header -->
	<header class="container mx-auto px-4 py-12" use:animate_on_scroll={{ type: 'fadeInUp' }}>
		<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4">
			{project.title}
		</h1>
		<p class="text-xl text-text-secondary max-w-3xl mb-8">
			{project.short_description}
		</p>

		<!-- Tech Stack -->
		<div class="flex flex-wrap gap-2 mb-8">
			{#each project.tech_stack as tech}
				<span
					class="px-3 py-1 bg-surface border border-border rounded-full text-sm text-text-primary"
				>
					{tech}
				</span>
			{/each}
		</div>

		<!-- Links -->
		<div class="flex flex-wrap gap-4">
			{#if project.project_url}
				<a
					href={project.project_url}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
				>
					View Live Project
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
						/>
					</svg>
				</a>
			{/if}
			{#if project.github_url}
				<a
					href={project.github_url}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border text-text-primary rounded-lg hover:bg-surface/80 transition-colors"
				>
					View on GitHub
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
						<path
							fill-rule="evenodd"
							d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
							clip-rule="evenodd"
						/>
					</svg>
				</a>
			{/if}
		</div>
	</header>

	<!-- Featured Image -->
	<div
		class="container mx-auto px-4 mb-16"
		use:animate_on_scroll={{ type: 'fadeInUp', delay: 100 }}
	>
		<div class="rounded-xl overflow-hidden border border-border shadow-lg">
			<img src={project.featured_image_url} alt={project.title} class="w-full h-auto" />
		</div>
	</div>

	<!-- Project Details -->
	<div class="container mx-auto px-4 mb-16">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
			<!-- Description -->
			<div use:animate_on_scroll={{ type: 'fadeInUp', delay: 200 }}>
				<h2 class="text-2xl font-bold text-text-primary mb-4">About This Project</h2>
				<div class="prose prose-invert max-w-none text-text-secondary">
					{@html project.full_description}
				</div>
			</div>

			<!-- Challenge & Solution -->
			<div class="space-y-8">
				{#if project.challenge}
					<div use:animate_on_scroll={{ type: 'fadeInUp', delay: 250 }}>
						<h2 class="text-2xl font-bold text-text-primary mb-4">The Challenge</h2>
						<div class="prose prose-invert max-w-none text-text-secondary">
							{@html project.challenge}
						</div>
					</div>
				{/if}

				{#if project.solution}
					<div use:animate_on_scroll={{ type: 'fadeInUp', delay: 300 }}>
						<h2 class="text-2xl font-bold text-text-primary mb-4">The Solution</h2>
						<div class="prose prose-invert max-w-none text-text-secondary">
							{@html project.solution}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Gallery Images -->
	{#if project.gallery_images && project.gallery_images.length > 0}
		<div
			class="container mx-auto px-4 mb-16"
			use:animate_on_scroll={{ type: 'fadeInUp', delay: 350 }}
		>
			<h2 class="text-2xl font-bold text-text-primary mb-8">Gallery</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each project.gallery_images as image}
					<div
						class="rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
					>
						{#if image.media_type === 'video'}
							<video src={image.url} controls class="w-full h-auto">
								<track kind="captions" />
							</video>
						{:else}
							<img src={image.url} alt="{project.title} screenshot" class="w-full h-auto" />
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Metrics -->
	{#if project.metrics}
		<div
			class="container mx-auto px-4 mb-16"
			use:animate_on_scroll={{ type: 'fadeInUp', delay: 400 }}
		>
			<h2 class="text-2xl font-bold text-text-primary mb-8">Impact & Results</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				{#each Object.entries(project.metrics) as [key, value]}
					<div class="bg-surface border border-border rounded-lg p-6 text-center">
						<div class="text-3xl font-bold text-primary mb-2">{value}</div>
						<div class="text-text-secondary capitalize">{key.replace(/_/g, ' ')}</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Related Projects -->
	{#if relatedProjects.length > 0}
		<div
			class="container mx-auto px-4 py-16 border-t border-border"
			use:animate_on_scroll={{ type: 'fadeInUp', delay: 450 }}
		>
			<h2 class="text-2xl font-bold text-text-primary mb-8">More Projects</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each relatedProjects as relatedProject}
					<ProjectCard project={relatedProject} />
				{/each}
			</div>
		</div>
	{/if}

	<!-- Back to Home -->
	<div class="container mx-auto px-4 py-12 text-center">
		<a
			href="/"
			class="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>
			Back to Portfolio
		</a>
	</div>
</div>
