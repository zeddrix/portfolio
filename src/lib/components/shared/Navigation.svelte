<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
	import { swipe } from '$lib/actions/touch';
	import { slide, fade } from 'svelte/transition';

	/**
	 * Mobile menu state
	 */
	let mobileMenuOpen = false;

	/**
	 * Reference to mobile menu element
	 */
	let mobileMenuElement: HTMLDivElement;

	/**
	 * Navigation links
	 */
	const navLinks = [
		{ label: 'Work', href: '#interactive-showcase' },
		{ label: 'Process', href: '#development-process' },
		{ label: 'Services', href: '#deliverables' },
		{ label: 'Contact', href: '#contact' }
	];

	/**
	 * Toggle mobile menu
	 */
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;

		// Prevent body scroll when menu is open
		if (typeof document !== 'undefined') {
			document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
		}
	}

	/**
	 * Close mobile menu
	 */
	function closeMobileMenu() {
		mobileMenuOpen = false;
		if (typeof document !== 'undefined') {
			document.body.style.overflow = '';
		}
	}

	/**
	 * Handle swipe gesture to close menu
	 */
	function handleSwipe(e: Event) {
		const detail = (e as CustomEvent).detail as { direction: string };
		if (detail.direction === 'up') {
			closeMobileMenu();
		}
	}

	/**
	 * Setup swipe event listener when mobile menu element is ready
	 */
	$: if (mobileMenuElement) {
		mobileMenuElement.addEventListener('swipe', handleSwipe);
	}

	/**
	 * Handle smooth scroll to section
	 */
	function scrollToSection(event: MouseEvent, sectionId: string) {
		event.preventDefault();
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
			closeMobileMenu();
		}
	}

	/**
	 * Handle click outside to close mobile menu
	 */
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (mobileMenuOpen && !target.closest('.mobile-menu-container')) {
			closeMobileMenu();
		}
	}

	/**
	 * Handle escape key to close mobile menu
	 */
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && mobileMenuOpen) {
			closeMobileMenu();
		}
	}
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeydown} />

<!-- Navigation - Squarespace Minimal Style -->
<nav class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">
			<!-- Logo -->
			<div class="flex-shrink-0">
				<a href="/" class="text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors">
					Zeddrix
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center space-x-8">
				{#each navLinks as link}
					<a
						href={link.href}
						on:click={(e) => scrollToSection(e, link.href.slice(1))}
						class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
					>
						{link.label}
					</a>
				{/each}

				<!-- Controls Group -->
				<div class="flex items-center gap-3 pl-6 border-l border-gray-200">
					<ThemeToggle />
					<a href="#contact" class="btn-dark text-sm py-2 px-4"> Get Started </a>
				</div>
			</div>

			<!-- Mobile Menu Button -->
			<div class="md:hidden flex items-center gap-3">
				<ThemeToggle />
				<button
					type="button"
					on:click={toggleMobileMenu}
					class="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 rounded-md p-1"
					aria-label="Toggle mobile menu"
					aria-expanded={mobileMenuOpen}
				>
					<svg
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						{#if mobileMenuOpen}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						{:else}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						{/if}
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if mobileMenuOpen}
		<!-- Mobile Menu Overlay -->
		<div
			class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
			transition:fade={{ duration: 200 }}
			on:click={closeMobileMenu}
			role="presentation"
		></div>

		<!-- Mobile Menu Content -->
		<div
			bind:this={mobileMenuElement}
			class="mobile-menu-container fixed inset-x-0 top-16 z-50 md:hidden"
			transition:slide={{ duration: 300 }}
			use:swipe={{ threshold: 50 }}
		>
			<div class="bg-white border-t border-gray-100 shadow-lg">
				<div class="px-4 py-4 space-y-1">
					{#each navLinks as link}
						<a
							href={link.href}
							on:click={(e) => scrollToSection(e, link.href.slice(1))}
							class="block px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
						>
							{link.label}
						</a>
					{/each}

					<!-- Mobile CTA -->
					<div class="pt-4 mt-4 border-t border-gray-100">
						<a
							href="#contact"
							on:click={(e) => scrollToSection(e, 'contact')}
							class="block w-full text-center btn-dark"
						>
							Get Started
						</a>
					</div>
				</div>
			</div>
		</div>
	{/if}
</nav>

<!-- Spacer to prevent content from hiding under fixed nav -->
<div class="h-16" aria-hidden="true"></div>
