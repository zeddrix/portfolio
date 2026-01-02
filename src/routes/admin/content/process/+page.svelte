<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
	import type { PageData, ActionData } from './$types';
	import type { DevelopmentProcessStep } from '$lib/types/database';

	export let data: PageData;
	export let form: ActionData;

	let loading = false;
	let showNotification = false;
	let notificationMessage = '';
	let notificationType: 'success' | 'error' = 'success';

	// Modal states
	let showModal = false;
	let editingStep: DevelopmentProcessStep | null = null;
	let stepForm = { title: '', description: '', icon: '' };

	let showDeleteConfirm = false;
	let deletingStepId: string | null = null;

	function openAddModal() {
		editingStep = null;
		stepForm = { title: '', description: '', icon: '' };
		showModal = true;
	}

	function openEditModal(step: DevelopmentProcessStep) {
		editingStep = step;
		stepForm = {
			title: step.title,
			description: step.description,
			icon: step.icon || ''
		};
		showModal = true;
	}

	function closeModals() {
		showModal = false;
		showDeleteConfirm = false;
		editingStep = null;
	}

	function confirmDelete(id: string) {
		deletingStepId = id;
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
	<title>Development Process - Admin</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
	<Breadcrumb
		items={[
			{ label: 'Dashboard', href: '/admin' },
			{ label: 'Content', href: '#' },
			{ label: 'Development Process', href: '/admin/content/process' }
		]}
	/>

	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-3xl font-bold text-text-primary mb-2">Development Process</h1>
			<p class="text-text-secondary">Manage the development process steps shown on the homepage.</p>
		</div>
		<button
			type="button"
			on:click={openAddModal}
			class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
		>
			<span class="material-icons">add</span>
			Add Step
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

	<!-- Process Steps Section -->
	<section class="bg-surface rounded-lg border border-border p-6">
		<h2 class="text-xl font-semibold text-text-primary mb-6">Process Steps</h2>

		{#if data.steps.length === 0}
			<p class="text-text-secondary text-center py-8">No steps yet. Add your first one!</p>
		{:else}
			<div class="space-y-3">
				{#each data.steps as step, index (step.id)}
					<div
						class="flex items-center gap-4 p-4 bg-background rounded-lg border border-border
						{!step.is_visible ? 'opacity-50' : ''}"
					>
						<span class="material-icons text-text-secondary cursor-move">drag_indicator</span>

						<span
							class="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-full font-semibold"
						>
							{index + 1}
						</span>

						{#if step.icon}
							<span class="material-icons text-text-secondary">{step.icon}</span>
						{/if}

						<div class="flex-1">
							<h3 class="font-medium text-text-primary">{step.title}</h3>
							<p class="text-sm text-text-secondary line-clamp-1">{step.description}</p>
						</div>

						<div class="flex gap-1">
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
								<input type="hidden" name="id" value={step.id} />
								<input type="hidden" name="is_visible" value={step.is_visible.toString()} />
								<button
									type="submit"
									disabled={loading}
									class="p-2 text-text-secondary hover:text-primary rounded"
									title={step.is_visible ? 'Hide step' : 'Show step'}
								>
									<span class="material-icons text-sm">
										{step.is_visible ? 'visibility' : 'visibility_off'}
									</span>
								</button>
							</form>
							<button
								type="button"
								on:click={() => openEditModal(step)}
								class="p-2 text-text-secondary hover:text-primary rounded"
								title="Edit"
							>
								<span class="material-icons text-sm">edit</span>
							</button>
							<button
								type="button"
								on:click={() => confirmDelete(step.id)}
								class="p-2 text-text-secondary hover:text-error rounded"
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
					{editingStep ? 'Edit Step' : 'Add Step'}
				</h3>
				<form
					method="POST"
					action={editingStep ? '?/updateStep' : '?/createStep'}
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					{#if editingStep}
						<input type="hidden" name="id" value={editingStep.id} />
						<input type="hidden" name="is_visible" value={editingStep.is_visible.toString()} />
					{/if}

					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1">Title</label>
							<input
								type="text"
								name="title"
								bind:value={stepForm.title}
								required
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
								placeholder="e.g., Discovery"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1">Description</label>
							<textarea
								name="description"
								bind:value={stepForm.description}
								required
								rows="3"
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary resize-none"
								placeholder="Describe this step..."
							></textarea>
						</div>
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1"
								>Icon (optional)</label
							>
							<input
								type="text"
								name="icon"
								bind:value={stepForm.icon}
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
								placeholder="e.g., search (Material Icons name)"
							/>
							<p class="text-xs text-text-secondary mt-1">
								Use Material Icons names (e.g., search, code, rocket_launch)
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
				<h3 class="text-xl font-semibold text-text-primary mb-2">Delete Step?</h3>
				<p class="text-text-secondary mb-6">This action cannot be undone.</p>
				<form
					method="POST"
					action="?/deleteStep"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					<input type="hidden" name="id" value={deletingStepId} />
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
