<script lang="ts">
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
</script>

<svelte:head>
	<title>Profile Display - Admin</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
	<Breadcrumb
		items={[
			{ label: 'Dashboard', href: '/admin' },
			{ label: 'Settings', href: '/admin/settings' },
			{ label: 'Profile Display', href: '/admin/settings/profile-display' }
		]}
	/>

	<div class="mb-8">
		<h1 class="text-3xl font-bold text-text-primary mb-2">Profile Display</h1>
		<p class="text-text-secondary">Configure where your profile picture appears on the site.</p>
	</div>

	<div class="bg-surface rounded-lg border border-border p-8 text-center">
		<span class="material-icons text-6xl text-text-secondary mb-4">account_circle</span>
		<h2 class="text-xl font-semibold text-text-primary mb-2">Coming Soon</h2>
		<p class="text-text-secondary">Profile display settings will be available here.</p>
	</div>
</div>
