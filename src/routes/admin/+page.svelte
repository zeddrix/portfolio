<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	let loading = false;

	async function handleLogout() {
		loading = true;
		try {
			await auth.signOut();
			await goto('/admin/login');
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Dashboard - Zeddrix Portfolio</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<nav class="border-b border-gray-200 bg-white">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 justify-between">
				<div class="flex">
					<div class="flex flex-shrink-0 items-center">
						<h1 class="text-xl font-bold text-gray-900">Admin Panel</h1>
					</div>
				</div>
				<div class="flex items-center">
					{#if $auth.user}
						<span class="mr-4 text-sm text-gray-700">{$auth.user.email}</span>
					{/if}
					<button
						on:click={handleLogout}
						disabled={loading}
						class="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
					>
						{loading ? 'Logging out...' : 'Logout'}
					</button>
				</div>
			</div>
		</div>
	</nav>

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="rounded-lg bg-white p-6 shadow">
			<h2 class="text-2xl font-bold text-gray-900">Welcome to the Admin Dashboard</h2>
			<p class="mt-2 text-gray-600">
				Authentication system is now configured and working! You are successfully logged in.
			</p>

			<div class="mt-6 space-y-4">
				<div class="rounded-md bg-blue-50 p-4">
					<h3 class="text-sm font-medium text-blue-800">Phase 3 Complete</h3>
					<div class="mt-2 text-sm text-blue-700">
						<p>The following authentication features are now available:</p>
						<ul class="mt-2 list-inside list-disc space-y-1">
							<li>Server-side and client-side Supabase clients</li>
							<li>Authentication store for user state management</li>
							<li>Session management utilities</li>
							<li>Protected admin routes with automatic redirects</li>
							<li>Login page with email/password authentication</li>
							<li>Logout functionality</li>
						</ul>
					</div>
				</div>

				{#if $auth.session}
					<div class="rounded-md bg-gray-50 p-4">
						<h3 class="text-sm font-medium text-gray-900">Session Information</h3>
						<div class="mt-2 text-sm text-gray-700">
							<p><strong>User ID:</strong> {$auth.session.user.id}</p>
							<p><strong>Email:</strong> {$auth.session.user.email}</p>
							<p>
								<strong>Logged in at:</strong>
								{new Date($auth.session.user.created_at).toLocaleString()}
							</p>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</main>
</div>
