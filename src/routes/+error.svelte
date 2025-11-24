<script lang="ts">
	import { page } from '$app/stores';
	import { animate_on_scroll } from '$lib/actions/animate';
</script>

<svelte:head>
	<title>Error - Zeddrix Portfolio</title>
</svelte:head>

<div class="min-h-screen bg-background flex items-center justify-center px-4">
	<div class="text-center max-w-2xl" use:animate_on_scroll={{ type: 'fadeInUp' }}>
		<!-- Error Code -->
		<h1 class="text-9xl font-bold text-primary mb-4">
			{$page.status}
		</h1>

		<!-- Error Message -->
		<h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">
			{#if $page.status === 404}
				Page Not Found
			{:else if $page.status === 500}
				Server Error
			{:else}
				Oops! Something Went Wrong
			{/if}
		</h2>

		<p class="text-lg text-text-secondary mb-8 max-w-md mx-auto">
			{#if $page.status === 404}
				The page you're looking for doesn't exist. It might have been moved or deleted.
			{:else if $page.status === 500}
				We're experiencing some technical difficulties. Please try again later.
			{:else}
				{$page.error?.message || 'An unexpected error occurred.'}
			{/if}
		</p>

		<!-- Action Buttons -->
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<a
				href="/"
				class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
					/>
				</svg>
				Back to Home
			</a>

			<button
				on:click={() => window.history.back()}
				class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface border border-border text-text-primary rounded-lg hover:bg-surface/80 transition-colors"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Go Back
			</button>
		</div>

		<!-- Decorative Element -->
		<div class="mt-16 opacity-20">
			<svg
				class="w-64 h-64 mx-auto text-primary"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1"
					d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		</div>
	</div>
</div>
