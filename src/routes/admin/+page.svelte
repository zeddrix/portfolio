<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	// Helper to format date
	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	// Helper to get palette label
	function getPaletteLabel(palette: string): string {
		const labels: Record<string, string> = {
			cyber_blue: 'Cyber Blue',
			neon_nights: 'Neon Nights',
			sunset_ember: 'Sunset Ember',
			forest_zen: 'Forest Zen',
			monochrome_pro: 'Monochrome Pro',
			purple_haze: 'Purple Haze',
			ocean_deep: 'Ocean Deep'
		};
		return labels[palette] || palette;
	}

	// Helper to get layout label
	function getLayoutLabel(layout: string): string {
		const labels: Record<string, string> = {
			case_study: 'Case Study',
			single_page: 'Single Page',
			bento_grid: 'Bento Grid'
		};
		return labels[layout] || layout;
	}
</script>

<svelte:head>
	<title>Admin Dashboard - Zeddrix Portfolio</title>
</svelte:head>

<div class="py-6 px-4 sm:px-6 lg:px-8">
	<div class="mb-6">
		<h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:tracking-tight">
			Dashboard
		</h2>
		<p class="mt-1 text-sm text-gray-600">Welcome back! Here's an overview of your portfolio.</p>
	</div>

	<!-- Statistics Cards -->
	<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
		<!-- Total Projects -->
		<div class="bg-white overflow-hidden shadow rounded-lg">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<span class="material-icons text-3xl text-blue-600">work</span>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-gray-500 truncate">Total Projects</dt>
							<dd class="text-2xl font-bold text-gray-900">{data.stats.totalProjects}</dd>
						</dl>
					</div>
				</div>
			</div>
			<div class="bg-gray-50 px-5 py-3">
				<div class="text-sm">
					<a href="/admin/projects" class="font-medium text-blue-600 hover:text-blue-500">
						View all
					</a>
				</div>
			</div>
		</div>

		<!-- Total Skills -->
		<div class="bg-white overflow-hidden shadow rounded-lg">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<span class="material-icons text-3xl text-green-600">code</span>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-gray-500 truncate">Total Skills</dt>
							<dd class="text-2xl font-bold text-gray-900">{data.stats.totalSkills}</dd>
						</dl>
					</div>
				</div>
			</div>
			<div class="bg-gray-50 px-5 py-3">
				<div class="text-sm">
					<a href="/admin/skills" class="font-medium text-green-600 hover:text-green-500">
						Manage
					</a>
				</div>
			</div>
		</div>

		<!-- Total Certifications -->
		<div class="bg-white overflow-hidden shadow rounded-lg">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<span class="material-icons text-3xl text-purple-600">verified</span>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-gray-500 truncate">Certifications</dt>
							<dd class="text-2xl font-bold text-gray-900">{data.stats.totalCertifications}</dd>
						</dl>
					</div>
				</div>
			</div>
			<div class="bg-gray-50 px-5 py-3">
				<div class="text-sm">
					<a href="/admin/certifications" class="font-medium text-purple-600 hover:text-purple-500">
						Manage
					</a>
				</div>
			</div>
		</div>

		<!-- Total Experiences -->
		<div class="bg-white overflow-hidden shadow rounded-lg">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<span class="material-icons text-3xl text-orange-600">business_center</span>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-gray-500 truncate">Experiences</dt>
							<dd class="text-2xl font-bold text-gray-900">{data.stats.totalExperiences}</dd>
						</dl>
					</div>
				</div>
			</div>
			<div class="bg-gray-50 px-5 py-3">
				<div class="text-sm">
					<a href="/admin/certifications" class="font-medium text-orange-600 hover:text-orange-500">
						Manage
					</a>
				</div>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Site Settings Overview -->
		<div class="bg-white shadow rounded-lg">
			<div class="px-6 py-5 border-b border-gray-200">
				<h3 class="text-lg font-medium text-gray-900">Current Site Settings</h3>
			</div>
			<div class="px-6 py-5 space-y-4">
				{#if data.siteSettings}
					<div class="flex items-center justify-between">
						<div class="flex items-center">
							<span class="material-icons text-gray-400 mr-3">view_quilt</span>
							<span class="text-sm font-medium text-gray-700">Default Layout</span>
						</div>
						<span
							class="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800"
						>
							{getLayoutLabel(data.siteSettings.active_layout)}
						</span>
					</div>
					<div class="flex items-center justify-between">
						<div class="flex items-center">
							<span class="material-icons text-gray-400 mr-3">palette</span>
							<span class="text-sm font-medium text-gray-700">Default Color Palette</span>
						</div>
						<span
							class="inline-flex items-center rounded-full bg-purple-100 px-3 py-0.5 text-sm font-medium text-purple-800"
						>
							{getPaletteLabel(data.siteSettings.active_palette)}
						</span>
					</div>
					<div class="flex items-center justify-between">
						<div class="flex items-center">
							<span class="material-icons text-gray-400 mr-3">
								{data.siteSettings.theme_mode === 'dark' ? 'dark_mode' : 'light_mode'}
							</span>
							<span class="text-sm font-medium text-gray-700">Default Theme</span>
						</div>
						<span
							class="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-gray-800 capitalize"
						>
							{data.siteSettings.theme_mode}
						</span>
					</div>
					<div class="flex items-center justify-between">
						<div class="flex items-center">
							<span class="material-icons text-gray-400 mr-3">construction</span>
							<span class="text-sm font-medium text-gray-700">Maintenance Mode</span>
						</div>
						<span
							class="inline-flex items-center rounded-full {data.siteSettings.maintenance_mode
								? 'bg-red-100 text-red-800'
								: 'bg-green-100 text-green-800'} px-3 py-0.5 text-sm font-medium"
						>
							{data.siteSettings.maintenance_mode ? 'Enabled' : 'Disabled'}
						</span>
					</div>
				{:else}
					<p class="text-sm text-gray-500">No site settings found.</p>
				{/if}
			</div>
			<div class="bg-gray-50 px-6 py-3">
				<div class="text-sm">
					<a href="/admin/settings" class="font-medium text-blue-600 hover:text-blue-500">
						Manage settings <span aria-hidden="true">&rarr;</span>
					</a>
				</div>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="bg-white shadow rounded-lg">
			<div class="px-6 py-5 border-b border-gray-200">
				<h3 class="text-lg font-medium text-gray-900">Quick Actions</h3>
			</div>
			<div class="px-6 py-5">
				<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<a
						href="/admin/projects/new"
						class="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						<span class="material-icons text-base mr-2">add</span>
						New Project
					</a>
					<a
						href="/admin/profile"
						class="inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						<span class="material-icons text-base mr-2">person</span>
						Edit Profile
					</a>
					<a
						href="/admin/skills"
						class="inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						<span class="material-icons text-base mr-2">code</span>
						Manage Skills
					</a>
					<a
						href="/admin/settings"
						class="inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						<span class="material-icons text-base mr-2">settings</span>
						Site Settings
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Recent Projects -->
	{#if data.recentProjects.length > 0}
		<div class="mt-6 bg-white shadow rounded-lg">
			<div class="px-6 py-5 border-b border-gray-200">
				<h3 class="text-lg font-medium text-gray-900">Recently Updated Projects</h3>
			</div>
			<div class="px-6 py-5">
				<div class="flow-root">
					<ul class="-my-5 divide-y divide-gray-200">
						{#each data.recentProjects as project}
							<li class="py-4">
								<div class="flex items-center justify-between">
									<div class="flex-1 min-w-0">
										<p class="text-sm font-medium text-gray-900 truncate">
											{project.title}
										</p>
										<p class="text-sm text-gray-500">
											Updated {formatDate(project.updated_at)}
										</p>
									</div>
									<div class="ml-4 flex items-center space-x-2">
										<span
											class="inline-flex items-center rounded-full {project.published
												? 'bg-green-100 text-green-800'
												: 'bg-gray-100 text-gray-800'} px-2.5 py-0.5 text-xs font-medium"
										>
											{project.published ? 'Published' : 'Draft'}
										</span>
										<a
											href="/admin/projects/{project.id}/edit"
											class="text-sm font-medium text-blue-600 hover:text-blue-500"
										>
											Edit
										</a>
									</div>
								</div>
							</li>
						{/each}
					</ul>
				</div>
			</div>
			<div class="bg-gray-50 px-6 py-3">
				<div class="text-sm">
					<a href="/admin/projects" class="font-medium text-blue-600 hover:text-blue-500">
						View all projects <span aria-hidden="true">&rarr;</span>
					</a>
				</div>
			</div>
		</div>
	{/if}
</div>
