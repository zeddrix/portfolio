<script>
	import OptimizedImage from '$lib/components/OptimizedImage.svelte';
	import { DEVICE_CARD_GRADIENT, DEVICE_STAGE_VIGNETTE } from '$lib/constants/device-frame';

	/** @type {string} */
	export let src;
	/** @type {string} */
	export let alt;
	/** @type {number} */
	export let imageIndex = 0;
</script>

<div class={'overflow-hidden rounded-2xl ' + DEVICE_CARD_GRADIENT + ' ' + DEVICE_STAGE_VIGNETTE}>
	<div class="flex items-center justify-center p-4 sm:p-6">
		<OptimizedImage
			{src}
			{alt}
			className="w-full"
			fit="contain"
			sizes="(max-width: 1024px) 100vw, 600px"
			loading="lazy"
			testId={'capability-band-image-' + imageIndex}
		/>
	</div>
</div>
