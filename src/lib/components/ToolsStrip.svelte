<script>
	import { toolStripItems } from '$lib/data/portfolio';

	const sectionHeadingClass =
		'text-[clamp(2.6rem,calc(0.25rem+5vw),4.5rem)] font-bold leading-[1.15] tracking-[-0.04em] text-[#111111]';
</script>

<section data-testid="tools-strip-section" class="mx-auto w-[90%] max-w-[1400px] py-16 sm:py-20">
	<div class="space-y-3">
		<h2 class={sectionHeadingClass}>Tools and stack</h2>
		<p class="max-w-[52ch] text-lg font-medium leading-relaxed text-zinc-600">
			Frameworks, platforms, and AI tooling I use to ship maintainable products quickly.
		</p>
	</div>
	<div class="mt-8 flex flex-wrap gap-2.5">
		{#each toolStripItems as tool (tool.id)}
			<span
				data-testid={'tool-chip-' + tool.id}
				class="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm"
			>
				{tool.label}
			</span>
		{/each}
	</div>
</section>
