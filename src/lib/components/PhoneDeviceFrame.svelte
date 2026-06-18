<script>
	import {
		getManatalPhoneScreenMobileConstraintCss,
		getManatalPhoneScreenWidthCss,
		MANATAL_PHONE_SCREEN_ASPECT_CSS,
		MANATAL_PHONE_SCREEN_MAX_HEIGHT_CSS,
		MANATAL_PHONE_SCREEN_MAX_HEIGHT_MOBILE_CSS,
	} from '$lib/constants/carousel';

	/** @type {string} */
	export let domain = '';
	/** @type {boolean} */
	export let showDomain = true;
	/** @type {boolean} */
	export let hideDomainOnMobile = false;
	/** @type {boolean} */
	export let carouselMobileLayout = false;
	/** @type {'nested' | 'card'} */
	export let fillMode = 'nested';
	/** @type {string | undefined} */
	export let screenAspectRatio = undefined;

	$: contentSizedCard = fillMode === 'card' && Boolean(screenAspectRatio);
	$: carouselCardFrame = contentSizedCard && carouselMobileLayout;
	$: resolvedAspectRatio = screenAspectRatio ?? MANATAL_PHONE_SCREEN_ASPECT_CSS;

	$: rootClass = contentSizedCard
		? 'relative shrink-0 rounded-[2rem] border-[3px] border-zinc-800 bg-zinc-950 p-1.5 shadow-[0_32px_64px_-28px_rgba(0,0,0,0.45)] ring-1 ring-white/10 ' +
			(carouselCardFrame
				? 'w-fit max-w-[300px] lg:w-fit'
				: 'w-fit')
		: fillMode === 'card'
			? 'relative aspect-[9/19.5] w-auto shrink-0 rounded-[2.25rem] border-[3px] border-zinc-800 bg-zinc-950 p-1.5 shadow-[0_32px_64px_-28px_rgba(0,0,0,0.45)] ring-1 ring-white/10'
			: 'relative max-h-[min(72vw,640px)] w-[min(42vw,280px)] shrink-0 rounded-[2.25rem] border-[3px] border-zinc-800 bg-zinc-950 p-1.5 shadow-[0_24px_48px_-20px_rgba(0,0,0,0.65)] ring-1 ring-white/10';

	$: innerClass = contentSizedCard
		? 'relative flex w-full flex-col overflow-hidden rounded-[1.5rem] bg-black'
		: 'relative flex h-full w-full flex-col overflow-hidden rounded-[1.85rem] bg-black';

	$: screenClass = contentSizedCard
		? 'relative min-h-0 max-w-full overflow-hidden bg-black' +
			(carouselCardFrame ? ' manatal-carousel-phone-screen' : '')
		: 'relative min-h-0 flex-1 overflow-hidden bg-black';

	$: screenStyle = screenAspectRatio && !carouselCardFrame
		? `aspect-ratio:${screenAspectRatio};max-height:${MANATAL_PHONE_SCREEN_MAX_HEIGHT_CSS};width:${getManatalPhoneScreenWidthCss('desktop')}`
		: carouselCardFrame
			? `--manatal-phone-aspect:${resolvedAspectRatio};--manatal-phone-width:${getManatalPhoneScreenMobileConstraintCss()};--manatal-phone-max-height:${MANATAL_PHONE_SCREEN_MAX_HEIGHT_MOBILE_CSS}`
			: undefined;
</script>

<div
	data-testid="carousel-device-frame-phone"
	class={rootClass}
>
	<div class={innerClass}>
		<div class="relative z-10 flex shrink-0 items-center justify-center px-4 pb-1 pt-2 sm:pt-2.5">
			<div
				class="h-[18px] w-[72px] rounded-full bg-black/85 ring-1 ring-white/10"
				aria-hidden="true"
			></div>
		</div>
		{#if domain && showDomain}
			<p
				data-testid="phone-device-frame-domain"
				class="pointer-events-none absolute left-0 right-0 top-2 z-20 text-center text-[10px] font-medium tracking-wide text-zinc-400 {hideDomainOnMobile
					? 'hidden sm:block'
					: ''}"
			>
				{domain}
			</p>
		{/if}
		<div
			data-testid="phone-device-screen"
			class={screenClass}
			style={screenStyle}
		>
			<slot />
		</div>
	</div>
</div>

<style>
	:global(.manatal-carousel-phone-screen) {
		aspect-ratio: var(--manatal-phone-aspect);
		width: var(--manatal-phone-width);
		max-height: var(--manatal-phone-max-height);
	}

	@media (min-width: 1024px) {
		:global(.manatal-carousel-phone-screen) {
			--manatal-phone-max-height: calc(min(88vw, 920px) * 10 / 16);
			--manatal-phone-width: min(
				min(42vw, 280px),
				calc(min(88vw, 920px) * 10 / 16 * 650 / 1459)
			);
		}
	}
</style>
