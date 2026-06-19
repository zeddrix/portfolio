<script lang="ts">
	import '../app.css';
	import {
		buildPersonJsonLd,
		buildWebsiteJsonLd,
		serializeJsonLd
	} from '$lib/data/seo';

	const personJsonLd = serializeJsonLd(buildPersonJsonLd());
	const websiteJsonLd = serializeJsonLd(buildWebsiteJsonLd());
</script>

<a
	href="#main"
	class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-black focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
>
	Skip to main content
</a>

<svelte:head>
	{@html `<script type="application/ld+json">${personJsonLd}</script>`}
	{@html `<script type="application/ld+json">${websiteJsonLd}</script>`}
</svelte:head>

<slot />
