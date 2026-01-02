<script lang="ts">
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
</script>

<svelte:head>
	<title>Deliverables - Admin</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
	<Breadcrumb
		items={[
			{ label: 'Dashboard', href: '/admin' },
			{ label: 'Content', href: '#' },
			{ label: 'Deliverables', href: '/admin/content/deliverables' }
		]}
	/>

	<div class="mb-8">
		<h1 class="text-3xl font-bold text-text-primary mb-2">Deliverables</h1>
		<p class="text-text-secondary">Manage the project deliverables shown on the homepage.</p>
	</div>

	<div class="bg-surface rounded-lg border border-border p-8 text-center">
		<span class="material-icons text-6xl text-text-secondary mb-4">inventory_2</span>
		<h2 class="text-xl font-semibold text-text-primary mb-2">Coming Soon</h2>
		<p class="text-text-secondary">Deliverables management will be available here.</p>
	</div>
</div>
