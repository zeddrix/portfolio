<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
	import type { PageData, ActionData } from './$types';
	import type { StatsCounter } from '$lib/types/database';

	export let data: PageData;
	export let form: ActionData;

	let loading = false;
	let showNotification = false;
	let notificationMessage = '';
	let notificationType: 'success' | 'error' = 'success';

	// Settings form values
	let displayMode = data.settings.stats_display_mode;
	let countersEnabled = data.settings.stats_counters_enabled;
	let iconsEnabled = data.settings.stats_icons_enabled;

	// Counter modal state
	let showModal = false;
	let editingCounter: StatsCounter | null = null;
	let counterForm = {
		label: '',
		value: '',
		suffix: '',
		icon: ''
	};

	// Delete confirmation
	let showDeleteConfirm = false;
	let deletingCounterId: string | null = null;

	const displayModes = [
		{ value: 'counters', label: 'Counters Only', description: 'Show animated number counters' },
		{ value: 'icons', label: 'Icons Only', description: 'Show stats with icons' },
		{ value: 'categories', label: 'Categories', description: 'Group stats by category' },
		{ value: 'hybrid', label: 'Hybrid', description: 'Combine counters and icons' }
	];

	function openAddModal() {
		editingCounter = null;
		counterForm = { label: '', value: '', suffix: '', icon: '' };
		showModal = true;
	}

	function openEditModal(counter: StatsCounter) {
		editingCounter = counter;
		counterForm = {
			label: counter.label,
			value: counter.value,
			suffix: counter.suffix || '',
			icon: counter.icon || ''
		};
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingCounter = null;
	}

	function confirmDelete(id: string) {
		deletingCounterId = id;
		showDeleteConfirm = true;
	}

	$: if (form) {
		if (form.success) {
			showNotification = true;
			notificationMessage = form.message || 'Success';
			notificationType = 'success';
			invalidateAll();
			closeModal();
			showDeleteConfirm = false;
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
	<title>Stats Section - Admin</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
	<Breadcrumb
		items={[
			{ label: 'Dashboard', href: '/admin' },
			{ label: 'Settings', href: '/admin/settings' },
			{ label: 'Stats Section', href: '/admin/settings/stats' }
		]}
	/>

	<div class="mb-8">
		<h1 class="text-3xl font-bold text-text-primary mb-2">Stats Section</h1>
		<p class="text-text-secondary">Configure the stats display and manage counters.</p>
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

	<div class="space-y-8">
		<!-- Display Settings Form -->
		<form
			method="POST"
			action="?/updateSettings"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
		>
			<section class="bg-surface rounded-lg border border-border p-6">
				<h2 class="text-xl font-semibold text-text-primary mb-6">Display Mode</h2>

				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
					{#each displayModes as mode}
						<label
							class="relative flex flex-col p-4 cursor-pointer rounded-lg border-2 transition-all
							{displayMode === mode.value
								? 'border-primary bg-primary/5'
								: 'border-border hover:border-primary/50'}"
						>
							<input
								type="radio"
								name="stats_display_mode"
								value={mode.value}
								bind:group={displayMode}
								class="sr-only"
							/>
							<span class="font-medium text-text-primary">{mode.label}</span>
							<span class="text-sm text-text-secondary mt-1">{mode.description}</span>
							{#if displayMode === mode.value}
								<span class="absolute top-2 right-2 text-primary">
									<span class="material-icons">check_circle</span>
								</span>
							{/if}
						</label>
					{/each}
				</div>

				<div class="flex flex-wrap gap-6 mb-6">
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							name="stats_counters_enabled"
							value="true"
							bind:checked={countersEnabled}
							class="w-5 h-5 rounded border-border text-primary focus:ring-primary"
						/>
						<span class="text-text-primary">Counters Enabled</span>
					</label>

					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							name="stats_icons_enabled"
							value="true"
							bind:checked={iconsEnabled}
							class="w-5 h-5 rounded border-border text-primary focus:ring-primary"
						/>
						<span class="text-text-primary">Icons Enabled</span>
					</label>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
				>
					{loading ? 'Saving...' : 'Save Settings'}
				</button>
			</section>
		</form>

		<!-- Stats Counters -->
		<section class="bg-surface rounded-lg border border-border p-6">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-semibold text-text-primary">Stats Counters</h2>
				<button
					type="button"
					on:click={openAddModal}
					class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
				>
					<span class="material-icons">add</span>
					Add Counter
				</button>
			</div>

			{#if data.counters.length === 0}
				<p class="text-text-secondary text-center py-8">No counters yet. Add your first one!</p>
			{:else}
				<div class="space-y-3">
					{#each data.counters as counter (counter.id)}
						<div
							class="flex items-center gap-4 p-4 bg-background rounded-lg border border-border
							{!counter.is_visible ? 'opacity-50' : ''}"
						>
							<span class="material-icons text-text-secondary cursor-move">drag_indicator</span>
							<div class="flex-1">
								<span class="font-semibold text-text-primary"
									>{counter.value}{counter.suffix || ''}</span
								>
								<span class="text-text-secondary ml-2">{counter.label}</span>
							</div>
							{#if counter.icon}
								<span class="material-icons text-text-secondary">{counter.icon}</span>
							{/if}
							<div class="flex gap-2">
								<button
									type="button"
									on:click={() => openEditModal(counter)}
									class="p-2 text-text-secondary hover:text-primary"
								>
									<span class="material-icons">edit</span>
								</button>
								<button
									type="button"
									on:click={() => confirmDelete(counter.id)}
									class="p-2 text-text-secondary hover:text-error"
								>
									<span class="material-icons">delete</span>
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</section>
	</div>

	<!-- Counter Modal -->
	{#if showModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div class="bg-surface rounded-lg border border-border p-6 w-full max-w-md mx-4">
				<h3 class="text-xl font-semibold text-text-primary mb-4">
					{editingCounter ? 'Edit Counter' : 'Add Counter'}
				</h3>
				<form
					method="POST"
					action={editingCounter ? '?/updateCounter' : '?/createCounter'}
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					{#if editingCounter}
						<input type="hidden" name="id" value={editingCounter.id} />
						<input type="hidden" name="is_visible" value={editingCounter.is_visible.toString()} />
					{/if}

					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1">Label</label>
							<input
								type="text"
								name="label"
								bind:value={counterForm.label}
								required
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
								placeholder="e.g., Years Experience"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1">Value</label>
							<input
								type="text"
								name="value"
								bind:value={counterForm.value}
								required
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
								placeholder="e.g., 5"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1"
								>Suffix (optional)</label
							>
							<input
								type="text"
								name="suffix"
								bind:value={counterForm.suffix}
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
								placeholder="e.g., +"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1"
								>Icon (optional)</label
							>
							<input
								type="text"
								name="icon"
								bind:value={counterForm.icon}
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
								placeholder="e.g., work_history"
							/>
						</div>
					</div>

					<div class="flex justify-end gap-3 mt-6">
						<button
							type="button"
							on:click={closeModal}
							class="px-4 py-2 text-text-secondary hover:text-text-primary"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
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
				<h3 class="text-xl font-semibold text-text-primary mb-2">Delete Counter?</h3>
				<p class="text-text-secondary mb-6">This action cannot be undone.</p>
				<form
					method="POST"
					action="?/deleteCounter"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					<input type="hidden" name="id" value={deletingCounterId} />
					<div class="flex justify-end gap-3">
						<button
							type="button"
							on:click={() => (showDeleteConfirm = false)}
							class="px-4 py-2 text-text-secondary hover:text-text-primary"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							class="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 disabled:opacity-50"
						>
							Delete
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>
