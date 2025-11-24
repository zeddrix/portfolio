<script lang="ts">
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
</script>

<svelte:head>
	<title>Site Settings - Admin - Zeddrix Portfolio</title>
</svelte:head>

<div class="py-6 px-4 sm:px-6 lg:px-8">
	<Breadcrumb items={[{ label: 'Settings' }]} />

	<div class="md:flex md:items-center md:justify-between mb-6">
		<div class="min-w-0 flex-1">
			<h2
				class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
			>
				Site Settings
			</h2>
		</div>
	</div>

	<div class="space-y-6">
		<!-- Default Layout Setting -->
		<div class="bg-white shadow rounded-lg p-6">
			<h3 class="text-lg font-medium text-gray-900 mb-2">Default Layout</h3>
			<p class="text-sm text-gray-600 mb-4">
				Set the default layout for new visitors. Visitors can switch layouts themselves.
			</p>
			<div class="rounded-md bg-blue-50 p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<span class="material-icons text-blue-400">info</span>
					</div>
					<div class="ml-3">
						<h4 class="text-sm font-medium text-blue-800">Coming in Phase 9</h4>
						<p class="mt-1 text-sm text-blue-700">
							Layout selector with preview thumbnails will be implemented in Phase 9 (Site
							Settings).
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Default Color Palette Setting -->
		<div class="bg-white shadow rounded-lg p-6">
			<h3 class="text-lg font-medium text-gray-900 mb-2">Default Color Palette</h3>
			<p class="text-sm text-gray-600 mb-4">
				Set the default color palette for new visitors. Visitors can switch palettes themselves.
			</p>
			<div class="rounded-md bg-blue-50 p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<span class="material-icons text-blue-400">info</span>
					</div>
					<div class="ml-3">
						<h4 class="text-sm font-medium text-blue-800">Coming in Phase 9</h4>
						<p class="mt-1 text-sm text-blue-700">
							Color palette selector with live preview will be implemented in Phase 9 (Site
							Settings).
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Theme Setting -->
		<div class="bg-white shadow rounded-lg p-6">
			<h3 class="text-lg font-medium text-gray-900 mb-2">Default Theme</h3>
			<p class="text-sm text-gray-600 mb-4">Set the default theme (dark/light) for new visitors.</p>
			<div class="rounded-md bg-blue-50 p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<span class="material-icons text-blue-400">info</span>
					</div>
					<div class="ml-3">
						<h4 class="text-sm font-medium text-blue-800">Coming in Phase 9</h4>
						<p class="mt-1 text-sm text-blue-700">
							Theme preference settings will be implemented in Phase 9 (Site Settings).
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Maintenance Mode -->
		<div class="bg-white shadow rounded-lg p-6">
			<h3 class="text-lg font-medium text-gray-900 mb-2">Maintenance Mode</h3>
			<p class="text-sm text-gray-600 mb-4">
				Enable maintenance mode to show a maintenance page to visitors.
			</p>
			<div class="rounded-md bg-blue-50 p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<span class="material-icons text-blue-400">info</span>
					</div>
					<div class="ml-3">
						<h4 class="text-sm font-medium text-blue-800">Coming in Phase 9</h4>
						<p class="mt-1 text-sm text-blue-700">
							Maintenance mode toggle will be implemented in Phase 9 (Site Settings).
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
