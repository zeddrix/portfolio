<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
	import type { PageData, ActionData } from './$types';
	import type { AITool, AIProductivityStat } from '$lib/types/database';

	export let data: PageData;
	export let form: ActionData;

	let loading = false;
	let showNotification = false;
	let notificationMessage = '';
	let notificationType: 'success' | 'error' = 'success';

	// Tab state
	let activeTab: 'tools' | 'stats' = 'tools';

	// Tool modal states
	let showToolModal = false;
	let editingTool: AITool | null = null;
	let toolForm = { name: '', description: '', icon_url: '', website_url: '' };

	// Stat modal states
	let showStatModal = false;
	let editingStat: AIProductivityStat | null = null;
	let statForm = { label: '', value: '', description: '' };

	// Delete confirmation
	let showDeleteConfirm = false;
	let deleteType: 'tool' | 'stat' = 'tool';
	let deleteId: string | null = null;

	function openToolModal(tool?: AITool) {
		editingTool = tool || null;
		toolForm = {
			name: tool?.name || '',
			description: tool?.description || '',
			icon_url: tool?.icon_url || '',
			website_url: tool?.website_url || ''
		};
		showToolModal = true;
	}

	function openStatModal(stat?: AIProductivityStat) {
		editingStat = stat || null;
		statForm = {
			label: stat?.label || '',
			value: stat?.value || '',
			description: stat?.description || ''
		};
		showStatModal = true;
	}

	function closeModals() {
		showToolModal = false;
		showStatModal = false;
		showDeleteConfirm = false;
		editingTool = null;
		editingStat = null;
	}

	function confirmDelete(type: 'tool' | 'stat', id: string) {
		deleteType = type;
		deleteId = id;
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
	<title>AI Showcase - Admin</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
	<Breadcrumb
		items={[
			{ label: 'Dashboard', href: '/admin' },
			{ label: 'Content', href: '#' },
			{ label: 'AI Showcase', href: '/admin/content/ai-showcase' }
		]}
	/>

	<div class="mb-8">
		<h1 class="text-3xl font-bold text-text-primary mb-2">AI Showcase</h1>
		<p class="text-text-secondary">Manage AI tools and productivity stats shown on the homepage.</p>
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

	<!-- Tabs -->
	<div class="flex gap-2 mb-6">
		<button
			type="button"
			on:click={() => (activeTab = 'tools')}
			class="px-4 py-2 rounded-lg font-medium transition-all
			{activeTab === 'tools'
				? 'bg-primary text-white'
				: 'bg-surface text-text-secondary hover:text-text-primary'}"
		>
			AI Tools
		</button>
		<button
			type="button"
			on:click={() => (activeTab = 'stats')}
			class="px-4 py-2 rounded-lg font-medium transition-all
			{activeTab === 'stats'
				? 'bg-primary text-white'
				: 'bg-surface text-text-secondary hover:text-text-primary'}"
		>
			Productivity Stats
		</button>
	</div>

	<!-- AI Tools Tab -->
	{#if activeTab === 'tools'}
		<section class="bg-surface rounded-lg border border-border p-6">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-semibold text-text-primary">AI Tools</h2>
				<button
					type="button"
					on:click={() => openToolModal()}
					class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
				>
					<span class="material-icons">add</span>
					Add Tool
				</button>
			</div>

			{#if data.tools.length === 0}
				<p class="text-text-secondary text-center py-8">No AI tools yet. Add your first one!</p>
			{:else}
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each data.tools as tool (tool.id)}
						<div
							class="p-4 bg-background rounded-lg border border-border
							{!tool.is_visible ? 'opacity-50' : ''}"
						>
							<div class="flex items-start gap-3 mb-3">
								{#if tool.icon_url}
									<img
										src={tool.icon_url}
										alt={tool.name}
										class="w-10 h-10 rounded object-contain"
									/>
								{:else}
									<span class="material-icons text-3xl text-primary">smart_toy</span>
								{/if}
								<div class="flex-1 min-w-0">
									<h3 class="font-semibold text-text-primary truncate">{tool.name}</h3>
									{#if tool.description}
										<p class="text-sm text-text-secondary line-clamp-2">{tool.description}</p>
									{/if}
								</div>
							</div>

							<div class="flex justify-end gap-1">
								<form
									method="POST"
									action="?/toggleToolVisibility"
									use:enhance={() => {
										loading = true;
										return async ({ update }) => {
											await update();
											loading = false;
										};
									}}
								>
									<input type="hidden" name="id" value={tool.id} />
									<input type="hidden" name="is_visible" value={tool.is_visible.toString()} />
									<button
										type="submit"
										disabled={loading}
										class="p-1.5 text-text-secondary hover:text-primary rounded"
										title={tool.is_visible ? 'Hide' : 'Show'}
									>
										<span class="material-icons text-sm">
											{tool.is_visible ? 'visibility' : 'visibility_off'}
										</span>
									</button>
								</form>
								<button
									type="button"
									on:click={() => openToolModal(tool)}
									class="p-1.5 text-text-secondary hover:text-primary rounded"
									title="Edit"
								>
									<span class="material-icons text-sm">edit</span>
								</button>
								<button
									type="button"
									on:click={() => confirmDelete('tool', tool.id)}
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
	{/if}

	<!-- Productivity Stats Tab -->
	{#if activeTab === 'stats'}
		<section class="bg-surface rounded-lg border border-border p-6">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-semibold text-text-primary">Productivity Stats</h2>
				<button
					type="button"
					on:click={() => openStatModal()}
					class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
				>
					<span class="material-icons">add</span>
					Add Stat
				</button>
			</div>

			{#if data.stats.length === 0}
				<p class="text-text-secondary text-center py-8">No stats yet. Add your first one!</p>
			{:else}
				<div class="space-y-3">
					{#each data.stats as stat (stat.id)}
						<div
							class="flex items-center gap-4 p-4 bg-background rounded-lg border border-border
							{!stat.is_visible ? 'opacity-50' : ''}"
						>
							<div class="flex-1">
								<span class="font-semibold text-text-primary text-lg">{stat.value}</span>
								<span class="text-text-secondary ml-2">{stat.label}</span>
								{#if stat.description}
									<p class="text-xs text-text-secondary mt-1">{stat.description}</p>
								{/if}
							</div>

							<div class="flex gap-1">
								<form
									method="POST"
									action="?/toggleStatVisibility"
									use:enhance={() => {
										loading = true;
										return async ({ update }) => {
											await update();
											loading = false;
										};
									}}
								>
									<input type="hidden" name="id" value={stat.id} />
									<input type="hidden" name="is_visible" value={stat.is_visible.toString()} />
									<button
										type="submit"
										disabled={loading}
										class="p-1.5 text-text-secondary hover:text-primary rounded"
										title={stat.is_visible ? 'Hide' : 'Show'}
									>
										<span class="material-icons text-sm">
											{stat.is_visible ? 'visibility' : 'visibility_off'}
										</span>
									</button>
								</form>
								<button
									type="button"
									on:click={() => openStatModal(stat)}
									class="p-1.5 text-text-secondary hover:text-primary rounded"
									title="Edit"
								>
									<span class="material-icons text-sm">edit</span>
								</button>
								<button
									type="button"
									on:click={() => confirmDelete('stat', stat.id)}
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
	{/if}

	<!-- Tool Modal -->
	{#if showToolModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div class="bg-surface rounded-lg border border-border p-6 w-full max-w-md mx-4">
				<h3 class="text-xl font-semibold text-text-primary mb-4">
					{editingTool ? 'Edit Tool' : 'Add Tool'}
				</h3>
				<form
					method="POST"
					action={editingTool ? '?/updateTool' : '?/createTool'}
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					{#if editingTool}
						<input type="hidden" name="id" value={editingTool.id} />
						<input type="hidden" name="is_visible" value={editingTool.is_visible.toString()} />
					{/if}

					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1">Name</label>
							<input
								type="text"
								name="name"
								bind:value={toolForm.name}
								required
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
								placeholder="e.g., ChatGPT"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1"
								>Description (optional)</label
							>
							<textarea
								name="description"
								bind:value={toolForm.description}
								rows="2"
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary resize-none"
								placeholder="Brief description..."
							></textarea>
						</div>
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1"
								>Icon URL (optional)</label
							>
							<input
								type="url"
								name="icon_url"
								bind:value={toolForm.icon_url}
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
								placeholder="https://..."
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1"
								>Website URL (optional)</label
							>
							<input
								type="url"
								name="website_url"
								bind:value={toolForm.website_url}
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
								placeholder="https://..."
							/>
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

	<!-- Stat Modal -->
	{#if showStatModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div class="bg-surface rounded-lg border border-border p-6 w-full max-w-md mx-4">
				<h3 class="text-xl font-semibold text-text-primary mb-4">
					{editingStat ? 'Edit Stat' : 'Add Stat'}
				</h3>
				<form
					method="POST"
					action={editingStat ? '?/updateStat' : '?/createStat'}
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					{#if editingStat}
						<input type="hidden" name="id" value={editingStat.id} />
						<input type="hidden" name="is_visible" value={editingStat.is_visible.toString()} />
					{/if}

					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1">Label</label>
							<input
								type="text"
								name="label"
								bind:value={statForm.label}
								required
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
								placeholder="e.g., Faster Development"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1">Value</label>
							<input
								type="text"
								name="value"
								bind:value={statForm.value}
								required
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
								placeholder="e.g., 50"
							/>
						</div>
						<div>
							<label
								for="stat_description"
								class="block text-sm font-medium text-text-secondary mb-1"
								>Description (optional)</label
							>
							<textarea
								id="stat_description"
								name="description"
								bind:value={statForm.description}
								rows="2"
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary resize-none"
								placeholder="e.g., AI helps catch and prevent bugs before they reach production."
							></textarea>
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
				<h3 class="text-xl font-semibold text-text-primary mb-2">Delete {deleteType}?</h3>
				<p class="text-text-secondary mb-6">This action cannot be undone.</p>
				<form
					method="POST"
					action={deleteType === 'tool' ? '?/deleteTool' : '?/deleteStat'}
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					<input type="hidden" name="id" value={deleteId} />
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
