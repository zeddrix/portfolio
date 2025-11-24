<script lang="ts">
	import LayoutWrapper from '$lib/components/layouts/LayoutWrapper.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.profile?.full_name || 'Zeddrix'} - Portfolio</title>
	<meta
		name="description"
		content={data.profile?.tagline || 'Portfolio website of Zeddrix - Full Stack Developer'}
	/>
</svelte:head>

<LayoutWrapper
	profile={data.profile}
	projects={data.projects}
	skills={data.skills}
	certifications={data.certifications}
	experiences={data.experiences}
	socialLinks={data.socialLinks}
/>
