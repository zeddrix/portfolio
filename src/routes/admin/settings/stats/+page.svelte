<script lang="ts">
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
</script>

<svelte:head>
	<title>Stats Section - Admin</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
	<Breadcrumb
		items={[
			{ label: 'Dashboard', href: '/admin' },
			{ label: 'Settings', href: '/admin/settings' },
			{ label: 'Stats Section', href: '/admin/settings/stats' }
		]}
	/>

	<div class="mb-8">
		<h1 class="text-3xl font-bold text-text-primary mb-2">Stats Section</h1>
		<p class="text-text-secondary">Manage your stats counters and display settings.</p>
	</div>

	<div class="bg-surface rounded-lg border border-border p-8 text-center">
		<span class="material-icons text-6xl text-text-secondary mb-4">bar_chart</span>
		<h2 class="text-xl font-semibold text-text-primary mb-2">Coming Soon</h2>
		<p class="text-text-secondary">Stats section settings will be available here.</p>
	</div>
</div>
