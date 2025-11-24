<script lang="ts">
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
</script>

<svelte:head>
	<title>Create Project - Admin - Zeddrix Portfolio</title>
</svelte:head>

<div class="py-6 px-4 sm:px-6 lg:px-8">
	<Breadcrumb items={[{ label: 'Projects', href: '/admin/projects' }, { label: 'Create New' }]} />

	<div class="md:flex md:items-center md:justify-between mb-6">
		<div class="min-w-0 flex-1">
			<h2
				class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
			>
				Create New Project
			</h2>
		</div>
	</div>

	<div class="bg-white shadow rounded-lg p-6">
		<p class="text-gray-600">
			Project creation form will be implemented in Phase 11 (Projects Management).
		</p>
		<div class="mt-4 rounded-md bg-blue-50 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<span class="material-icons text-blue-400">info</span>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-blue-800">Coming Soon</h3>
					<div class="mt-2 text-sm text-blue-700">
						<p>This form will include:</p>
						<ul class="list-disc list-inside mt-2 space-y-1">
							<li>Title, slug, and descriptions</li>
							<li>Featured image upload with Cloudinary</li>
							<li>Gallery images/videos/GIFs upload</li>
							<li>Rich text editor for detailed descriptions</li>
							<li>Tech stack tags</li>
							<li>Project URLs and GitHub links</li>
							<li>Metrics and case study details</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
