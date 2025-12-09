<script lang="ts">
	import type { ProjectDeliverable } from '$lib/types/database';

	export let deliverables: ProjectDeliverable[] = [];

	// Icon mapping for deliverables
	const iconMap: Record<string, string> = {
		'code-bracket': 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
		'document-text':
			'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
		'cloud-arrow-up':
			'M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z',
		'wrench-screwdriver':
			'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z'
	};

	function getIcon(iconName: string | null): string {
		return iconMap[iconName || 'code-bracket'] || iconMap['code-bracket'];
	}
</script>

<section id="deliverables" class="py-20 bg-surface">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div class="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
			<div>
				<h2 class="text-3xl sm:text-4xl font-bold text-text-primary">
					Everything you need<br />on one platform
				</h2>
			</div>
			<p class="mt-4 lg:mt-0 text-lg text-text-secondary max-w-md">
				Complete solutions with all the deliverables you need for a successful project.
			</p>
		</div>

		<!-- Cards Grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each deliverables as deliverable, index}
				<div
					class="group relative bg-background rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
					style="animation-delay: {index * 100}ms"
				>
					<!-- Icon -->
					<div
						class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
					>
						<svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d={getIcon(deliverable.icon)}
							/>
						</svg>
					</div>

					<!-- Content -->
					<h3 class="text-xl font-semibold text-text-primary mb-2">{deliverable.title}</h3>
					<p class="text-text-secondary">{deliverable.description}</p>

					<!-- Arrow -->
					<div
						class="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
					>
						<svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 8l4 4m0 0l-4 4m4-4H3"
							/>
						</svg>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
