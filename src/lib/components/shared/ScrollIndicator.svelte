<script lang="ts">
	import { onMount } from 'svelte';

	/**
	 * Target section to scroll to
	 */
	export let targetId = 'about';

	/**
	 * Show/hide based on scroll position
	 */
	let isVisible = true;

	/**
	 * Scroll to target section
	 */
	function scrollToTarget() {
		const element = document.getElementById(targetId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	/**
	 * Hide indicator after scrolling down
	 */
	onMount(() => {
		const handleScroll = () => {
			if (window.scrollY > window.innerHeight * 0.5) {
				isVisible = false;
			} else {
				isVisible = true;
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

{#if isVisible}
	<button
		type="button"
		on:click={scrollToTarget}
		class="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 text-text-secondary hover:text-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:rounded animate-bounce bg-transparent border-none cursor-pointer max-h-[600px]:hidden"
		aria-label="Scroll to next section"
	>
		<div class="w-6 h-10 border-2 border-current rounded-full flex items-start justify-center pt-2">
			<div class="scroll-wheel w-1 h-2 bg-current rounded-full"></div>
		</div>
		<div class="w-6 h-6">
			<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 14l-7 7m0 0l-7-7m7 7V3"
				/>
			</svg>
		</div>
		<span class="text-xs font-medium uppercase tracking-wider">Scroll Down</span>
	</button>
{/if}

<style>
	.scroll-wheel {
		animation: scroll-wheel 1.5s ease-in-out infinite;
	}

	@keyframes scroll-wheel {
		0% {
			opacity: 1;
			transform: translateY(0);
		}
		100% {
			opacity: 0;
			transform: translateY(8px);
		}
	}

	/* Hide on small screens to avoid overlap */
	@media (max-height: 600px) {
		button {
			display: none;
		}
	}
</style>
