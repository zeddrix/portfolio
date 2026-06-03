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

<svelte:head>
	<meta name="robots" content="index, follow" />
	{@html `<script type="application/ld+json">${personJsonLd}</script>`}
	{@html `<script type="application/ld+json">${websiteJsonLd}</script>`}
</svelte:head>

<slot />
