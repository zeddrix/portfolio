<script>
	import { profile } from '$lib/data/profile';
	import { appPath } from '$lib/utils/app-path';
	import PortfolioPreviewSettings from '$lib/components/PortfolioPreviewSettings.svelte';

	export let workLayoutMode = 'featuredGrid';
	export let capabilityLayoutMode = 'sevenBands';
	/** @type {(mode: string) => void} */
	export let onWorkLayoutChange = (_mode) => {};
	/** @type {(mode: string) => void} */
	export let onCapabilityLayoutChange = (_mode) => {};

	const navLinks = [
		{ id: 'work', label: 'Work', testId: 'nav-link-work', href: '#work' },
		{ id: 'about', label: 'About', testId: 'nav-link-about', href: '#about' },
		{ id: 'approach', label: 'Approach', testId: 'nav-link-approach', href: '#approach' },
		{ id: 'contact', label: 'Contact', testId: 'nav-link-contact', href: '#contact' }
	];
</script>

<header class="mx-auto w-[90%] max-w-[1400px] pt-3 sm:pt-4 md:pt-5">
	<div class="flex items-center justify-between gap-4">
		<a
			href={appPath('/')}
			class="text-sm font-semibold tracking-tight text-zinc-900 transition-colors hover:text-zinc-600"
		>
			{profile.name}
		</a>
		<div class="flex items-center gap-3 sm:gap-4">
			<nav class="hidden items-center gap-4 sm:flex" aria-label="Primary">
				{#each navLinks as link (link.id)}
					<a
						data-testid={link.testId}
						href={link.href}
						class="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
					>
						{link.label}
					</a>
				{/each}
			</nav>
			<PortfolioPreviewSettings
				{workLayoutMode}
				{capabilityLayoutMode}
				{onWorkLayoutChange}
				{onCapabilityLayoutChange}
			/>
			<a
				data-testid="header-github-link"
				href={profile.websiteUrl}
				class="inline-flex items-center gap-2 text-[15px] font-semibold text-[#8E8E93] transition-colors hover:text-zinc-700"
				target="_blank"
				rel="noopener noreferrer"
			>
				<svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path
						d="M12 .296C5.372.296 0 5.67 0 12.303c0 5.303 3.438 9.8 8.205 11.387.6.111.82-.26.82-.577 0-.285-.01-1.04-.015-2.042-3.338.726-4.042-1.612-4.042-1.612-.546-1.388-1.333-1.756-1.333-1.756-1.09-.745.082-.729.082-.729 1.205.084 1.84 1.238 1.84 1.238 1.07 1.834 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.303-5.466-1.334-5.466-5.932 0-1.31.468-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.45 11.45 0 0 1 3.006-.403c1.02.004 2.047.138 3.006.403 2.291-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.119 3.176.771.84 1.233 1.911 1.233 3.221 0 4.61-2.806 5.625-5.479 5.921.43.37.814 1.096.814 2.21 0 1.595-.014 2.882-.014 3.274 0 .319.216.694.825.576C20.565 22.1 24 17.603 24 12.303 24 5.67 18.627.296 12 .296z"
					/>
				</svg>
				<span class="hidden sm:inline">GitHub</span>
			</a>
		</div>
	</div>
</header>
