<script>
	import { DEVICE_STAGE_VIGNETTE } from '$lib/constants/device-frame';
</script>

<div
	class={'relative min-h-0 flex-1 ' + DEVICE_STAGE_VIGNETTE}
	data-testid="capability-band-stage"
>
	<slot />
</div>
