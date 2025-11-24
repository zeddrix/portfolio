<script lang="ts">
	import { animate_on_scroll } from '$lib/actions/animate';
</script>

<svelte:head>
	<title>Site Maintenance - Zeddrix Portfolio</title>
	<meta name="description" content="The site is currently under maintenance. We'll be back soon!" />
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-background px-4">
	<div class="max-w-2xl w-full text-center space-y-8">
		<!-- Icon -->
		<div
			class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border-2 border-primary mb-4"
			use:animate_on_scroll={{ type: 'scaleIn', threshold: 0.1 }}
		>
			<span class="material-icons text-5xl text-primary">construction</span>
		</div>

		<!-- Heading -->
		<div use:animate_on_scroll={{ type: 'fadeInUp', delay: 100 }}>
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4">
				We'll Be Right Back
			</h1>
			<p class="text-xl md:text-2xl text-text-secondary">
				The site is currently undergoing scheduled maintenance.
			</p>
		</div>

		<!-- Message -->
		<div
			class="bg-surface border border-border rounded-lg p-6 md:p-8"
			use:animate_on_scroll={{ type: 'fadeInUp', delay: 200 }}
		>
			<p class="text-text-secondary mb-4">
				We're working hard to improve your experience. The site should be back online shortly.
			</p>
			<p class="text-text-secondary">Thank you for your patience!</p>
		</div>

		<!-- Decorative Elements -->
		<div
			class="flex items-center justify-center gap-2"
			use:animate_on_scroll={{ type: 'fadeIn', delay: 300 }}
		>
			<div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
			<div class="w-2 h-2 rounded-full bg-primary animate-pulse delay-75"></div>
			<div class="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
		</div>

		<!-- Footer Info -->
		<div
			class="text-sm text-text-secondary/60"
			use:animate_on_scroll={{ type: 'fadeIn', delay: 400 }}
		>
			<p>If you need immediate assistance, please contact:</p>
			<a
				href="mailto:contact@zeddrix.com"
				class="text-primary hover:text-primary/80 transition-colors"
			>
				contact@zeddrix.com
			</a>
		</div>
	</div>
</div>

<style>
	.delay-75 {
		animation-delay: 75ms;
	}
	.delay-150 {
		animation-delay: 150ms;
	}
</style>
