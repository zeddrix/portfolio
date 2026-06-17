<script>
	import SeoHead from '$lib/components/SeoHead.svelte';
	import OptimizedImage from '$lib/components/OptimizedImage.svelte';
	import { formatCertificateDate } from '$lib/data/certificates';
	import { buildCertificateMeta, certificatesIndexSeo } from '$lib/data/seo';
	import { appPath } from '$lib/utils/app-path';

	export let data;

	$: pageSeo = data.certificate
		? buildCertificateMeta(data.certificate)
		: {
				title: `Certificate Not Found | Zeddrix Fabian Portfolio`,
				description: certificatesIndexSeo.description,
				path: '/certificates'
			};
</script>

<SeoHead
	title={pageSeo.title}
	description={pageSeo.description}
	path={pageSeo.path}
	ogImage={pageSeo.ogImage}
/>

<div class="min-h-screen bg-[#f5f5f5] text-zinc-950">
	<main class="mx-auto w-[90%] max-w-[1100px] py-8 sm:py-10 md:py-14">
		{#if !data.certificate}
			<section
				data-testid="certificate-not-found"
				class="mx-auto max-w-3xl rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm sm:p-12"
			>
				<h1 class="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
					Certificate not found
				</h1>
				<p class="mt-4 text-lg font-medium text-zinc-600">
					The certificate you are looking for does not exist or has been removed.
				</p>
				<a
					data-testid="certificate-not-found-index-link"
					href={appPath('/certificates')}
					class="mt-8 inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
				>
					Back to certifications
				</a>
			</section>
		{:else}
			<section class="space-y-8" data-testid="certificate-detail">
				<a
					data-testid="certificate-detail-back-link"
					href={appPath('/certificates')}
					class="inline-flex text-sm font-semibold text-[#136ef6] hover:text-[#0f5dcc]"
				>
					← Back to certifications
				</a>

				<div class="space-y-4">
					<p
						data-testid="certificate-detail-issuer"
						class="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-500"
					>
						{data.certificate.issuer}
					</p>
					<h1
						data-testid="certificate-detail-title"
						class="text-[clamp(2rem,calc(0.25rem+4vw),3.25rem)] font-bold leading-[1.12] tracking-[-0.03em] text-black"
					>
						{data.certificate.title}
					</h1>
					<p data-testid="certificate-detail-date" class="text-base font-semibold text-zinc-600">
						Completed {formatCertificateDate(data.certificate.issuedAt)}
						{#if data.certificate.durationLabel}
							· {data.certificate.durationLabel}
						{/if}
					</p>
					<p class="max-w-3xl text-lg font-medium leading-relaxed text-zinc-600">
						{data.certificate.summary}
					</p>
				</div>

				{#if data.certificate.skills.length > 0}
					<div data-testid="certificate-detail-skills" class="flex flex-wrap gap-2">
						{#each data.certificate.skills as skill (skill)}
							<span
								class="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-700"
							>
								{skill}
							</span>
						{/each}
					</div>
				{/if}

				<div
					data-testid="certificate-detail-image"
					class="overflow-hidden rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm sm:p-5"
				>
					<OptimizedImage
						src={data.certificate.imagePath}
						alt="{data.certificate.title} certificate"
						className="mx-auto w-full max-w-[920px]"
						preferredWidth={920}
						loading="eager"
						fetchpriority="high"
						preserveNaturalAspect={true}
						fit="contain"
						testId="certificate-detail-image-frame"
					/>
				</div>

				{#if data.certificate.udemyCredentialId}
					<p class="text-sm font-medium text-zinc-500">
						Credential ID: {data.certificate.udemyCredentialId}
					</p>
				{/if}
			</section>
		{/if}
	</main>
</div>
