<script lang="ts">
	import { layoutStore } from '$lib/stores/layout';
	import LayoutSwitcher from './LayoutSwitcher.svelte';

	/**
	 * Mobile menu state
	 */
	let mobileMenuOpen = false;

	/**
	 * Toggle mobile menu
	 */
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	/**
	 * Close mobile menu
	 */
	function closeMobileMenu() {
		mobileMenuOpen = false;
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
	 * Current layout for conditional navigation
	 */
	let currentLayout: 'case_study' | 'single_page' | 'bento_grid';
	layoutStore.subscribe((value) => {
		currentLayout = value;
	});
</script>

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

				<!-- Layout Switcher -->
				<LayoutSwitcher />
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
		<div class="md:hidden bg-surface border-t border-border">
			<div class="px-2 pt-2 pb-3 space-y-1">
				{#if currentLayout === 'single_page'}
					<a
						href="#about"
						on:click={(e) => scrollToSection(e, 'about')}
						class="block px-3 py-2 text-text-primary hover:text-primary hover:bg-background rounded-md transition-colors"
					>
						About
					</a>
					<a
						href="#projects"
						on:click={(e) => scrollToSection(e, 'projects')}
						class="block px-3 py-2 text-text-primary hover:text-primary hover:bg-background rounded-md transition-colors"
					>
						Projects
					</a>
					<a
						href="#skills"
						on:click={(e) => scrollToSection(e, 'skills')}
						class="block px-3 py-2 text-text-primary hover:text-primary hover:bg-background rounded-md transition-colors"
					>
						Skills
					</a>
					<a
						href="#contact"
						on:click={(e) => scrollToSection(e, 'contact')}
						class="block px-3 py-2 text-text-primary hover:text-primary hover:bg-background rounded-md transition-colors"
					>
						Contact
					</a>
				{:else}
					<a
						href="/"
						class="block px-3 py-2 text-text-primary hover:text-primary hover:bg-background rounded-md transition-colors"
					>
						Home
					</a>
					<a
						href="/#projects"
						class="block px-3 py-2 text-text-primary hover:text-primary hover:bg-background rounded-md transition-colors"
					>
						Projects
					</a>
				{/if}

				<!-- Mobile Layout Switcher -->
				<div class="px-3 py-2">
					<LayoutSwitcher />
				</div>
			</div>
		</div>
	{/if}
</nav>

<!-- Spacer to prevent content from hiding under fixed nav -->
<div class="h-16" aria-hidden="true"></div>
