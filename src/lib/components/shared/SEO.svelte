<script lang="ts">
	import { page } from '$app/stores';

	// Props
	export let title: string;
	export let description: string;
	export let keywords: string = '';
	export let image: string = '';
	export let type: 'website' | 'article' = 'website';
	export let article: {
		publishedTime?: string;
		modifiedTime?: string;
		author?: string;
		section?: string;
		tags?: string[];
	} = {};
	export let noindex: boolean = false;
	export let nofollow: boolean = false;
	export let canonicalUrl: string = '';

	// Derived values
	$: siteUrl = $page.url.origin;
	$: currentUrl = canonicalUrl || $page.url.href;
	$: ogImage = image || `${siteUrl}/og-default.png`;
	$: fullTitle = title;

	// Structured data for website
	$: websiteStructuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'Zeddrix Portfolio',
		url: siteUrl,
		description: 'Portfolio website of Zeddrix - Full Stack Developer',
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: `${siteUrl}/search?q={search_term_string}`
			},
			'query-input': 'required name=search_term_string'
		}
	};

	// Structured data for person
	$: personStructuredData = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: 'Zeddrix',
		url: siteUrl,
		jobTitle: 'Full Stack Developer',
		description: description
	};
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{fullTitle}</title>
	<meta name="title" content={fullTitle} />
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}

	<!-- Robots Meta -->
	{#if noindex || nofollow}
		<meta
			name="robots"
			content="{noindex ? 'noindex' : 'index'},{nofollow ? 'nofollow' : 'follow'}"
		/>
	{/if}

	<!-- Canonical URL -->
	<link rel="canonical" href={currentUrl} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={currentUrl} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:site_name" content="Zeddrix Portfolio" />
	<meta property="og:locale" content="en_US" />

	<!-- Article-specific Open Graph tags -->
	{#if type === 'article'}
		{#if article.publishedTime}
			<meta property="article:published_time" content={article.publishedTime} />
		{/if}
		{#if article.modifiedTime}
			<meta property="article:modified_time" content={article.modifiedTime} />
		{/if}
		{#if article.author}
			<meta property="article:author" content={article.author} />
		{/if}
		{#if article.section}
			<meta property="article:section" content={article.section} />
		{/if}
		{#if article.tags}
			{#each article.tags as tag}
				<meta property="article:tag" content={tag} />
			{/each}
		{/if}
	{/if}

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={currentUrl} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:creator" content="@zeddrix" />
	<meta name="twitter:site" content="@zeddrix" />

	<!-- Additional Meta Tags -->
	<meta name="author" content="Zeddrix" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="theme-color" content="#00D9FF" />

	<!-- Structured Data - Website -->
	<!-- svelte-ignore a11y-unknown-aria-attribute -->
	{@html `<script type="application/ld+json">${JSON.stringify(websiteStructuredData)}${'</'}script>`}

	<!-- Structured Data - Person -->
	<!-- svelte-ignore a11y-unknown-aria-attribute -->
	{@html `<script type="application/ld+json">${JSON.stringify(personStructuredData)}${'</'}script>`}
</svelte:head>
