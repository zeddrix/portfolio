<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
	import CertificationForm from '$lib/components/admin/CertificationForm.svelte';
	import ExperienceForm from '$lib/components/admin/ExperienceForm.svelte';
	import type { PageData, ActionData } from './$types';
	import type { Database } from '$lib/types/database';

	type Certification = Database['public']['Tables']['certifications']['Row'];
	type Experience = Database['public']['Tables']['experiences']['Row'];

	export let data: PageData;
	export let form: ActionData;

	// ==================== CERTIFICATIONS ====================

	// Certification modal state
	let showCertForm = false;
	let editingCert: Certification | null = null;
	let showCertDeleteConfirm = false;
	let deletingCert: Certification | null = null;

	// Certification drag state
	let draggedCert: Certification | null = null;

	/**
	 * Open create certification form
	 */
	function openCreateCertForm() {
		editingCert = null;
		showCertForm = true;
	}

	/**
	 * Open edit certification form
	 */
	function openEditCertForm(cert: Certification) {
		editingCert = cert;
		showCertForm = true;
	}

	/**
	 * Close certification form
	 */
	function closeCertForm() {
		showCertForm = false;
		editingCert = null;
	}

	/**
	 * Handle certification form submission
	 */
	async function handleCertFormSubmit(formData: FormData) {
		const action = editingCert ? '?/updateCertification' : '?/createCertification';

		try {
			const response = await fetch(action, {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				closeCertForm();
				await invalidateAll();
			}
		} catch (error) {
			console.error('Error submitting certification form:', error);
		}
	}

	/**
	 * Open certification delete confirmation
	 */
	function openCertDeleteConfirm(cert: Certification) {
		deletingCert = cert;
		showCertDeleteConfirm = true;
	}

	/**
	 * Close certification delete confirmation
	 */
	function closeCertDeleteConfirm() {
		showCertDeleteConfirm = false;
		deletingCert = null;
	}

	/**
	 * Handle certification drag start
	 */
	function handleCertDragStart(event: DragEvent, cert: Certification) {
		draggedCert = cert;
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
		}
	}

	/**
	 * Handle certification drag over
	 */
	function handleCertDragOver(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	}

	/**
	 * Handle certification drop
	 */
	async function handleCertDrop(event: DragEvent, targetCert: Certification) {
		event.preventDefault();

		if (!draggedCert || draggedCert.id === targetCert.id) {
			draggedCert = null;
			return;
		}

		const certifications = data.certifications || [];
		const draggedIndex = certifications.findIndex((c) => c.id === draggedCert?.id);
		const targetIndex = certifications.findIndex((c) => c.id === targetCert.id);

		if (draggedIndex === -1 || targetIndex === -1) return;

		// Reorder array
		const newOrder = [...certifications];
		const [removed] = newOrder.splice(draggedIndex, 1);
		newOrder.splice(targetIndex, 0, removed);

		// Create update data
		const updates = newOrder.map((cert, index) => ({
			id: cert.id,
			display_order: index
		}));

		// Submit reorder
		const formData = new FormData();
		formData.append('certifications', JSON.stringify(updates));

		try {
			const response = await fetch('?/reorderCertifications', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				await invalidateAll();
			}
		} catch (error) {
			console.error('Error reordering certifications:', error);
		}

		draggedCert = null;
	}

	/**
	 * Handle certification drag end
	 */
	function handleCertDragEnd() {
		draggedCert = null;
	}

	/**
	 * Format date for display
	 */
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
	}

	// ==================== EXPERIENCES ====================

	// Experience modal state
	let showExpForm = false;
	let editingExp: Experience | null = null;
	let showExpDeleteConfirm = false;
	let deletingExp: Experience | null = null;

	// Experience drag state
	let draggedExp: Experience | null = null;

	/**
	 * Open create experience form
	 */
	function openCreateExpForm() {
		editingExp = null;
		showExpForm = true;
	}

	/**
	 * Open edit experience form
	 */
	function openEditExpForm(exp: Experience) {
		editingExp = exp;
		showExpForm = true;
	}

	/**
	 * Close experience form
	 */
	function closeExpForm() {
		showExpForm = false;
		editingExp = null;
	}

	/**
	 * Handle experience form submission
	 */
	async function handleExpFormSubmit(formData: FormData) {
		const action = editingExp ? '?/updateExperience' : '?/createExperience';

		try {
			const response = await fetch(action, {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				closeExpForm();
				await invalidateAll();
			}
		} catch (error) {
			console.error('Error submitting experience form:', error);
		}
	}

	/**
	 * Open experience delete confirmation
	 */
	function openExpDeleteConfirm(exp: Experience) {
		deletingExp = exp;
		showExpDeleteConfirm = true;
	}

	/**
	 * Close experience delete confirmation
	 */
	function closeExpDeleteConfirm() {
		showExpDeleteConfirm = false;
		deletingExp = null;
	}

	/**
	 * Handle experience drag start
	 */
	function handleExpDragStart(event: DragEvent, exp: Experience) {
		draggedExp = exp;
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
		}
	}

	/**
	 * Handle experience drag over
	 */
	function handleExpDragOver(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	}

	/**
	 * Handle experience drop
	 */
	async function handleExpDrop(event: DragEvent, targetExp: Experience) {
		event.preventDefault();

		if (!draggedExp || draggedExp.id === targetExp.id) {
			draggedExp = null;
			return;
		}

		const experiences = data.experiences || [];
		const draggedIndex = experiences.findIndex((e) => e.id === draggedExp?.id);
		const targetIndex = experiences.findIndex((e) => e.id === targetExp.id);

		if (draggedIndex === -1 || targetIndex === -1) return;

		// Reorder array
		const newOrder = [...experiences];
		const [removed] = newOrder.splice(draggedIndex, 1);
		newOrder.splice(targetIndex, 0, removed);

		// Create update data
		const updates = newOrder.map((exp, index) => ({
			id: exp.id,
			display_order: index
		}));

		// Submit reorder
		const formData = new FormData();
		formData.append('experiences', JSON.stringify(updates));

		try {
			const response = await fetch('?/reorderExperiences', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				await invalidateAll();
			}
		} catch (error) {
			console.error('Error reordering experiences:', error);
		}

		draggedExp = null;
	}

	/**
	 * Handle experience drag end
	 */
	function handleExpDragEnd() {
		draggedExp = null;
	}
</script>

<svelte:head>
	<title>Manage Certifications & Experience - Admin - Zeddrix Portfolio</title>
</svelte:head>

<div class="py-6 px-4 sm:px-6 lg:px-8">
	<Breadcrumb items={[{ label: 'Certifications & Experience' }]} />

	<!-- Header -->
	<div class="mb-6">
		<h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:tracking-tight">
			Certifications & Experience
		</h2>
		<p class="mt-1 text-sm text-gray-500">
			Manage your professional certifications and work experience. Drag and drop to reorder.
		</p>
	</div>

	<!-- Success/Error Messages -->
	{#if form?.success}
		<div class="mb-6 rounded-md bg-green-50 p-4">
			<div class="flex">
				<span class="material-icons text-green-400">check_circle</span>
				<div class="ml-3">
					<p class="text-sm font-medium text-green-800">{form.message}</p>
				</div>
			</div>
		</div>
	{/if}

	{#if form?.error}
		<div class="mb-6 rounded-md bg-red-50 p-4">
			<div class="flex">
				<span class="material-icons text-red-400">error</span>
				<div class="ml-3">
					<p class="text-sm font-medium text-red-800">{form.error}</p>
				</div>
			</div>
		</div>
	{/if}

	<div class="space-y-8">
		<!-- ==================== CERTIFICATIONS SECTION ==================== -->
		<div class="bg-white shadow rounded-lg overflow-hidden">
			<!-- Section Header -->
			<div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<span class="material-icons text-gray-600 mr-3">workspace_premium</span>
						<div>
							<h3 class="text-lg font-semibold text-gray-900">Certifications</h3>
							<p class="text-sm text-gray-500">Professional certifications and credentials</p>
						</div>
					</div>
					<button
						type="button"
						on:click={openCreateCertForm}
						class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
					>
						<span class="material-icons text-base mr-1">add</span>
						Add Certification
					</button>
				</div>
			</div>

			<!-- Certifications List -->
			<div class="divide-y divide-gray-200">
				{#if (data.certifications || []).length === 0}
					<div class="px-6 py-12 text-center">
						<span class="material-icons text-gray-400 text-5xl mb-2">workspace_premium</span>
						<p class="text-gray-500 text-sm mb-3">No certifications yet.</p>
						<button
							type="button"
							on:click={openCreateCertForm}
							class="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
						>
							<span class="material-icons text-base mr-1">add</span>
							Add your first certification
						</button>
					</div>
				{:else}
					{#each data.certifications as cert (cert.id)}
						<div
							role="listitem"
							draggable="true"
							on:dragstart={(e) => handleCertDragStart(e, cert)}
							on:dragover={handleCertDragOver}
							on:drop={(e) => handleCertDrop(e, cert)}
							on:dragend={handleCertDragEnd}
							class="px-6 py-4 hover:bg-gray-50 transition-colors cursor-move"
							class:bg-blue-50={draggedCert?.id === cert.id}
						>
							<div class="flex items-start">
								<!-- Drag Handle -->
								<span class="material-icons text-gray-400 mr-3 cursor-move mt-1"
									>drag_indicator</span
								>

								<!-- Certification Info -->
								<div class="flex-1 min-w-0">
									<div class="flex items-start justify-between">
										<div>
											<p class="text-sm font-semibold text-gray-900">{cert.title}</p>
											<p class="text-sm text-gray-600 mt-1">{cert.issuer}</p>
											<div
												class="mt-2 flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500"
											>
												<span class="flex items-center">
													<span class="material-icons text-xs mr-1">event</span>
													{formatDate(cert.issue_date)}
													{#if cert.expiry_date}
														- {formatDate(cert.expiry_date)}
													{:else}
														- No expiration
													{/if}
												</span>
												{#if cert.credential_id}
													<span class="flex items-center">
														<span class="material-icons text-xs mr-1">badge</span>
														ID: {cert.credential_id}
													</span>
												{/if}
												{#if cert.credential_url}
													<a
														href={cert.credential_url}
														target="_blank"
														rel="noopener noreferrer"
														class="flex items-center text-blue-600 hover:text-blue-500"
													>
														<span class="material-icons text-xs mr-1">link</span>
														View Credential
													</a>
												{/if}
											</div>
										</div>
									</div>
								</div>

								<!-- Actions -->
								<div class="ml-4 flex items-center space-x-2">
									<!-- Edit -->
									<button
										type="button"
										on:click={() => openEditCertForm(cert)}
										class="p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-gray-100"
										title="Edit certification"
									>
										<span class="material-icons text-xl">edit</span>
									</button>

									<!-- Delete -->
									<button
										type="button"
										on:click={() => openCertDeleteConfirm(cert)}
										class="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-gray-100"
										title="Delete certification"
									>
										<span class="material-icons text-xl">delete</span>
									</button>
								</div>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>

		<!-- ==================== EXPERIENCES SECTION ==================== -->
		<div class="bg-white shadow rounded-lg overflow-hidden">
			<!-- Section Header -->
			<div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<span class="material-icons text-gray-600 mr-3">work</span>
						<div>
							<h3 class="text-lg font-semibold text-gray-900">Work Experience</h3>
							<p class="text-sm text-gray-500">Professional work history and roles</p>
						</div>
					</div>
					<button
						type="button"
						on:click={openCreateExpForm}
						class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
					>
						<span class="material-icons text-base mr-1">add</span>
						Add Experience
					</button>
				</div>
			</div>

			<!-- Experiences List -->
			<div class="divide-y divide-gray-200">
				{#if (data.experiences || []).length === 0}
					<div class="px-6 py-12 text-center">
						<span class="material-icons text-gray-400 text-5xl mb-2">work</span>
						<p class="text-gray-500 text-sm mb-3">No work experience yet.</p>
						<button
							type="button"
							on:click={openCreateExpForm}
							class="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
						>
							<span class="material-icons text-base mr-1">add</span>
							Add your first experience
						</button>
					</div>
				{:else}
					{#each data.experiences as exp (exp.id)}
						<div
							role="listitem"
							draggable="true"
							on:dragstart={(e) => handleExpDragStart(e, exp)}
							on:dragover={handleExpDragOver}
							on:drop={(e) => handleExpDrop(e, exp)}
							on:dragend={handleExpDragEnd}
							class="px-6 py-4 hover:bg-gray-50 transition-colors cursor-move"
							class:bg-blue-50={draggedExp?.id === exp.id}
						>
							<div class="flex items-start">
								<!-- Drag Handle -->
								<span class="material-icons text-gray-400 mr-3 cursor-move mt-1"
									>drag_indicator</span
								>

								<!-- Experience Info -->
								<div class="flex-1 min-w-0">
									<div class="flex items-start justify-between">
										<div>
											<p class="text-sm font-semibold text-gray-900">{exp.position}</p>
											<p class="text-sm text-gray-600 mt-1">{exp.company}</p>
											<div
												class="mt-2 flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500"
											>
												<span class="flex items-center">
													<span class="material-icons text-xs mr-1">event</span>
													{formatDate(exp.start_date)}
													-
													{#if exp.is_current}
														<span class="text-blue-600 font-medium ml-1">Present</span>
													{:else if exp.end_date}
														{formatDate(exp.end_date)}
													{/if}
												</span>
												{#if exp.location}
													<span class="flex items-center">
														<span class="material-icons text-xs mr-1">location_on</span>
														{exp.location}
													</span>
												{/if}
												{#if exp.is_current}
													<span
														class="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
													>
														Current
													</span>
												{/if}
											</div>
											<p class="mt-2 text-sm text-gray-700 line-clamp-2">{exp.description}</p>
										</div>
									</div>
								</div>

								<!-- Actions -->
								<div class="ml-4 flex items-center space-x-2">
									<!-- Edit -->
									<button
										type="button"
										on:click={() => openEditExpForm(exp)}
										class="p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-gray-100"
										title="Edit experience"
									>
										<span class="material-icons text-xl">edit</span>
									</button>

									<!-- Delete -->
									<button
										type="button"
										on:click={() => openExpDeleteConfirm(exp)}
										class="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-gray-100"
										title="Delete experience"
									>
										<span class="material-icons text-xl">delete</span>
									</button>
								</div>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>

	<!-- Summary -->
	<div class="mt-6 text-center text-sm text-gray-500">
		{data.certifications?.length || 0}
		{(data.certifications?.length || 0) === 1 ? 'certification' : 'certifications'} •
		{data.experiences?.length || 0}
		{(data.experiences?.length || 0) === 1 ? 'experience' : 'experiences'}
	</div>
</div>

<!-- Certification Form Modal -->
{#if showCertForm}
	<CertificationForm
		certification={editingCert}
		onCancel={closeCertForm}
		onSubmit={handleCertFormSubmit}
	/>
{/if}

<!-- Certification Delete Confirmation Modal -->
{#if showCertDeleteConfirm && deletingCert}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<!-- Backdrop -->
			<button
				type="button"
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				on:click={closeCertDeleteConfirm}
				aria-label="Close modal"
			></button>

			<!-- Modal -->
			<div
				class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
			>
				<div class="sm:flex sm:items-start">
					<div
						class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
					>
						<span class="material-icons text-red-600">warning</span>
					</div>
					<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
						<h3 class="text-lg font-semibold leading-6 text-gray-900">Delete Certification</h3>
						<div class="mt-2">
							<p class="text-sm text-gray-500">
								Are you sure you want to delete <strong>{deletingCert.title}</strong>? This action
								cannot be undone.
							</p>
						</div>
					</div>
				</div>
				<div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
					<form method="POST" action="?/deleteCertification" use:enhance>
						<input type="hidden" name="id" value={deletingCert.id} />
						<button
							type="submit"
							class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto"
							on:click={closeCertDeleteConfirm}
						>
							Delete
						</button>
					</form>
					<button
						type="button"
						on:click={closeCertDeleteConfirm}
						class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Experience Form Modal -->
{#if showExpForm}
	<ExperienceForm experience={editingExp} onCancel={closeExpForm} onSubmit={handleExpFormSubmit} />
{/if}

<!-- Experience Delete Confirmation Modal -->
{#if showExpDeleteConfirm && deletingExp}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<!-- Backdrop -->
			<button
				type="button"
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				on:click={closeExpDeleteConfirm}
				aria-label="Close modal"
			></button>

			<!-- Modal -->
			<div
				class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
			>
				<div class="sm:flex sm:items-start">
					<div
						class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
					>
						<span class="material-icons text-red-600">warning</span>
					</div>
					<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
						<h3 class="text-lg font-semibold leading-6 text-gray-900">Delete Experience</h3>
						<div class="mt-2">
							<p class="text-sm text-gray-500">
								Are you sure you want to delete <strong
									>{deletingExp.position} at {deletingExp.company}</strong
								>? This action cannot be undone.
							</p>
						</div>
					</div>
				</div>
				<div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
					<form method="POST" action="?/deleteExperience" use:enhance>
						<input type="hidden" name="id" value={deletingExp.id} />
						<button
							type="submit"
							class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto"
							on:click={closeExpDeleteConfirm}
						>
							Delete
						</button>
					</form>
					<button
						type="button"
						on:click={closeExpDeleteConfirm}
						class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
