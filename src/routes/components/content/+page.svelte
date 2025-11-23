<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Section from '$lib/components/Section.svelte';
	import Feature from '$lib/components/Feature.svelte';
	import Carousel from '$lib/components/Carousel.svelte';
	import Container from '$lib/components/Container.svelte';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';
	import Grid from '$lib/components/Grid.svelte';

	const carouselItems = [
		{ id: 1, title: 'Slide 1', color: 'bg-primary-100' },
		{ id: 2, title: 'Slide 2', color: 'bg-primary-200' },
		{ id: 3, title: 'Slide 3', color: 'bg-primary-300' }
	];
</script>

<div class="space-y-0">
	<!-- Hero Component -->
	<Hero
		title="Content Components"
		subtitle="Versatile components for creating engaging content sections"
		background="gradient"
		alignment="center"
	>
		<div slot="cta">
			<Button variant="secondary">Learn More</Button>
		</div>
	</Hero>

	<Container maxWidth="2xl">
		<div class="py-12 space-y-12">
			<!-- Hero Variants -->
			<section class="space-y-6">
				<div>
					<h2 class="text-2xl font-semibold text-neutral-900 mb-2">Hero Variants</h2>
					<p class="text-neutral-600">Different background and alignment options</p>
				</div>

				<Card>
					<div slot="header" class="font-semibold">Hero Sizes</div>
					<ul class="list-disc list-inside space-y-2 text-neutral-600">
						<li>Small (400px min height)</li>
						<li>Medium (500px min height)</li>
						<li>Large (600px min height)</li>
						<li>Full screen</li>
					</ul>
				</Card>
			</section>

			<!-- Section Component -->
			<section class="space-y-6">
				<div>
					<h2 class="text-2xl font-semibold text-neutral-900 mb-2">Section</h2>
					<p class="text-neutral-600">Semantic section wrapper with consistent spacing</p>
				</div>

				<Card>
					<div slot="header" class="font-semibold">Section Examples</div>
					<div class="space-y-4">
						<Section background="white" padding="small" contained={false}>
							<div class="px-6">
								<p class="text-neutral-600">White background with small padding</p>
							</div>
						</Section>
						<Section background="gray" padding="medium" contained={false}>
							<div class="px-6">
								<p class="text-neutral-600">Gray background with medium padding</p>
							</div>
						</Section>
						<Section background="dark" padding="small" contained={false}>
							<div class="px-6">
								<p class="text-white">Dark background with small padding</p>
							</div>
						</Section>
					</div>
				</Card>
			</section>

			<!-- Feature Component -->
			<section class="space-y-6">
				<div>
					<h2 class="text-2xl font-semibold text-neutral-900 mb-2">Feature</h2>
					<p class="text-neutral-600">Feature cards with icons and descriptions</p>
				</div>

				<Card>
					<div slot="header" class="font-semibold">Vertical Layout</div>
					<Grid cols={1} md={3} gap="normal">
						<Feature
							title="Fast Performance"
							description="Optimized for speed and efficiency"
							layout="vertical"
						>
							<div slot="icon">
								<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
						</Feature>

						<Feature
							title="Responsive Design"
							description="Works seamlessly on all devices"
							layout="vertical"
						>
							<div slot="icon">
								<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
									/>
								</svg>
							</div>
						</Feature>

						<Feature
							title="Easy to Use"
							description="Simple and intuitive interface"
							layout="vertical"
						>
							<div slot="icon">
								<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
									/>
								</svg>
							</div>
						</Feature>
					</Grid>
				</Card>

				<Card>
					<div slot="header" class="font-semibold">Horizontal Layout</div>
					<div class="space-y-4">
						<Feature
							title="Modern Technology"
							description="Built with the latest web technologies for optimal performance"
							layout="horizontal"
						>
							<div slot="icon">
								<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
									/>
								</svg>
							</div>
						</Feature>
					</div>
				</Card>
			</section>

			<!-- Carousel Component -->
			<section class="space-y-6">
				<div>
					<h2 class="text-2xl font-semibold text-neutral-900 mb-2">Carousel</h2>
					<p class="text-neutral-600">Image carousel with navigation and autoplay</p>
				</div>

				<Card>
					<div slot="header" class="font-semibold">Carousel Demo</div>
					<Carousel items={carouselItems} autoplay interval={3000} let:item>
						<div class="h-64 {item.color} rounded-lg flex items-center justify-center">
							<h3 class="text-3xl font-bold text-primary-900">{item.title}</h3>
						</div>
					</Carousel>
				</Card>
			</section>
		</div>
	</Container>
</div>
