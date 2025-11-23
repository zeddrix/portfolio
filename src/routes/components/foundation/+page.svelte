<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import Container from '$lib/components/Container.svelte';
	import Grid from '$lib/components/Grid.svelte';
</script>

<Container maxWidth="2xl">
	<div class="py-12 space-y-12">
		<div>
			<h1 class="text-4xl font-bold text-neutral-900 mb-2">Foundation Components</h1>
			<p class="text-lg text-neutral-600">Basic building blocks for layouts and interactions</p>
		</div>

		<!-- Button Component -->
		<section class="space-y-6">
			<div>
				<h2 class="text-2xl font-semibold text-neutral-900 mb-2">Button</h2>
				<p class="text-neutral-600">Versatile button component with multiple variants and sizes</p>
			</div>

			<Card>
				<div slot="header" class="text-lg font-medium">Variants</div>
				<div class="flex flex-wrap gap-4">
					<Button variant="primary">Primary</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="ghost">Ghost</Button>
				</div>
			</Card>

			<Card>
				<div slot="header" class="text-lg font-medium">Sizes</div>
				<div class="flex flex-wrap items-center gap-4">
					<Button size="small">Small</Button>
					<Button size="medium">Medium</Button>
					<Button size="large">Large</Button>
				</div>
			</Card>

			<Card>
				<div slot="header" class="text-lg font-medium">States</div>
				<div class="flex flex-wrap gap-4">
					<Button disabled>Disabled</Button>
					<Button loading>Loading</Button>
					<Button fullWidth>Full Width</Button>
				</div>
			</Card>
		</section>

		<!-- Card Component -->
		<section class="space-y-6">
			<div>
				<h2 class="text-2xl font-semibold text-neutral-900 mb-2">Card</h2>
				<p class="text-neutral-600">Flexible card container with customizable styling</p>
			</div>

			<Grid cols={1} md={2} gap="normal">
				<Card shadow="sm">
					<div slot="header" class="font-semibold">Card with Header</div>
					<p class="text-neutral-600">This is a card with header, body, and footer sections.</p>
					<div slot="footer" class="text-sm text-neutral-500">Footer content</div>
				</Card>

				<Card shadow="md" border>
					<div slot="header" class="font-semibold">Card with Border</div>
					<p class="text-neutral-600">This card has a border and medium shadow.</p>
				</Card>

				<Card shadow="lg" hover clickable>
					<div slot="header" class="font-semibold">Hoverable Card</div>
					<p class="text-neutral-600">Hover over this card to see the effect.</p>
				</Card>

				<Card padding="large" shadow="xl">
					<div slot="header" class="font-semibold">Large Padding</div>
					<p class="text-neutral-600">This card has extra large padding.</p>
				</Card>
			</Grid>
		</section>

		<!-- Container & Grid -->
		<section class="space-y-6">
			<div>
				<h2 class="text-2xl font-semibold text-neutral-900 mb-2">Container & Grid</h2>
				<p class="text-neutral-600">Layout components for responsive designs</p>
			</div>

			<Card>
				<div slot="header" class="font-semibold">Responsive Grid</div>
				<Grid cols={1} sm={2} md={3} lg={4} gap="normal">
					{#each Array(8) as _, i}
						<div class="bg-primary-100 text-primary-700 p-4 rounded-lg text-center font-medium">
							Item {i + 1}
						</div>
					{/each}
				</Grid>
			</Card>

			<Card>
				<div slot="header" class="font-semibold">Auto-fit Grid</div>
				<Grid autoFit minItemWidth="200px" gap="normal">
					{#each Array(6) as _, i}
						<div class="bg-neutral-100 text-neutral-700 p-4 rounded-lg text-center font-medium">
							Auto {i + 1}
						</div>
					{/each}
				</Grid>
			</Card>
		</section>
	</div>
</Container>
