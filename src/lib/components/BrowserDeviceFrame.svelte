<script>
	import { CAPABILITY_BROWSER_ASPECT, DEVICE_CARD_GRADIENT } from '$lib/constants/device-frame';

	/** @type {string} */
	export let domain = '';
	/** @type {string} */
	export let urlTestId = '';
</script>

<div
	class={'overflow-hidden rounded-2xl ' + DEVICE_CARD_GRADIENT}
	data-testid="browser-device-frame"
>
	<div class="relative flex h-11 items-center justify-center border-b border-white/5 px-4">
		<div class="absolute left-4 flex gap-1.5">
			<span class="h-2.5 w-2.5 rounded-full bg-[#ff5f56]"></span>
			<span class="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]"></span>
			<span class="h-2.5 w-2.5 rounded-full bg-[#27c93f]"></span>
		</div>
		<div
			data-testid={urlTestId || undefined}
			class="flex h-7 min-w-0 max-w-[min(100%,28rem)] items-center justify-center truncate rounded-lg bg-black/40 px-3 text-xs text-zinc-300"
		>
			{domain}
		</div>
	</div>
	<div
		class={CAPABILITY_BROWSER_ASPECT + ' relative w-full overflow-hidden bg-black/20'}
		data-testid="browser-device-screen"
	>
		<slot />
	</div>
</div>
