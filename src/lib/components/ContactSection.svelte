<script>
	import { profile } from '$lib/data/portfolio';

	const sectionHeadingClass =
		'text-[clamp(2.6rem,calc(0.25rem+5vw),4.5rem)] font-bold leading-[1.15] tracking-[-0.04em] text-[#111111]';
</script>

<section
	id="contact"
	data-testid="contact-section"
	class="mx-auto w-[90%] max-w-[1400px] shrink-0 py-2 sm:py-4"
>
	<div
		data-testid="contact-section-card"
		class="flex min-h-0 flex-col items-center justify-center rounded-[2rem] border border-zinc-200 bg-white px-8 py-10 text-center shadow-sm sm:px-12 sm:py-14"
	>
		<h2 class={sectionHeadingClass}>Let&apos;s work together</h2>
		<p class="mx-auto mt-4 max-w-[42ch] text-lg font-medium leading-relaxed text-zinc-600">
			Open to product engineering work, client collaborations, and interesting product ideas.
		</p>
		<a
			data-testid="contact-cta"
			href={'mailto:' + profile.contactEmail}
			class="mt-10 inline-flex w-fit max-w-full self-center min-h-[52px] items-center justify-center rounded-full bg-black px-8 py-3.5 text-lg font-semibold text-white transition-opacity hover:opacity-90"
		>
			{profile.contactEmail}
		</a>
	</div>
</section>
