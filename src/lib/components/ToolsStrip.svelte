<script>
	import { pageShellClass } from '$lib/constants/layout';
	import { toolStripGroups } from '$lib/data/portfolio';

	const sectionHeadingClass =
		'text-[clamp(2.6rem,calc(0.25rem+5vw),4.5rem)] font-bold leading-[1.15] tracking-[-0.04em] text-[#111111]';
</script>

<section data-testid="tools-strip-section" class="{pageShellClass} pt-12 pb-8 sm:pt-16 sm:pb-10">
	<div
		class="rounded-3xl border border-zinc-200 bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-12"
	>
		<div class="space-y-3">
			<h2 class={sectionHeadingClass}>Tools and stack</h2>
			<p class="max-w-[52ch] text-lg font-medium leading-relaxed text-zinc-600">
				Frameworks, platforms, and AI tooling I use to ship maintainable products quickly.
			</p>
		</div>
		<div class="mt-8 grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-2 md:gap-y-8">
			{#each toolStripGroups as group (group.id)}
				<div data-testid={'tool-group-' + group.id}>
					<h3 class="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-500">
						{group.title}
					</h3>
					<div class="mt-2.5 flex flex-wrap gap-2">
						{#each group.items as tool (tool.id)}
							<span
								data-testid={'tool-chip-' + tool.id}
								class="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-semibold text-zinc-700"
							>
								{tool.label}
							</span>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
