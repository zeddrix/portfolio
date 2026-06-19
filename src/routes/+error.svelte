<script>
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { appPath } from '$lib/utils/app-path';

	export let error;
	export let status;

	$: title =
		status === 404
			? 'Page Not Found | Zeddrix Fabian Portfolio'
			: 'Something Went Wrong | Zeddrix Fabian Portfolio';
	$: description =
		status === 404
			? 'The page you requested could not be found on this portfolio site.'
			: 'An unexpected error occurred while loading this page.';
</script>

<SeoHead {title} {description} path="/" robots="noindex, follow" />

<div class="min-h-screen bg-[#f5f5f5] text-zinc-950">
	<main
		id="main"
		data-testid="error-page"
		class="mx-auto flex w-[90%] max-w-3xl flex-col items-center justify-center py-24 text-center"
	>
		<p class="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-500">{status}</p>
		<h1 class="mt-4 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
			{status === 404 ? 'Page not found' : 'Something went wrong'}
		</h1>
		<p class="mt-4 text-lg font-medium text-zinc-600">{description}</p>
		{#if error?.message}
			<p class="mt-2 text-sm text-zinc-500">{error.message}</p>
		{/if}
		<a
			data-testid="error-home-link"
			href={appPath('/')}
			class="mt-8 inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
		>
			Back to home
		</a>
	</main>
</div>
