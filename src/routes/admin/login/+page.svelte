<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let loading = false;
	let error = '';

	async function handleLogin(event: SubmitEvent) {
		event.preventDefault();
		loading = true;
		error = '';

		try {
			const { data, error: signInError } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (signInError) {
				error = signInError.message;
				return;
			}

			if (data.session) {
				// Redirect to admin dashboard
				await goto('/admin');
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred during login';
			console.error('Login error:', err);
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Login - Zeddrix Portfolio</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Admin Login</h2>
			<p class="mt-2 text-center text-sm text-gray-600">Sign in to access the admin panel</p>
		</div>

		<form class="mt-8 space-y-6" on:submit={handleLogin}>
			{#if error}
				<div class="rounded-md bg-red-50 p-4">
					<p class="text-sm text-red-800">{error}</p>
				</div>
			{/if}

			<div class="space-y-4 rounded-md shadow-sm">
				<div>
					<label for="email" class="sr-only">Email address</label>
					<input
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						required
						bind:value={email}
						disabled={loading}
						class="relative block w-full rounded-t-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm sm:leading-6"
						placeholder="Email address"
					/>
				</div>
				<div>
					<label for="password" class="sr-only">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						bind:value={password}
						disabled={loading}
						class="relative block w-full rounded-b-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm sm:leading-6"
						placeholder="Password"
					/>
				</div>
			</div>

			<div>
				<button
					type="submit"
					disabled={loading}
					class="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
				>
					{loading ? 'Signing in...' : 'Sign in'}
				</button>
			</div>
		</form>
	</div>
</div>
