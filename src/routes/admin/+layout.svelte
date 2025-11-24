<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let mobileMenuOpen = false;
	let profileDropdownOpen = false;
	let loading = false;

	// Navigation items
	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: 'dashboard' },
		{ href: '/admin/profile', label: 'Profile', icon: 'person' },
		{ href: '/admin/projects', label: 'Projects', icon: 'work' },
		{ href: '/admin/skills', label: 'Skills', icon: 'code' },
		{ href: '/admin/certifications', label: 'Certifications', icon: 'verified' },
		{ href: '/admin/settings', label: 'Settings', icon: 'settings' }
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

<div class="min-h-screen bg-gray-100">
	<!-- Mobile menu button -->
	<div class="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
		<div class="flex items-center justify-between px-4 py-3">
			<h1 class="text-lg font-semibold text-gray-900">Admin Panel</h1>
			<button
				on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
				class="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
			class="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto"
		>
			<div class="flex items-center flex-shrink-0 px-4">
				<h1 class="text-xl font-bold text-gray-900">Admin Panel</h1>
			</div>
			<nav class="mt-8 flex-1 px-2 space-y-1">
				{#each navItems as item}
					<a
						href={item.href}
						class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors {isActive(
							item.href
						)
							? 'bg-gray-900 text-white'
							: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
					>
						<span class="material-icons mr-3 text-xl">{item.icon}</span>
						{item.label}
					</a>
				{/each}
			</nav>
		</div>
	</aside>

	<!-- Mobile sidebar -->
	{#if mobileMenuOpen}
		<div
			class="lg:hidden fixed inset-0 z-30 bg-gray-600 bg-opacity-75"
			role="button"
			tabindex="0"
			on:click={closeMobileMenu}
			on:keydown={(e) => e.key === 'Escape' && closeMobileMenu()}
			aria-label="Close menu"
		></div>
		<aside
			class="lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 pt-16"
		>
			<nav class="mt-5 px-2 space-y-1">
				{#each navItems as item}
					<a
						href={item.href}
						on:click={closeMobileMenu}
						class="group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors {isActive(
							item.href
						)
							? 'bg-gray-900 text-white'
							: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
					>
						<span class="material-icons mr-3 text-xl">{item.icon}</span>
						{item.label}
					</a>
				{/each}
			</nav>
		</aside>
	{/if}

	<!-- Main content -->
	<div class="lg:pl-64 flex flex-col flex-1">
		<!-- Top bar -->
		<div class="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
			<div class="flex-1 px-4 flex justify-between sm:px-6 lg:px-8">
				<div class="flex-1 flex"></div>
				<div class="ml-4 flex items-center md:ml-6">
					<!-- Profile dropdown -->
					<div class="ml-3 relative profile-dropdown">
						<div>
							<button
								type="button"
								on:click={toggleProfileDropdown}
								class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
								aria-expanded={profileDropdownOpen}
								aria-haspopup="true"
							>
								<span class="sr-only">Open user menu</span>
								<div
									class="h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-semibold"
								>
									{$auth.user?.email?.[0].toUpperCase() || 'A'}
								</div>
							</button>
						</div>

						{#if profileDropdownOpen}
							<div
								class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
							>
								<div class="px-4 py-2 text-xs text-gray-500">Signed in as</div>
								<div class="px-4 pb-2 text-sm font-medium text-gray-900 truncate">
									{$auth.user?.email || 'Unknown'}
								</div>
								<div class="border-t border-gray-100"></div>
								<a
									href="/admin/profile"
									on:click={closeProfileDropdown}
									class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a
								>
								<a
									href="/admin/settings"
									on:click={closeProfileDropdown}
									class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a
								>
								<div class="border-t border-gray-100"></div>
								<button
									on:click={handleLogout}
									disabled={loading}
									class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

<!-- Load Material Icons -->
<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Icons&display=swap"
	/>
</svelte:head>
