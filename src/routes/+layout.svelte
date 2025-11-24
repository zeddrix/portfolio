<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import '../app.css';

	export let data;

	// Initialize auth store with session from server
	$: if (data.session) {
		auth.setSession(data.session);
	}

	// Initialize auth on mount
	onMount(() => {
		auth.initialize();
	});
</script>

<slot />
