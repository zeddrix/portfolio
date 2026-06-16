<script>
	/** @type {string} */
	export let href;
	/** @type {string} */
	export let testId = 'hero-cta';
	/** @type {string} */
	export let className = '';
</script>

<a
	data-testid={testId}
	{href}
	class={'get-in-touch group relative inline-flex h-[65px] w-full max-w-[260px] items-center justify-center overflow-hidden rounded-full bg-[#111111] no-underline sm:w-[260px] ' +
		className}
>
	<span class="get-in-touch__content inline-flex items-center gap-4">
		<span class="get-in-touch__icon shrink-0 text-white" aria-hidden="true">
			<svg class="h-6 w-6" viewBox="0 0 20 21" fill="currentColor">
				<path
					d="M2.5 5.5C2.5 4.67 3.17 4 4 4h12c.83 0 1.5.67 1.5 1.5v10c0 .83-.67 1.5-1.5 1.5H4c-.83 0-1.5-.67-1.5-1.5v-10Zm1.1 1.4 5.4 4.05c.39.29.93.29 1.32 0l5.4-4.05H3.6Zm13.4 1.35-4.98 3.74a2.7 2.7 0 0 1-3.24 0L3.8 8.25v6.75c0 .14.11.25.25.25h12c.14 0 .25-.11.25-.25V8.25Z"
				/>
			</svg>
		</span>
		<span class="get-in-touch__label text-xl font-semibold text-white">Get in touch</span>
	</span>
</a>

<style>
	.get-in-touch {
		--motion-duration: 0.52s;
		--motion-ease: cubic-bezier(0.22, 1, 0.36, 1);
		--icon-hover-shift: 4.5rem;
	}

	.get-in-touch__content {
		transition: transform var(--motion-duration) var(--motion-ease);
	}

	.get-in-touch__icon {
		transition:
			transform var(--motion-duration) var(--motion-ease),
			opacity var(--motion-duration) var(--motion-ease);
	}

	.get-in-touch__label {
		white-space: nowrap;
		transition:
			transform var(--motion-duration) var(--motion-ease),
			opacity var(--motion-duration) var(--motion-ease);
	}

	.get-in-touch:hover .get-in-touch__icon,
	.get-in-touch:focus-visible .get-in-touch__icon {
		transform: translateX(var(--icon-hover-shift)) scale(1.24);
	}

	.get-in-touch:hover .get-in-touch__label,
	.get-in-touch:focus-visible .get-in-touch__label {
		opacity: 0;
		transform: translateX(3rem);
	}

	@media (prefers-reduced-motion: reduce) {
		.get-in-touch__content,
		.get-in-touch__icon,
		.get-in-touch__label {
			transition: none;
		}

		.get-in-touch:hover .get-in-touch__label,
		.get-in-touch:focus-visible .get-in-touch__label {
			opacity: 1;
			transform: none;
		}

		.get-in-touch:hover .get-in-touch__icon,
		.get-in-touch:focus-visible .get-in-touch__icon {
			transform: none;
		}
	}
</style>
