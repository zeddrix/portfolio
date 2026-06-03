<script>
	import { buildAbsoluteUrl, getDefaultOgImageUrl } from '$lib/data/seo';

	/** @type {string} */
	export let title;
	/** @type {string} */
	export let description;
	/** @type {string} */
	export let path = '/';
	/** @type {string | undefined} */
	export let ogImage = undefined;

	$: canonicalUrl = buildAbsoluteUrl(path);
	$: socialImage = ogImage ?? getDefaultOgImageUrl();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={socialImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={socialImage} />
</svelte:head>
