<script lang="ts">
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
</script>

<svelte:head>
	<title>Button Text - Admin</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
	<Breadcrumb
		items={[
			{ label: 'Dashboard', href: '/admin' },
			{ label: 'Settings', href: '/admin/settings' },
			{ label: 'Button Text', href: '/admin/settings/button-text' }
		]}
	/>

	<div class="mb-8">
		<h1 class="text-3xl font-bold text-text-primary mb-2">Button Text</h1>
		<p class="text-text-secondary">Manage button text presets and project categories.</p>
	</div>

	<div class="bg-surface rounded-lg border border-border p-8 text-center">
		<span class="material-icons text-6xl text-text-secondary mb-4">text_fields</span>
		<h2 class="text-xl font-semibold text-text-primary mb-2">Coming Soon</h2>
		<p class="text-text-secondary">Button text management will be available here.</p>
	</div>
</div>
