<script lang="ts" context="module">
	export interface SocialLink {
		name: string;
		href: string;
		icon: string;
	}
</script>

<script lang="ts">
	/**
	 * Footer Component
	 *
	 * A professional footer with social links and copyright information.
	 */

	export let socialLinks: SocialLink[] = [];
	export let copyrightText: string = '';

	const currentYear = new Date().getFullYear();
</script>

<footer class="bg-neutral-900 text-white" {...$$restProps}>
	<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<!-- Brand Section -->
			<div class="space-y-4">
				<slot name="brand" />
			</div>

			<!-- Links Section -->
			<div class="space-y-4">
				<slot name="links" />
			</div>

			<!-- Social Section -->
			<div class="space-y-4">
				{#if socialLinks.length > 0}
					<h3 class="text-lg font-semibold">Connect</h3>
					<div class="flex gap-4">
						{#each socialLinks as social}
							<a
								href={social.href}
								target="_blank"
								rel="noopener noreferrer"
								class="text-neutral-400 hover:text-white transition-colors duration-150"
								aria-label={social.name}
							>
								{@html social.icon}
							</a>
						{/each}
					</div>
				{/if}
				<slot name="social" />
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="mt-12 pt-8 border-t border-neutral-800 text-center text-neutral-400 text-sm">
			<p>
				{copyrightText || `© ${currentYear} All rights reserved.`}
			</p>
			<slot name="bottom" />
		</div>
	</div>
</footer>
