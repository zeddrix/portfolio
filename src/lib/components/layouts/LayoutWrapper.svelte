<script lang="ts">
	import { fade } from 'svelte/transition';
	import { layoutStore } from '$lib/stores/layout';
	import CaseStudyLayout from './CaseStudyLayout.svelte';
	import SinglePageLayout from './SinglePageLayout.svelte';
	import BentoGridLayout from './BentoGridLayout.svelte';
	import type { LayoutType } from '$lib/types/layout';
	import type { Database } from '$lib/types/database';

	type Profile = Database['public']['Tables']['profile']['Row'];
	type Project = Database['public']['Tables']['projects']['Row'];
	type Skill = Database['public']['Tables']['skills']['Row'];
	type Certification = Database['public']['Tables']['certifications']['Row'];
	type Experience = Database['public']['Tables']['experiences']['Row'];
	type SocialLink = Database['public']['Tables']['social_links']['Row'];

	/**
	 * Data props passed from page load
	 */
	export let profile: Profile | null = null;
	export let projects: Project[] = [];
	export let skills: Skill[] = [];
	export let certifications: Certification[] = [];
	export let experiences: Experience[] = [];
	export let socialLinks: SocialLink[] = [];

	/**
	 * Current active layout
	 */
	let currentLayout: LayoutType;
	layoutStore.subscribe((value) => {
		currentLayout = value;
	});
</script>

<div class="layout-wrapper">
	{#if currentLayout === 'case_study'}
		<div in:fade={{ duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
			<CaseStudyLayout {profile} {projects} {skills} {certifications} {experiences} {socialLinks} />
		</div>
	{:else if currentLayout === 'single_page'}
		<div in:fade={{ duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
			<SinglePageLayout
				{profile}
				{projects}
				{skills}
				{certifications}
				{experiences}
				{socialLinks}
			/>
		</div>
	{:else if currentLayout === 'bento_grid'}
		<div in:fade={{ duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
			<BentoGridLayout {profile} {projects} {skills} {certifications} {experiences} {socialLinks} />
		</div>
	{/if}
</div>

<style>
	.layout-wrapper {
		min-height: 100vh;
		width: 100%;
	}
</style>
