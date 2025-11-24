<script lang="ts">
	import { layoutStore } from '$lib/stores/layout';
	import LayoutSwitcher from './LayoutSwitcher.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import ColorPaletteSwitcher from './ColorPaletteSwitcher.svelte';
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

	/**
	 * Current layout for conditional navigation
	 */
	let currentLayout: 'case_study' | 'single_page' | 'bento_grid';
	layoutStore.subscribe((value) => {
		currentLayout = value;
	});
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeydown} />

<nav class="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">
			<!-- Logo -->
			<div class="flex-shrink-0">
				<a href="/" class="text-xl font-bold text-primary hover:text-primary/80 transition-colors">
					Zeddrix
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center space-x-8">
				{#if currentLayout === 'single_page'}
					<a
						href="#about"
						on:click={(e) => scrollToSection(e, 'about')}
						class="text-text-primary hover:text-primary transition-colors"
					>
						About
					</a>
					<a
						href="#projects"
						on:click={(e) => scrollToSection(e, 'projects')}
						class="text-text-primary hover:text-primary transition-colors"
					>
						Projects
					</a>
					<a
						href="#skills"
						on:click={(e) => scrollToSection(e, 'skills')}
						class="text-text-primary hover:text-primary transition-colors"
					>
						Skills
					</a>
					<a
						href="#contact"
						on:click={(e) => scrollToSection(e, 'contact')}
						class="text-text-primary hover:text-primary transition-colors"
					>
						Contact
					</a>
				{:else}
					<a href="/" class="text-text-primary hover:text-primary transition-colors"> Home </a>
					<a href="/#projects" class="text-text-primary hover:text-primary transition-colors">
						Projects
					</a>
				{/if}

				<!-- Controls Group -->
				<div class="flex items-center gap-2">
					<!-- Layout Switcher -->
					<LayoutSwitcher />
					<!-- Theme & Palette Controls -->
					<div class="flex items-center gap-2 pl-2 border-l border-border">
						<ThemeToggle />
						<ColorPaletteSwitcher />
					</div>
				</div>
			</div>

			<!-- Mobile Menu Button -->
			<div class="md:hidden">
				<button
					type="button"
					on:click={toggleMobileMenu}
					class="text-text-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
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
			class="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 md:hidden"
			transition:fade={{ duration: 200 }}
			on:click={closeMobileMenu}
			role="presentation"
		></div>

		<!-- Mobile Menu Content -->
		<div
			bind:this={mobileMenuElement}
			class="mobile-menu-container fixed inset-x-0 top-16 bottom-0 z-50 md:hidden"
			transition:slide={{ duration: 300 }}
			use:swipe={{ threshold: 50 }}
		>
			<div class="h-full bg-surface border-t border-border overflow-y-auto">
				<div class="px-2 pt-2 pb-3 space-y-1">
					{#if currentLayout === 'single_page'}
						<a
							href="#about"
							on:click={(e) => scrollToSection(e, 'about')}
							class="block px-3 py-2 text-text-primary hover:text-primary hover:bg-background rounded-md transition-colors active:scale-95"
						>
							About
						</a>
						<a
							href="#projects"
							on:click={(e) => scrollToSection(e, 'projects')}
							class="block px-3 py-2 text-text-primary hover:text-primary hover:bg-background rounded-md transition-colors active:scale-95"
						>
							Projects
						</a>
						<a
							href="#skills"
							on:click={(e) => scrollToSection(e, 'skills')}
							class="block px-3 py-2 text-text-primary hover:text-primary hover:bg-background rounded-md transition-colors active:scale-95"
						>
							Skills
						</a>
						<a
							href="#contact"
							on:click={(e) => scrollToSection(e, 'contact')}
							class="block px-3 py-2 text-text-primary hover:text-primary hover:bg-background rounded-md transition-colors active:scale-95"
						>
							Contact
						</a>
					{:else}
						<a
							href="/"
							class="block px-3 py-2 text-text-primary hover:text-primary hover:bg-background rounded-md transition-colors active:scale-95"
						>
							Home
						</a>
						<a
							href="/#projects"
							class="block px-3 py-2 text-text-primary hover:text-primary hover:bg-background rounded-md transition-colors active:scale-95"
						>
							Projects
						</a>
					{/if}

					<!-- Mobile Controls -->
					<div class="px-3 py-4 space-y-4 border-t border-border mt-2">
						<!-- Layout Switcher -->
						<div>
							<p class="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">
								Layout
							</p>
							<LayoutSwitcher />
						</div>
						<!-- Theme & Palette Controls -->
						<div>
							<p class="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">
								Appearance
							</p>
							<div class="flex items-center gap-2">
								<ThemeToggle />
								<ColorPaletteSwitcher />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</nav>

<!-- Spacer to prevent content from hiding under fixed nav -->
<div class="h-16" aria-hidden="true"></div>
