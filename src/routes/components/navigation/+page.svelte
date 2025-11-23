<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import MobileMenu from '$lib/components/MobileMenu.svelte';
	import Container from '$lib/components/Container.svelte';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';

	let mobileMenuOpen = false;

	const navItems = [
		{ label: 'Home', href: '/' },
		{ label: 'About', href: '/about' },
		{ label: 'Projects', href: '/projects', active: true },
		{ label: 'Contact', href: '/contact' }
	];
</script>

<Container maxWidth="2xl">
	<div class="py-12 space-y-12">
		<div>
			<h1 class="text-4xl font-bold text-neutral-900 mb-2">Navigation Components</h1>
			<p class="text-lg text-neutral-600">Components for site navigation and menu systems</p>
		</div>

		<!-- Nav Component -->
		<section class="space-y-6">
			<div>
				<h2 class="text-2xl font-semibold text-neutral-900 mb-2">Nav</h2>
				<p class="text-neutral-600">Horizontal navigation menu with active state</p>
			</div>

			<Card>
				<div slot="header" class="font-semibold">Desktop Navigation</div>
				<Nav items={navItems} activeRoute="/projects" />
			</Card>
		</section>

		<!-- Mobile Menu Component -->
		<section class="space-y-6">
			<div>
				<h2 class="text-2xl font-semibold text-neutral-900 mb-2">Mobile Menu</h2>
				<p class="text-neutral-600">Slide-in mobile menu with backdrop overlay</p>
			</div>

			<Card>
				<div slot="header" class="font-semibold">Mobile Menu Demo</div>
				<Button on:click={() => (mobileMenuOpen = true)}>Open Mobile Menu</Button>
			</Card>
		</section>

		<!-- Header Component -->
		<section class="space-y-6">
			<div>
				<h2 class="text-2xl font-semibold text-neutral-900 mb-2">Header</h2>
				<p class="text-neutral-600">
					Fixed header with scroll behavior (see the actual header at the top of this page)
				</p>
			</div>

			<Card>
				<div slot="header" class="font-semibold">Header Features</div>
				<ul class="list-disc list-inside space-y-2 text-neutral-600">
					<li>Sticky positioning</li>
					<li>Background blur on scroll</li>
					<li>Shadow transition</li>
					<li>Responsive logo and navigation slots</li>
					<li>Mobile menu toggle integration</li>
				</ul>
			</Card>
		</section>
	</div>
</Container>

<MobileMenu bind:open={mobileMenuOpen} items={navItems} />
