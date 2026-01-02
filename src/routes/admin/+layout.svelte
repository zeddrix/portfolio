<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let mobileMenuOpen = false;
	let profileDropdownOpen = false;
	let loading = false;
	let checkingAuth = true;

	// Check authentication on mount
	onMount(async () => {
		await auth.initialize();
		checkingAuth = false;

		// Redirect to login if not authenticated
		if (!$auth.user && $page.url.pathname !== '/admin/login') {
			await goto('/admin/login');
		}
	});

	// Main navigation items
	const mainNavItems = [
		{ href: '/admin', label: 'Dashboard', icon: 'dashboard' },
		{ href: '/admin/profile', label: 'Profile', icon: 'person' },
		{ href: '/admin/projects', label: 'Projects', icon: 'work' },
		{ href: '/admin/skills', label: 'Skills', icon: 'code' },
		{ href: '/admin/certifications', label: 'Certifications', icon: 'verified' }
	];

	// Settings navigation items
	const settingsNavItems = [
		{ href: '/admin/settings', label: 'General', icon: 'tune' },
		{ href: '/admin/settings/hero', label: 'Hero Settings', icon: 'view_carousel' },
		{ href: '/admin/settings/profile-display', label: 'Profile Display', icon: 'account_circle' },
		{ href: '/admin/settings/stats', label: 'Stats Section', icon: 'bar_chart' },
		{ href: '/admin/settings/palettes', label: 'Color Palettes', icon: 'palette' },
		{ href: '/admin/settings/button-text', label: 'Button Text', icon: 'text_fields' }
	];

	// Content navigation items
	const contentNavItems = [
		{ href: '/admin/content/process', label: 'Development Process', icon: 'timeline' },
		{ href: '/admin/content/deliverables', label: 'Deliverables', icon: 'inventory_2' },
		{ href: '/admin/content/ai-showcase', label: 'AI Showcase', icon: 'smart_toy' }
	];

	async function handleLogout() {
		loading = true;
		try {
			await auth.signOut();
			await goto('/admin/login');
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			loading = false;
		}
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	function toggleProfileDropdown() {
		profileDropdownOpen = !profileDropdownOpen;
	}

	function closeProfileDropdown() {
		profileDropdownOpen = false;
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.profile-dropdown')) {
			profileDropdownOpen = false;
		}
	}

	$: isActive = (href: string) => {
		if (href === '/admin') {
			return $page.url.pathname === '/admin';
		}
		return $page.url.pathname.startsWith(href);
	};
</script>

<svelte:window on:click={handleClickOutside} />

{#if checkingAuth}
	<div class="min-h-screen flex items-center justify-center bg-background">
		<div class="text-center">
			<div
				class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"
			></div>
			<p class="mt-4 text-text-secondary">Loading...</p>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-background">
		<!-- Mobile menu button -->
		<div class="lg:hidden fixed top-0 left-0 right-0 z-40 bg-surface border-b border-border">
			<div class="flex items-center justify-between px-4 py-3">
				<h1 class="text-lg font-semibold text-text-primary">Admin Panel</h1>
				<button
					on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
					class="rounded-md p-2 text-text-secondary hover:bg-background hover:text-text-primary"
					aria-label="Toggle menu"
				>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

		<!-- Sidebar for desktop -->
		<aside class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
			<div
				class="flex flex-col flex-grow bg-surface border-r border-border pt-5 pb-4 overflow-y-auto"
			>
				<div class="flex items-center flex-shrink-0 px-4">
					<h1 class="text-xl font-bold text-text-primary">Admin Panel</h1>
				</div>
				<nav class="mt-8 flex-1 px-2 space-y-1 overflow-y-auto">
					<!-- Main Navigation -->
					{#each mainNavItems as item}
						<a
							href={item.href}
							class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors {isActive(
								item.href
							)
								? 'bg-primary text-white'
								: 'text-text-secondary hover:bg-background hover:text-text-primary'}"
						>
							<span class="material-icons mr-3 text-xl">{item.icon}</span>
							{item.label}
						</a>
					{/each}

					<!-- Settings Section -->
					<div class="pt-4 mt-4 border-t border-border">
						<h3
							class="px-2 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider"
						>
							Settings
						</h3>
						{#each settingsNavItems as item}
							<a
								href={item.href}
								class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors {isActive(
									item.href
								)
									? 'bg-primary text-white'
									: 'text-text-secondary hover:bg-background hover:text-text-primary'}"
							>
								<span class="material-icons mr-3 text-xl">{item.icon}</span>
								{item.label}
							</a>
						{/each}
					</div>

					<!-- Content Section -->
					<div class="pt-4 mt-4 border-t border-border">
						<h3
							class="px-2 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider"
						>
							Content
						</h3>
						{#each contentNavItems as item}
							<a
								href={item.href}
								class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors {isActive(
									item.href
								)
									? 'bg-primary text-white'
									: 'text-text-secondary hover:bg-background hover:text-text-primary'}"
							>
								<span class="material-icons mr-3 text-xl">{item.icon}</span>
								{item.label}
							</a>
						{/each}
					</div>
				</nav>
			</div>
		</aside>

		<!-- Mobile sidebar -->
		{#if mobileMenuOpen}
			<div
				class="lg:hidden fixed inset-0 z-30 bg-text-primary bg-opacity-75"
				role="button"
				tabindex="0"
				on:click={closeMobileMenu}
				on:keydown={(e) => e.key === 'Escape' && closeMobileMenu()}
				aria-label="Close menu"
			></div>
			<aside
				class="lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-border pt-16 overflow-y-auto"
			>
				<nav class="mt-5 px-2 space-y-1 pb-4">
					<!-- Main Navigation -->
					{#each mainNavItems as item}
						<a
							href={item.href}
							on:click={closeMobileMenu}
							class="group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors {isActive(
								item.href
							)
								? 'bg-primary text-white'
								: 'text-text-secondary hover:bg-background hover:text-text-primary'}"
						>
							<span class="material-icons mr-3 text-xl">{item.icon}</span>
							{item.label}
						</a>
					{/each}

					<!-- Settings Section -->
					<div class="pt-4 mt-4 border-t border-border">
						<h3
							class="px-2 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider"
						>
							Settings
						</h3>
						{#each settingsNavItems as item}
							<a
								href={item.href}
								on:click={closeMobileMenu}
								class="group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors {isActive(
									item.href
								)
									? 'bg-primary text-white'
									: 'text-text-secondary hover:bg-background hover:text-text-primary'}"
							>
								<span class="material-icons mr-3 text-xl">{item.icon}</span>
								{item.label}
							</a>
						{/each}
					</div>

					<!-- Content Section -->
					<div class="pt-4 mt-4 border-t border-border">
						<h3
							class="px-2 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider"
						>
							Content
						</h3>
						{#each contentNavItems as item}
							<a
								href={item.href}
								on:click={closeMobileMenu}
								class="group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors {isActive(
									item.href
								)
									? 'bg-primary text-white'
									: 'text-text-secondary hover:bg-background hover:text-text-primary'}"
							>
								<span class="material-icons mr-3 text-xl">{item.icon}</span>
								{item.label}
							</a>
						{/each}
					</div>
				</nav>
			</aside>
		{/if}

		<!-- Main content -->
		<div class="lg:pl-64 flex flex-col flex-1">
			<!-- Top bar -->
			<div class="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-surface shadow">
				<div class="flex-1 px-4 flex justify-between sm:px-6 lg:px-8">
					<div class="flex-1 flex"></div>
					<div class="ml-4 flex items-center md:ml-6">
						<!-- Profile dropdown -->
						<div class="ml-3 relative profile-dropdown">
							<div>
								<button
									type="button"
									on:click={toggleProfileDropdown}
									class="max-w-xs bg-surface flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
									aria-expanded={profileDropdownOpen}
									aria-haspopup="true"
								>
									<span class="sr-only">Open user menu</span>
									<div
										class="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold"
									>
										{$auth.user?.email?.[0].toUpperCase() || 'A'}
									</div>
								</button>
							</div>

							{#if profileDropdownOpen}
								<div
									class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-surface ring-1 ring-border focus:outline-none"
								>
									<div class="px-4 py-2 text-xs text-text-secondary">Signed in as</div>
									<div class="px-4 pb-2 text-sm font-medium text-text-primary truncate">
										{$auth.user?.email || 'Unknown'}
									</div>
									<div class="border-t border-border"></div>
									<a
										href="/admin/profile"
										on:click={closeProfileDropdown}
										class="block px-4 py-2 text-sm text-text-secondary hover:bg-background hover:text-text-primary"
										>Your Profile</a
									>
									<a
										href="/admin/settings"
										on:click={closeProfileDropdown}
										class="block px-4 py-2 text-sm text-text-secondary hover:bg-background hover:text-text-primary"
										>Settings</a
									>
									<div class="border-t border-border"></div>
									<button
										on:click={handleLogout}
										disabled={loading}
										class="block w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{loading ? 'Signing out...' : 'Sign out'}
									</button>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Page content -->
			<main class="flex-1 pt-16 lg:pt-0">
				<slot />
			</main>
		</div>
	</div>
{/if}

<!-- Load Material Icons -->
<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Icons&display=swap"
	/>
</svelte:head>
