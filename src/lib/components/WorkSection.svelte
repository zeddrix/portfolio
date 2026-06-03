<script>
	import FeaturedProjectCarousel from '$lib/components/FeaturedProjectCarousel.svelte';
	import WorkFeaturedGrid from '$lib/components/WorkFeaturedGrid.svelte';
	import WorkCaseStudyLayout from '$lib/components/WorkCaseStudyLayout.svelte';

	export let workLayoutMode = 'featuredGrid';

	const sectionHeadingClass =
		'text-[clamp(2.6rem,calc(0.25rem+5vw),4.5rem)] font-bold leading-[1.15] tracking-[-0.04em] text-[#111111]';
</script>

<section
	id="work"
	data-testid="work-section"
	class="pb-16 sm:pb-24 md:pb-28"
>
	<div class="mx-auto mb-10 w-[90%] max-w-[1400px] space-y-3">
		<h2 class={sectionHeadingClass}>Selected work</h2>
		<p class="max-w-[52ch] text-lg font-medium leading-relaxed text-zinc-600">
			Featured products and client engagements with accurate context on role, status, and delivery scope.
		</p>
	</div>

	<FeaturedProjectCarousel />

	<div class="mx-auto mt-14 w-[90%] max-w-[1400px]">
		{#if workLayoutMode === 'caseStudyLed'}
			<WorkCaseStudyLayout />
		{:else}
			<WorkFeaturedGrid />
		{/if}
	</div>
</section>
