<script lang="ts">
	import LayoutWrapper from '$lib/components/layouts/LayoutWrapper.svelte';
	import SEO from '$lib/components/shared/SEO.svelte';
	import { generateKeywords } from '$lib/utils/seo';
	import type { PageData } from './$types';

	export let data: PageData;

	// Generate keywords from skills and tech stack
	$: keywords = data.skills
		? generateKeywords(
				data.skills.map((s) => s.name),
				['full stack developer', 'web developer', 'software engineer']
			)
		: '';
</script>

<SEO
	title={data.profile?.full_name ? `${data.profile.full_name} - Portfolio` : 'Zeddrix - Portfolio'}
	description={data.profile?.tagline ||
		'Portfolio website of Zeddrix - Full Stack Developer specializing in modern web development'}
	{keywords}
	type="website"
/>

<LayoutWrapper
	profile={data.profile}
	projects={data.projects}
	skills={data.skills}
	certifications={data.certifications}
	experiences={data.experiences}
	socialLinks={data.socialLinks}
/>
