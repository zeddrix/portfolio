<script lang="ts">
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
</script>

<svelte:head>
	<title>Manage Certifications - Admin - Zeddrix Portfolio</title>
</svelte:head>

<div class="py-6 px-4 sm:px-6 lg:px-8">
	<Breadcrumb items={[{ label: 'Certifications' }]} />

	<div class="md:flex md:items-center md:justify-between mb-6">
		<div class="min-w-0 flex-1">
			<h2
				class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
			>
				Certifications & Experience
			</h2>
		</div>
		<div class="mt-4 flex md:ml-4 md:mt-0 space-x-3">
			<button
				type="button"
				class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
			>
				<span class="material-icons text-base mr-1">add</span>
				Add Certification
			</button>
			<button
				type="button"
				class="inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
			>
				<span class="material-icons text-base mr-1">add</span>
				Add Experience
			</button>
		</div>
	</div>

	<div class="bg-white shadow rounded-lg p-6">
		<p class="text-gray-600">
			Certifications and experience management will be implemented in Phase 13 (Certifications &
			Experience).
		</p>
		<div class="mt-4 rounded-md bg-blue-50 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<span class="material-icons text-blue-400">info</span>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-blue-800">Coming Soon</h3>
					<div class="mt-2 text-sm text-blue-700">
						<p>This section will include:</p>
						<ul class="list-disc list-inside mt-2 space-y-1">
							<li>Certifications list with dates and credentials</li>
							<li>Work experience timeline</li>
							<li>Drag-and-drop reordering</li>
							<li>Current position toggle</li>
							<li>CRUD operations for both sections</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
