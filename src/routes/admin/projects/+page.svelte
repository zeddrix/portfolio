<script lang="ts">
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let searchQuery = data.search || '';
	let filterValue = data.filter || 'all';
	let sortValue = data.sort || 'updated_at';

	// State for delete confirmation
	let deleteProjectId: string | null = null;
	let showDeleteModal = false;

	// State for drag and drop
	let draggedIndex: number | null = null;
	let draggedOverIndex: number | null = null;

	// Update URL with search/filter/sort params
	function updateParams() {
		const params = new URLSearchParams();
		if (searchQuery) params.set('search', searchQuery);
		if (filterValue !== 'all') params.set('filter', filterValue);
		if (sortValue !== 'updated_at') params.set('sort', sortValue);

		goto(`?${params.toString()}`, { keepFocus: true, noScroll: true });
	}

	// Format date
	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	// Truncate text
	function truncate(text: string, maxLength: number): string {
		return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
	}

	// Delete confirmation
	function confirmDelete(projectId: string) {
		deleteProjectId = projectId;
		showDeleteModal = true;
	}

	function cancelDelete() {
		deleteProjectId = null;
		showDeleteModal = false;
	}

	// Drag and drop handlers
	function handleDragStart(event: DragEvent, index: number) {
		draggedIndex = index;
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
		}
	}

	function handleDragOver(event: DragEvent, index: number) {
		event.preventDefault();
		if (draggedIndex !== null && draggedIndex !== index) {
			draggedOverIndex = index;
		}
	}

	function handleDragLeave() {
		draggedOverIndex = null;
	}

	function handleDrop(event: DragEvent, dropIndex: number) {
		event.preventDefault();

		if (draggedIndex === null || draggedIndex === dropIndex) {
			draggedIndex = null;
			draggedOverIndex = null;
			return;
		}

		// Reorder projects locally (optimistic update)
		const newProjects = [...data.projects];
		const [movedProject] = newProjects.splice(draggedIndex, 1);
		newProjects.splice(dropIndex, 0, movedProject);

		data.projects = newProjects;

		// Update display order in database
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '?/reorder';

		const input = document.createElement('input');
		input.type = 'hidden';
		input.name = 'data';
		input.value = JSON.stringify({
			projectId: movedProject.id,
			newOrder: dropIndex
		});

		form.appendChild(input);
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);

		draggedIndex = null;
		draggedOverIndex = null;
	}

	function handleDragEnd() {
		draggedIndex = null;
		draggedOverIndex = null;
	}

	// Show success/error messages
	$: if (form?.success) {
		setTimeout(() => {
			form = null;
		}, 3000);
	}
</script>

<svelte:head>
	<title>Manage Projects - Admin - Zeddrix Portfolio</title>
</svelte:head>

<div class="space-y-6">
	<!-- Breadcrumb -->
	<Breadcrumb
		items={[
			{ label: 'Dashboard', href: '/admin' },
			{ label: 'Projects', href: '/admin/projects' }
		]}
	/>

	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-text-primary">Projects</h1>
			<p class="text-text-secondary mt-1">Manage your portfolio projects</p>
		</div>
		<a
			href="/admin/projects/new"
			class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
		>
			<span class="material-icons">add</span>
			New Project
		</a>
	</div>

	<!-- Success/Error messages -->
	{#if form?.success}
		<div class="p-4 bg-success/10 border border-success rounded-lg">
			<p class="text-success flex items-center gap-2">
				<span class="material-icons">check_circle</span>
				{form.message}
			</p>
		</div>
	{:else if form?.error}
		<div class="p-4 bg-error/10 border border-error rounded-lg">
			<p class="text-error flex items-center gap-2">
				<span class="material-icons">error</span>
				{form.error}
			</p>
		</div>
	{/if}

	<!-- Search, Filter, and Sort -->
	<div class="bg-surface border border-border rounded-lg p-4">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<!-- Search -->
			<div>
				<label for="search" class="block text-sm font-semibold text-text-primary mb-2">
					Search
				</label>
				<div class="relative">
					<input
						id="search"
						type="text"
						bind:value={searchQuery}
						on:input={updateParams}
						placeholder="Search projects..."
						class="w-full px-4 py-2 pl-10 bg-background border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
					/>
					<span class="material-icons absolute left-3 top-2.5 text-text-secondary">search</span>
				</div>
			</div>

			<!-- Filter -->
			<div>
				<label for="filter" class="block text-sm font-semibold text-text-primary mb-2">
					Filter
				</label>
				<select
					id="filter"
					bind:value={filterValue}
					on:change={updateParams}
					class="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
				>
					<option value="all">All Projects</option>
					<option value="published">Published</option>
					<option value="draft">Drafts</option>
					<option value="featured">Featured</option>
				</select>
			</div>

			<!-- Sort -->
			<div>
				<label for="sort" class="block text-sm font-semibold text-text-primary mb-2">
					Sort By
				</label>
				<select
					id="sort"
					bind:value={sortValue}
					on:change={updateParams}
					class="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
				>
					<option value="updated_at">Recently Updated</option>
					<option value="created_at">Recently Created</option>
					<option value="title">Title (A-Z)</option>
					<option value="display_order">Display Order</option>
				</select>
			</div>
		</div>
	</div>

	<!-- Projects list -->
	{#if data.projects.length === 0}
		<div class="bg-surface border border-border rounded-lg p-12 text-center">
			<span class="material-icons text-6xl text-text-secondary mb-4">folder_open</span>
			<p class="text-text-primary font-semibold mb-2">No projects found</p>
			<p class="text-text-secondary mb-4">
				{searchQuery
					? 'Try adjusting your search or filters'
					: 'Get started by creating your first project'}
			</p>
			<a
				href="/admin/projects/new"
				class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
			>
				<span class="material-icons">add</span>
				Create Project
			</a>
		</div>
	{:else}
		<div class="bg-surface border border-border rounded-lg overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-background border-b border-border">
						<tr>
							<th class="px-4 py-3 text-left text-sm font-semibold text-text-primary w-8">
								<span class="material-icons text-base">drag_indicator</span>
							</th>
							<th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Project</th>
							<th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Status</th>
							<th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Updated</th>
							<th class="px-4 py-3 text-right text-sm font-semibold text-text-primary">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each data.projects as project, index (project.id)}
							<tr
								draggable="true"
								on:dragstart={(e) => handleDragStart(e, index)}
								on:dragover={(e) => handleDragOver(e, index)}
								on:dragleave={handleDragLeave}
								on:drop={(e) => handleDrop(e, index)}
								on:dragend={handleDragEnd}
								class="border-b border-border last:border-b-0 hover:bg-background/50 transition-colors {draggedOverIndex ===
								index
									? 'border-t-2 border-t-primary'
									: ''}"
							>
								<!-- Drag handle -->
								<td class="px-4 py-4">
									<span class="material-icons text-text-secondary cursor-move">drag_indicator</span>
								</td>

								<!-- Project info -->
								<td class="px-4 py-4">
									<div class="flex items-start gap-3">
										<img
											src={project.featured_image_url}
											alt={project.title}
											class="w-16 h-16 object-cover rounded border border-border"
										/>
										<div class="flex-1 min-w-0">
											<h3 class="font-semibold text-text-primary mb-1 truncate">
												{project.title}
											</h3>
											<p class="text-sm text-text-secondary">
												{truncate(project.short_description, 80)}
											</p>
											<div class="flex items-center gap-2 mt-2">
												{#if project.is_featured}
													<span
														class="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded text-xs font-medium"
													>
														<span class="material-icons" style="font-size: 14px;">star</span>
														Featured
													</span>
												{/if}
												<span class="text-xs text-text-secondary">
													{project.tech_stack?.slice(0, 3).join(', ')}
													{project.tech_stack?.length > 3 ? '...' : ''}
												</span>
											</div>
										</div>
									</div>
								</td>

								<!-- Status -->
								<td class="px-4 py-4">
									<form method="POST" action="?/togglePublished" use:enhance>
										<input type="hidden" name="id" value={project.id} />
										<input type="hidden" name="published" value={project.published} />
										<button
											type="submit"
											class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors {project.published
												? 'bg-success/10 text-success hover:bg-success/20'
												: 'bg-warning/10 text-warning hover:bg-warning/20'}"
										>
											<span class="material-icons" style="font-size: 14px;">
												{project.published ? 'check_circle' : 'schedule'}
											</span>
											{project.published ? 'Published' : 'Draft'}
										</button>
									</form>
								</td>

								<!-- Updated date -->
								<td class="px-4 py-4">
									<p class="text-sm text-text-secondary">{formatDate(project.updated_at)}</p>
								</td>

								<!-- Actions -->
								<td class="px-4 py-4">
									<div class="flex items-center justify-end gap-2">
										<form method="POST" action="?/toggleFeatured" use:enhance>
											<input type="hidden" name="id" value={project.id} />
											<input type="hidden" name="is_featured" value={project.is_featured} />
											<button
												type="submit"
												class="p-2 text-text-secondary hover:text-accent hover:bg-accent/10 rounded transition-colors"
												title={project.is_featured ? 'Remove from featured' : 'Mark as featured'}
											>
												<span class="material-icons text-lg">
													{project.is_featured ? 'star' : 'star_outline'}
												</span>
											</button>
										</form>
										<a
											href="/admin/projects/{project.id}/edit"
											class="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded transition-colors"
											title="Edit project"
										>
											<span class="material-icons text-lg">edit</span>
										</a>
										<button
											type="button"
											on:click={() => confirmDelete(project.id)}
											class="p-2 text-text-secondary hover:text-error hover:bg-error/10 rounded transition-colors"
											title="Delete project"
										>
											<span class="material-icons text-lg">delete</span>
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<p class="text-sm text-text-secondary text-center">
			Showing {data.projects.length}
			{data.projects.length === 1 ? 'project' : 'projects'}
		</p>
	{/if}
</div>

<!-- Delete confirmation modal -->
{#if showDeleteModal && deleteProjectId}
	<div
		class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
		role="dialog"
		aria-modal="true"
		aria-labelledby="delete-modal-title"
	>
		<div class="bg-surface border border-border rounded-lg max-w-md w-full p-6">
			<h2 id="delete-modal-title" class="text-xl font-bold text-text-primary mb-2">
				Delete Project
			</h2>
			<p class="text-text-secondary mb-6">
				Are you sure you want to delete this project? This action cannot be undone. All associated
				media will also be deleted from Cloudinary.
			</p>
			<div class="flex items-center justify-end gap-3">
				<button
					type="button"
					on:click={cancelDelete}
					class="px-4 py-2 border border-border text-text-primary rounded-lg hover:bg-background transition-colors"
				>
					Cancel
				</button>
				<form method="POST" action="?/delete" use:enhance on:submit={cancelDelete}>
					<input
						type="hidden"
						name="data"
						value={JSON.stringify({ id: deleteProjectId, confirm: true })}
					/>
					<button
						type="submit"
						class="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-colors"
					>
						Delete Project
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
