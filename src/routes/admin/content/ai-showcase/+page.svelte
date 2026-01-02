<script lang="ts">
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
</script>

<svelte:head>
	<title>AI Showcase - Admin</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
	<Breadcrumb
		items={[
			{ label: 'Dashboard', href: '/admin' },
			{ label: 'Content', href: '#' },
			{ label: 'AI Showcase', href: '/admin/content/ai-showcase' }
		]}
	/>

	<div class="mb-8">
		<h1 class="text-3xl font-bold text-text-primary mb-2">AI Showcase</h1>
		<p class="text-text-secondary">Manage AI tools and productivity stats shown on the homepage.</p>
	</div>

	<div class="bg-surface rounded-lg border border-border p-8 text-center">
		<span class="material-icons text-6xl text-text-secondary mb-4">smart_toy</span>
		<h2 class="text-xl font-semibold text-text-primary mb-2">Coming Soon</h2>
		<p class="text-text-secondary">AI showcase management will be available here.</p>
	</div>
</div>
