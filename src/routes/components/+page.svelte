<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Card from '$lib/components/Card.svelte';
	import Grid from '$lib/components/Grid.svelte';
	import Button from '$lib/components/Button.svelte';

	const categories = [
		{
			title: 'Foundation',
			description: 'Basic building blocks for layouts and interactions',
			href: '/components/foundation',
			components: ['Button', 'Card', 'Container', 'Grid'],
			color: 'bg-primary-100 text-primary-700'
		},
		{
			title: 'Navigation',
			description: 'Components for site navigation and menu systems',
			href: '/components/navigation',
			components: ['Header', 'Nav', 'MobileMenu'],
			color: 'bg-success-100 text-successDark'
		},
		{
			title: 'Content',
			description: 'Versatile components for creating engaging content sections',
			href: '/components/content',
			components: ['Hero', 'Section', 'Feature', 'Carousel'],
			color: 'bg-warning-100 text-warningDark'
		},
		{
			title: 'Forms',
			description: 'Form inputs with validation states and accessibility',
			href: '/components/forms',
			components: ['Input', 'Textarea', 'Select', 'Checkbox', 'Form'],
			color: 'bg-info-100 text-infoDark'
		},
		{
			title: 'Feedback',
			description: 'Components for user feedback and loading states',
			href: '/components/feedback',
			components: ['Modal', 'Toast', 'Loading'],
			color: 'bg-error-100 text-errorDark'
		}
	];
</script>

<svelte:head>
	<title>Component Showcase</title>
</svelte:head>

<Container maxWidth="2xl">
	<div class="py-12 space-y-12">
		<!-- Header -->
		<div class="text-center space-y-4">
			<h1 class="text-5xl font-bold text-neutral-900">Component Library</h1>
			<p class="text-xl text-neutral-600 max-w-2xl mx-auto">
				A comprehensive collection of reusable UI components built with SvelteKit, TypeScript, and
				Tailwind CSS
			</p>
		</div>

		<!-- Stats -->
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
			<Card padding="medium" shadow="sm" border>
				<div class="text-center">
					<div class="text-4xl font-bold text-primary-600">20</div>
					<div class="text-sm text-neutral-600 mt-1">Components</div>
				</div>
			</Card>
			<Card padding="medium" shadow="sm" border>
				<div class="text-center">
					<div class="text-4xl font-bold text-primary-600">5</div>
					<div class="text-sm text-neutral-600 mt-1">Categories</div>
				</div>
			</Card>
			<Card padding="medium" shadow="sm" border>
				<div class="text-center">
					<div class="text-4xl font-bold text-primary-600">100%</div>
					<div class="text-sm text-neutral-600 mt-1">Typed</div>
				</div>
			</Card>
			<Card padding="medium" shadow="sm" border>
				<div class="text-center">
					<div class="text-4xl font-bold text-primary-600">A11y</div>
					<div class="text-sm text-neutral-600 mt-1">Accessible</div>
				</div>
			</Card>
		</div>

		<!-- Component Categories -->
		<section class="space-y-6">
			<h2 class="text-3xl font-bold text-neutral-900">Browse Components</h2>

			<Grid cols={1} md={2} gap="relaxed">
				{#each categories as category}
					<a href={category.href} class="block">
						<Card hover clickable shadow="md">
							<div class="space-y-4">
								<div class="flex items-start justify-between">
									<div class="flex-1">
										<h3 class="text-2xl font-semibold text-neutral-900 mb-2">
											{category.title}
										</h3>
										<p class="text-neutral-600">
											{category.description}
										</p>
									</div>
									<div class="flex-shrink-0 ml-4">
										<div class="{category.color} px-3 py-1 rounded-full text-sm font-semibold">
											{category.components.length}
										</div>
									</div>
								</div>

								<div class="flex flex-wrap gap-2">
									{#each category.components as component}
										<span class="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-md text-sm">
											{component}
										</span>
									{/each}
								</div>

								<div class="flex items-center text-primary-600 font-medium">
									View Components
									<svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</div>
							</div>
						</Card>
					</a>
				{/each}
			</Grid>
		</section>

		<!-- Features -->
		<section class="space-y-6">
			<h2 class="text-3xl font-bold text-neutral-900">Features</h2>

			<Grid cols={1} md={3} gap="normal">
				<Card padding="medium" shadow="sm">
					<div class="space-y-3">
						<div class="text-primary-600">
							<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<h3 class="text-xl font-semibold text-neutral-900">TypeScript First</h3>
						<p class="text-neutral-600">
							All components are fully typed with strict TypeScript for better developer experience
						</p>
					</div>
				</Card>

				<Card padding="medium" shadow="sm">
					<div class="space-y-3">
						<div class="text-primary-600">
							<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<h3 class="text-xl font-semibold text-neutral-900">Responsive</h3>
						<p class="text-neutral-600">
							Mobile-first design that works seamlessly across all device sizes
						</p>
					</div>
				</Card>

				<Card padding="medium" shadow="sm">
					<div class="space-y-3">
						<div class="text-primary-600">
							<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
								/>
							</svg>
						</div>
						<h3 class="text-xl font-semibold text-neutral-900">Customizable</h3>
						<p class="text-neutral-600">
							Flexible props and design tokens make it easy to adapt to your brand
						</p>
					</div>
				</Card>
			</Grid>
		</section>

		<!-- CTA -->
		<section class="text-center space-y-6 py-12">
			<h2 class="text-3xl font-bold text-neutral-900">Ready to build?</h2>
			<p class="text-lg text-neutral-600">Start building with our component library today</p>
			<div class="flex flex-wrap gap-4 justify-center">
				<Button size="large" href="/components/foundation">Browse Components</Button>
				<Button variant="outline" size="large" href="/">Back to Home</Button>
			</div>
		</section>
	</div>
</Container>
