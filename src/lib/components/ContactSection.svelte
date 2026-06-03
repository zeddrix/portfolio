<script>
	import { profile } from '$lib/data/portfolio';

	const sectionHeadingClass =
		'text-[clamp(2.6rem,calc(0.25rem+5vw),4.5rem)] font-bold leading-[1.15] tracking-[-0.04em] text-[#111111]';
</script>

<section
	id="contact"
	data-testid="contact-section"
	class="mx-auto w-[90%] max-w-[1400px] py-16 sm:py-20"
>
	<div class="rounded-3xl border border-zinc-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
		<h2 class={sectionHeadingClass}>Let&apos;s work together</h2>
		<p class="mx-auto mt-4 max-w-[42ch] text-lg font-medium leading-relaxed text-zinc-600">
			Open to product engineering work, client collaborations, and interesting product ideas.
		</p>
		<a
			data-testid="contact-cta"
			href={'mailto:' + profile.contactEmail}
			class="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-full bg-black px-8 py-3.5 text-lg font-semibold text-white transition-opacity hover:opacity-90"
		>
			{profile.contactEmail}
		</a>
	</div>
</section>
