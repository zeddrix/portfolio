<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
	import type { PageData, ActionData } from './$types';
	import type { ProjectDeliverable } from '$lib/types/database';

	export let data: PageData;
	export let form: ActionData;

	let loading = false;
	let showNotification = false;
	let notificationMessage = '';
	let notificationType: 'success' | 'error' = 'success';

	// Modal states
	let showModal = false;
	let editingDeliverable: ProjectDeliverable | null = null;
	let deliverableForm = { title: '', description: '', icon: '' };

	let showDeleteConfirm = false;
	let deletingDeliverableId: string | null = null;

	function openAddModal() {
		editingDeliverable = null;
		deliverableForm = { title: '', description: '', icon: '' };
		showModal = true;
	}

	function openEditModal(deliverable: ProjectDeliverable) {
		editingDeliverable = deliverable;
		deliverableForm = {
			title: deliverable.title,
			description: deliverable.description,
			icon: deliverable.icon || ''
		};
		showModal = true;
	}

	function closeModals() {
		showModal = false;
		showDeleteConfirm = false;
		editingDeliverable = null;
	}

	function confirmDelete(id: string) {
		deletingDeliverableId = id;
		showDeleteConfirm = true;
	}

	$: if (form) {
		if (form.success) {
			showNotification = true;
			notificationMessage = form.message || 'Success';
			notificationType = 'success';
			invalidateAll();
			closeModals();
			setTimeout(() => (showNotification = false), 5000);
		} else if (form.error) {
			showNotification = true;
			notificationMessage = form.error;
			notificationType = 'error';
			setTimeout(() => (showNotification = false), 5000);
		}
	}
</script>

<svelte:head>
	<title>Deliverables - Admin</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
	<Breadcrumb
		items={[
			{ label: 'Dashboard', href: '/admin' },
			{ label: 'Content', href: '#' },
			{ label: 'Deliverables', href: '/admin/content/deliverables' }
		]}
	/>

	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-3xl font-bold text-text-primary mb-2">Deliverables</h1>
			<p class="text-text-secondary">Manage project deliverables shown on the homepage.</p>
		</div>
		<button
			type="button"
			on:click={openAddModal}
			class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
		>
			<span class="material-icons">add</span>
			Add Deliverable
		</button>
	</div>

	<!-- Notification -->
	{#if showNotification}
		<div class="fixed top-4 right-4 z-50 max-w-md" role="alert">
			<div
				class="p-4 rounded-lg shadow-xl border flex items-start gap-3
				{notificationType === 'success'
					? 'bg-success/10 border-success text-success'
					: 'bg-error/10 border-error text-error'}"
			>
				<span class="material-icons"
					>{notificationType === 'success' ? 'check_circle' : 'error'}</span
				>
				<p class="font-medium">{notificationMessage}</p>
				<button type="button" on:click={() => (showNotification = false)} class="ml-auto">
					<span class="material-icons text-sm">close</span>
				</button>
			</div>
		</div>
	{/if}

	<!-- Deliverables Section -->
	<section class="bg-surface rounded-lg border border-border p-6">
		<h2 class="text-xl font-semibold text-text-primary mb-6">Project Deliverables</h2>

		{#if data.deliverables.length === 0}
			<p class="text-text-secondary text-center py-8">No deliverables yet. Add your first one!</p>
		{:else}
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.deliverables as deliverable (deliverable.id)}
					<div
						class="relative p-4 bg-background rounded-lg border border-border
						{!deliverable.is_visible ? 'opacity-50' : ''}"
					>
						<div class="flex items-start gap-3 mb-2">
							{#if deliverable.icon}
								<span class="material-icons text-2xl text-primary">{deliverable.icon}</span>
							{:else}
								<span class="material-icons text-2xl text-text-secondary">inventory_2</span>
							{/if}
							<div class="flex-1">
								<h3 class="font-semibold text-text-primary">{deliverable.title}</h3>
								<p class="text-sm text-text-secondary line-clamp-2">{deliverable.description}</p>
							</div>
						</div>

						<div class="flex justify-end gap-1 mt-3">
							<form
								method="POST"
								action="?/toggleVisibility"
								use:enhance={() => {
									loading = true;
									return async ({ update }) => {
										await update();
										loading = false;
									};
								}}
							>
								<input type="hidden" name="id" value={deliverable.id} />
								<input type="hidden" name="is_visible" value={deliverable.is_visible.toString()} />
								<button
									type="submit"
									disabled={loading}
									class="p-1.5 text-text-secondary hover:text-primary rounded"
									title={deliverable.is_visible ? 'Hide' : 'Show'}
								>
									<span class="material-icons text-sm">
										{deliverable.is_visible ? 'visibility' : 'visibility_off'}
									</span>
								</button>
							</form>
							<button
								type="button"
								on:click={() => openEditModal(deliverable)}
								class="p-1.5 text-text-secondary hover:text-primary rounded"
								title="Edit"
							>
								<span class="material-icons text-sm">edit</span>
							</button>
							<button
								type="button"
								on:click={() => confirmDelete(deliverable.id)}
								class="p-1.5 text-text-secondary hover:text-error rounded"
								title="Delete"
							>
								<span class="material-icons text-sm">delete</span>
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<!-- Add/Edit Modal -->
	{#if showModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div class="bg-surface rounded-lg border border-border p-6 w-full max-w-md mx-4">
				<h3 class="text-xl font-semibold text-text-primary mb-4">
					{editingDeliverable ? 'Edit Deliverable' : 'Add Deliverable'}
				</h3>
				<form
					method="POST"
					action={editingDeliverable ? '?/updateDeliverable' : '?/createDeliverable'}
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					{#if editingDeliverable}
						<input type="hidden" name="id" value={editingDeliverable.id} />
						<input
							type="hidden"
							name="is_visible"
							value={editingDeliverable.is_visible.toString()}
						/>
					{/if}

					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1">Title</label>
							<input
								type="text"
								name="title"
								bind:value={deliverableForm.title}
								required
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
								placeholder="e.g., Custom Design"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1">Description</label>
							<textarea
								name="description"
								bind:value={deliverableForm.description}
								required
								rows="3"
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary resize-none"
								placeholder="Describe this deliverable..."
							></textarea>
						</div>
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1"
								>Icon (optional)</label
							>
							<input
								type="text"
								name="icon"
								bind:value={deliverableForm.icon}
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
								placeholder="e.g., design_services (Material Icons name)"
							/>
							<p class="text-xs text-text-secondary mt-1">
								Use Material Icons names (e.g., design_services, code, speed)
							</p>
						</div>
					</div>

					<div class="flex justify-end gap-3 mt-6">
						<button type="button" on:click={closeModals} class="px-4 py-2 text-text-secondary">
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							class="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
						>
							{loading ? 'Saving...' : 'Save'}
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- Delete Confirmation -->
	{#if showDeleteConfirm}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div class="bg-surface rounded-lg border border-border p-6 w-full max-w-sm mx-4">
				<h3 class="text-xl font-semibold text-text-primary mb-2">Delete Deliverable?</h3>
				<p class="text-text-secondary mb-6">This action cannot be undone.</p>
				<form
					method="POST"
					action="?/deleteDeliverable"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					<input type="hidden" name="id" value={deletingDeliverableId} />
					<div class="flex justify-end gap-3">
						<button type="button" on:click={closeModals} class="px-4 py-2 text-text-secondary">
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							class="px-4 py-2 bg-error text-white rounded-lg disabled:opacity-50"
						>
							Delete
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>
