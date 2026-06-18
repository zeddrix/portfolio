<script>
	import BrowserDeviceFrame from '$lib/components/BrowserDeviceFrame.svelte';
	import OptimizedImage from '$lib/components/OptimizedImage.svelte';
	import PhoneDeviceFrame from '$lib/components/PhoneDeviceFrame.svelte';
	import { DEVICE_BLUR_BACKDROP, DEVICE_CARD_GRADIENT } from '$lib/constants/device-frame';

	/** @type {string} */
	export let src;
	/** @type {string} */
	export let alt;
	/** @type {import('$lib/types/portfolio').CapabilitySlideFrame} */
	export let frame;
	/** @type {string | undefined} */
	export let domain = undefined;
	/** @type {number} */
	export let imageIndex = 0;
	/** @type {'eager' | 'lazy'} */
	export let loading = 'lazy';
	/** @type {string} */
	export let sizes = '(max-width: 1024px) 100vw, 600px';
</script>

<div class="relative mx-auto w-full max-w-2xl">
	<div class="relative overflow-hidden rounded-2xl {DEVICE_CARD_GRADIENT} p-3 sm:p-4">
		<div class={DEVICE_BLUR_BACKDROP} aria-hidden="true">
			<OptimizedImage
				src={src}
				alt=""
				className="h-full w-full"
				fit="cover"
				{sizes}
				loading="lazy"
				testId={'capability-band-backdrop-' + imageIndex}
			/>
		</div>

		<div class="relative z-10">
			{#if frame === 'phone'}
				<div class="mx-auto w-full max-w-[280px]">
					<PhoneDeviceFrame domain={domain ?? ''}>
						<OptimizedImage
							{src}
							{alt}
							className="h-full w-full"
							fit="cover"
							preserveNaturalAspect={true}
							{sizes}
							{loading}
							testId={'capability-band-image-' + imageIndex}
						/>
					</PhoneDeviceFrame>
				</div>
			{:else if frame === 'browser'}
				<BrowserDeviceFrame domain={domain ?? ''}>
					<OptimizedImage
						{src}
						{alt}
						className="h-full w-full"
						fit="contain"
						preserveNaturalAspect={true}
						{sizes}
						{loading}
						testId={'capability-band-image-' + imageIndex}
					/>
				</BrowserDeviceFrame>
			{:else}
				<div class="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-black/20">
					<OptimizedImage
						{src}
						{alt}
						className="h-full w-full"
						fit="contain"
						preserveNaturalAspect={true}
						{sizes}
						{loading}
						testId={'capability-band-image-' + imageIndex}
					/>
				</div>
			{/if}
		</div>
	</div>
</div>
