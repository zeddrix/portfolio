<script>
	import {
		buildAbsoluteUrl,
		DEFAULT_OG_IMAGE_ALT,
		DEFAULT_OG_IMAGE_HEIGHT,
		DEFAULT_OG_IMAGE_WIDTH,
		getDefaultOgImageUrl
	} from '$lib/data/seo';

	/** @type {string} */
	export let title;
	/** @type {string} */
	export let description;
	/** @type {string} */
	export let path = '/';
	/** @type {string | undefined} */
	export let ogImage = undefined;
	/** @type {string} */
	export let robots = 'index, follow';
	/** @type {string} */
	export let siteName = 'Zeddrix Fabian Portfolio';
	/** @type {string} */
	export let locale = 'en_US';
	/** @type {number | undefined} */
	export let ogImageWidth = undefined;
	/** @type {number | undefined} */
	export let ogImageHeight = undefined;
	/** @type {string | undefined} */
	export let ogImageAlt = undefined;

	$: canonicalUrl = buildAbsoluteUrl(path);
	$: socialImage = ogImage ?? getDefaultOgImageUrl();
	$: resolvedOgImageWidth = ogImageWidth ?? DEFAULT_OG_IMAGE_WIDTH;
	$: resolvedOgImageHeight = ogImageHeight ?? DEFAULT_OG_IMAGE_HEIGHT;
	$: resolvedOgImageAlt = ogImageAlt ?? DEFAULT_OG_IMAGE_ALT;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="robots" content={robots} />
	<link rel="canonical" href={canonicalUrl} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content={locale} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={socialImage} />
	<meta property="og:image:width" content={String(resolvedOgImageWidth)} />
	<meta property="og:image:height" content={String(resolvedOgImageHeight)} />
	<meta property="og:image:alt" content={resolvedOgImageAlt} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={socialImage} />
	<meta name="twitter:image:alt" content={resolvedOgImageAlt} />
</svelte:head>
