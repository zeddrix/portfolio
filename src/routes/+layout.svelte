<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import '../app.css';

	export let data;

	// Initialize auth store with session from server
	$: if (data.session) {
		auth.setSession(data.session);
	}

	// Apply theme and palette attributes to HTML element
	function applyThemeAttributes() {
		if (typeof document !== 'undefined') {
			const html = document.documentElement;

			// Set default theme (dark mode)
			html.setAttribute('data-theme', 'dark');

			// Set default palette (cyber_blue)
			html.setAttribute('data-palette', 'cyber_blue');
		}
	}

	// Initialize on mount
	onMount(() => {
		auth.initialize();
		applyThemeAttributes();
	});
</script>

<slot />
