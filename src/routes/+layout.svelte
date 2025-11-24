<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { theme } from '$lib/stores/theme';
	import { palette } from '$lib/stores/palette';
	import '../app.css';

	export let data;

	// Initialize auth store with session from server
	$: if (data.session) {
		auth.setSession(data.session);
	}

	// Initialize on mount
	onMount(() => {
		auth.initialize();
		theme.initialize();
		palette.initialize();
	});
</script>

<slot />
