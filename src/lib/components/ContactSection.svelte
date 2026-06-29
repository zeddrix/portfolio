<script>
	import { pageShellClass } from '$lib/constants/layout';
	import { profile } from '$lib/data/profile';
	import { appPath } from '$lib/utils/app-path';
	import { resolveStaticAsset } from '$lib/utils/static-asset';

	const sectionHeadingClass =
		'text-[clamp(2.2rem,calc(0.25rem+4.5vw),4rem)] font-bold leading-[1.12] tracking-[-0.04em] text-[#111111]';
</script>

<section
	id="contact"
	data-testid="contact-section"
	class="{pageShellClass} shrink-0 py-2 sm:py-4"
>
	<div
		data-testid="contact-section-card"
		class="flex min-h-0 flex-col items-center justify-center rounded-[2rem] border border-zinc-200 bg-white px-6 py-8 text-center shadow-sm sm:px-12 sm:py-14"
	>
		<h2 class={sectionHeadingClass}>Let&apos;s work together</h2>
		<p class="mx-auto mt-4 max-w-[42ch] text-base font-medium leading-relaxed text-zinc-600 sm:text-lg">
			Open to product engineering work, client collaborations, and interesting product ideas.
		</p>
		<a
			data-testid="contact-cta"
			href={'mailto:' + profile.contactEmail}
			class="mt-8 inline-flex w-fit max-w-full self-center min-h-[52px] items-center justify-center rounded-full bg-black px-8 py-3.5 text-lg font-semibold text-white transition-opacity hover:opacity-90"
		>
			{profile.contactEmail}
		</a>
		<div class="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
			<a
				data-testid="contact-resume-link"
				href={resolveStaticAsset(profile.resumeDownloadPath)}
				download
				class="inline-flex text-sm font-semibold text-[#136ef6] transition-colors hover:text-[#0f5dcc]"
			>
				Download resume (PDF)
			</a>
			<a
				data-testid="contact-certifications-link"
				href={appPath('/certificates')}
				class="hidden text-sm font-semibold text-[#136ef6] transition-colors hover:text-[#0f5dcc] sm:inline-flex"
			>
				View certifications →
			</a>
		</div>
	</div>
</section>
