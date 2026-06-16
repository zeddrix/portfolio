<script>
	import { onMount, tick } from 'svelte';
	import {
		buildSrcSet,
		getDefaultImageSrc,
		getImageDimensions,
		getImageLqip,
		toLogicalImagePath
	} from '$lib/utils/optimized-image';

	/** @type {string} */
	export let src;
	/** @type {string} */
	export let alt;
	/** @type {'lazy' | 'eager'} */
	export let loading = 'lazy';
	/** @type {'high' | 'low' | 'auto' | ''} */
	export let fetchpriority = '';
	/** @type {string} */
	export let sizes = '(max-width: 640px) 88vw, 920px';
	/** @type {string} */
	export let className = '';
	/** @type {string} */
	export let testId = '';
	/** @type {number} */
	export let preferredWidth = 920;
	/** @type {boolean} */
	export let fadeOnMount = false;
	/** @type {'cover' | 'contain'} */
	export let fit = 'cover';
	/** @type {boolean} */
	export let preserveNaturalAspect = false;

	/** @type {'lqip' | 'loaded'} */
	let imageState = 'lqip';
	/** @type {HTMLImageElement | null} */
	let imgElement = null;

	function handleLoad() {
		imageState = 'loaded';
	}

	onMount(async () => {
		await tick();
		if (imgElement?.complete && imgElement.naturalWidth > 0) {
			imageState = 'loaded';
		}
	});

	$: logicalPath = toLogicalImagePath(src);
	$: resolvedSrc = getDefaultImageSrc(logicalPath, preferredWidth);
	$: srcSet = buildSrcSet(logicalPath);
	$: dimensions = getImageDimensions(logicalPath);
	$: lqip = getImageLqip(logicalPath);
	$: aspectRatio =
		!preserveNaturalAspect && dimensions && dimensions.width > 0
			? `${dimensions.width} / ${dimensions.height}`
			: undefined;
	$: imageOpacity = imageState === 'loaded' ? '1' : '0';
	$: transitionClass =
		fadeOnMount && imageState === 'loaded'
			? 'transition-opacity duration-200 motion-reduce:transition-none'
			: 'motion-reduce:transition-none';
	$: wrapperStyle = lqip
		? `background-image:url(${lqip});background-size:cover;background-position:center;`
		: '';
	$: imageClass =
		preserveNaturalAspect
			? 'max-h-full max-w-full ' + transitionClass + ' ' +
				(fit === 'contain' ? 'object-contain' : 'object-cover')
			: 'h-full w-full ' + transitionClass + ' ' +
				(fit === 'contain' ? 'object-contain' : 'object-cover');
	$: wrapperClass =
		'optimized-image relative overflow-hidden ' +
		(preserveNaturalAspect ? 'flex h-full w-full items-center justify-center ' : 'w-full ') +
		className;
</script>

<div
	class={wrapperClass}
	style={aspectRatio ? `aspect-ratio:${aspectRatio};${wrapperStyle}` : wrapperStyle}
	data-testid={testId || undefined}
	data-image-state={imageState}
>
	<img
		bind:this={imgElement}
		src={resolvedSrc}
		srcset={srcSet}
		{sizes}
		{alt}
		{loading}
		fetchpriority={fetchpriority || undefined}
		decoding="async"
		width={dimensions?.width}
		height={dimensions?.height}
		class={imageClass}
		style={`opacity:${imageOpacity};`}
		on:load={handleLoad}
	/>
</div>
