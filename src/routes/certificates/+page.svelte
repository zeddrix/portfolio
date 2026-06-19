<script>
	import SeoHead from '$lib/components/SeoHead.svelte';
	import {
		certificates,
		formatCertificateDate,
		buildCertificatePath
	} from '$lib/data/certificates';
	import {
		buildCertificatesIndexJsonLd,
		certificatesIndexSeo,
		serializeJsonLd
	} from '$lib/data/seo';
	import { appPath } from '$lib/utils/app-path';

	const certificatesIndexJsonLd = serializeJsonLd(buildCertificatesIndexJsonLd());
</script>

<SeoHead
	title={certificatesIndexSeo.title}
	description={certificatesIndexSeo.description}
	path={certificatesIndexSeo.path}
/>

<svelte:head>
	{@html `<script type="application/ld+json">${certificatesIndexJsonLd}</script>`}
</svelte:head>

<div class="min-h-screen bg-[#f5f5f5] text-zinc-950">
	<main
		id="main"
		data-testid="certificates-index"
		class="mx-auto w-[90%] max-w-[1400px] py-8 sm:py-10 md:py-14"
	>
		<section class="space-y-10">
			<div class="space-y-4">
				<a
					data-testid="certificates-index-back-link"
					href={appPath('/')}
					class="inline-flex text-sm font-semibold text-[#136ef6] hover:text-[#0f5dcc]"
				>
					← Back to homepage
				</a>
				<h1
					data-testid="certificates-index-title"
					class="text-[clamp(2.4rem,calc(0.25rem+4.8vw),4rem)] font-bold leading-[1.1] tracking-[-0.04em] text-black"
				>
					Certifications
				</h1>
				<p class="max-w-3xl text-lg font-medium leading-relaxed text-zinc-600">
					Professional development certificates from Udemy coursework in JavaScript, React, CSS,
					Node.js, and the MERN stack.
				</p>
			</div>

			<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each certificates as certificate (certificate.slug)}
					<a
						data-testid="certificate-card-{certificate.slug}"
						href={appPath(buildCertificatePath(certificate.slug))}
						class="group flex h-full flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
					>
						<p class="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
							{certificate.issuer}
						</p>
						<h2 class="mt-3 text-xl font-bold leading-snug tracking-tight text-zinc-950 group-hover:text-[#136ef6]">
							{certificate.title}
						</h2>
						<p class="mt-2 text-sm font-semibold text-zinc-600">
							{formatCertificateDate(certificate.issuedAt)}
						</p>
						<p class="mt-4 flex-1 text-sm font-medium leading-relaxed text-zinc-600">
							{certificate.summary}
						</p>
						<div
							data-testid="certificate-card-skills-{certificate.slug}"
							class="mt-4 flex flex-wrap gap-1.5"
						>
							{#each certificate.skills.slice(0, 4) as skill (skill)}
								<span
									class="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-600"
								>
									{skill}
								</span>
							{/each}
						</div>
						<p class="mt-5 text-sm font-semibold text-[#136ef6]">View certificate →</p>
					</a>
				{/each}
			</div>
		</section>
	</main>
</div>
