<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Theme } from '$lib/stores/theme';

	export let currentTheme: Theme;

	const themes = [
		{
			value: 'dark' as Theme,
			name: 'Dark Mode',
			description: 'Dark background with light text - easier on the eyes',
			icon: 'dark_mode'
		},
		{
			value: 'light' as Theme,
			name: 'Light Mode',
			description: 'Light background with dark text - classic appearance',
			icon: 'light_mode'
		}
	];

	let selectedTheme: Theme = currentTheme;
	let isSubmitting = false;

	function handleThemeClick(theme: Theme) {
		if (theme === currentTheme) return;
		selectedTheme = theme;
		submitForm();
	}

	function submitForm() {
		isSubmitting = true;
		const form = document.getElementById('theme-form') as HTMLFormElement;
		if (form) {
			form.requestSubmit();
		}
	}
</script>

<div class="space-y-4">
	<div>
		<h3 class="text-lg font-semibold text-text-primary mb-2">Default Theme Mode</h3>
		<p class="text-sm text-text-secondary mb-4">
			This sets the default theme (dark or light) for new visitors. Visitors can toggle the theme
			themselves.
		</p>
	</div>

	<form id="theme-form" method="POST" action="?/updateTheme" use:enhance>
		<input type="hidden" name="theme" value={selectedTheme} />
	</form>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		{#each themes as theme}
			<button
				type="button"
				on:click={() => handleThemeClick(theme.value)}
				disabled={isSubmitting}
				class="relative p-6 rounded-lg border-2 transition-all duration-200 text-left
					{currentTheme === theme.value
					? 'border-primary bg-primary/10'
					: 'border-border bg-surface hover:border-primary/50'}
					{isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
				"
			>
				<div class="flex items-start gap-4">
					<span class="material-icons text-4xl text-primary">
						{theme.icon}
					</span>
					<div class="flex-1">
						<h4 class="font-semibold text-text-primary mb-1">{theme.name}</h4>
						<p class="text-sm text-text-secondary">{theme.description}</p>
					</div>
				</div>

				{#if currentTheme === theme.value}
					<div
						class="absolute top-2 right-2 bg-primary text-background px-2 py-1 rounded text-xs font-medium"
					>
						Current
					</div>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Theme Preview -->
	<div class="mt-6 p-6 rounded-lg border border-border bg-surface">
		<h4 class="text-sm font-semibold text-text-primary mb-3">Theme Preview</h4>
		<p class="text-xs text-text-secondary mb-4">
			Current theme: <strong class="text-text-primary capitalize">{currentTheme}</strong>
		</p>

		<div class="grid grid-cols-2 gap-4">
			<!-- Dark mode preview -->
			<div
				class="p-4 rounded border border-border"
				style="background-color: #0A0E27; color: #E0E7FF;"
			>
				<div class="text-xs font-medium mb-2" style="color: #00D9FF;">Dark Mode</div>
				<div class="text-xs opacity-75">Sample text in dark theme</div>
			</div>

			<!-- Light mode preview -->
			<div
				class="p-4 rounded border border-border"
				style="background-color: #F8FAFC; color: #1E293B;"
			>
				<div class="text-xs font-medium mb-2" style="color: #0891B2;">Light Mode</div>
				<div class="text-xs opacity-75">Sample text in light theme</div>
			</div>
		</div>
	</div>
</div>
