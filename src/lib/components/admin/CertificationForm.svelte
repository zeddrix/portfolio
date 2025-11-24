<script lang="ts">
	import type { Database } from '$lib/types/database';

	type Certification = Database['public']['Tables']['certifications']['Row'];

	export let certification: Certification | null = null;
	export let onCancel: () => void;
	export let onSubmit: (formData: FormData) => Promise<void>;

	// Form state
	let title = certification?.title || '';
	let issuer = certification?.issuer || '';
	let issueDate = certification?.issue_date || '';
	let expiryDate = certification?.expiry_date || '';
	let credentialUrl = certification?.credential_url || '';
	let credentialId = certification?.credential_id || '';

	let submitting = false;
	let errors: Record<string, string> = {};

	/**
	 * Validate form
	 */
	function validateForm(): boolean {
		errors = {};

		if (!title.trim()) {
			errors.title = 'Title is required';
		}
		if (!issuer.trim()) {
			errors.issuer = 'Issuer is required';
		}
		if (!issueDate) {
			errors.issueDate = 'Issue date is required';
		}
		if (credentialUrl && !credentialUrl.startsWith('http')) {
			errors.credentialUrl = 'Must be a valid URL';
		}

		return Object.keys(errors).length === 0;
	}

	/**
	 * Handle form submission
	 */
	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!validateForm()) {
			return;
		}

		submitting = true;

		const formData = new FormData();
		if (certification) {
			formData.append('id', certification.id);
		}
		formData.append('title', title.trim());
		formData.append('issuer', issuer.trim());
		formData.append('issue_date', issueDate);
		formData.append('expiry_date', expiryDate);
		formData.append('credential_url', credentialUrl.trim());
		formData.append('credential_id', credentialId.trim());

		try {
			await onSubmit(formData);
		} finally {
			submitting = false;
		}
	}

	/**
	 * Handle backdrop click
	 */
	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onCancel();
		}
	}

	/**
	 * Handle escape key
	 */
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onCancel();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="fixed inset-0 z-50 overflow-y-auto">
	<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
		<!-- Backdrop -->
		<button
			type="button"
			class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
			on:click={handleBackdropClick}
			aria-label="Close modal"
		></button>

		<!-- Modal -->
		<div
			class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6"
		>
			<form on:submit={handleSubmit}>
				<div>
					<div class="text-center sm:text-left">
						<h3 class="text-lg font-semibold leading-6 text-gray-900 mb-4">
							{certification ? 'Edit Certification' : 'Add Certification'}
						</h3>
					</div>

					<div class="mt-4 space-y-4">
						<!-- Title -->
						<div>
							<label for="title" class="block text-sm font-medium text-gray-700">
								Title <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="title"
								bind:value={title}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
								placeholder="e.g., AWS Certified Solutions Architect"
								required
							/>
							{#if errors.title}
								<p class="mt-1 text-sm text-red-600">{errors.title}</p>
							{/if}
						</div>

						<!-- Issuer -->
						<div>
							<label for="issuer" class="block text-sm font-medium text-gray-700">
								Issuer <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="issuer"
								bind:value={issuer}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
								placeholder="e.g., Amazon Web Services"
								required
							/>
							{#if errors.issuer}
								<p class="mt-1 text-sm text-red-600">{errors.issuer}</p>
							{/if}
						</div>

						<!-- Dates -->
						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<label for="issueDate" class="block text-sm font-medium text-gray-700">
									Issue Date <span class="text-red-500">*</span>
								</label>
								<input
									type="date"
									id="issueDate"
									bind:value={issueDate}
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
									required
								/>
								{#if errors.issueDate}
									<p class="mt-1 text-sm text-red-600">{errors.issueDate}</p>
								{/if}
							</div>

							<div>
								<label for="expiryDate" class="block text-sm font-medium text-gray-700">
									Expiry Date
								</label>
								<input
									type="date"
									id="expiryDate"
									bind:value={expiryDate}
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
								/>
								<p class="mt-1 text-xs text-gray-500">Leave empty if no expiration</p>
							</div>
						</div>

						<!-- Credential URL -->
						<div>
							<label for="credentialUrl" class="block text-sm font-medium text-gray-700">
								Credential URL
							</label>
							<input
								type="url"
								id="credentialUrl"
								bind:value={credentialUrl}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
								placeholder="https://..."
							/>
							{#if errors.credentialUrl}
								<p class="mt-1 text-sm text-red-600">{errors.credentialUrl}</p>
							{/if}
						</div>

						<!-- Credential ID -->
						<div>
							<label for="credentialId" class="block text-sm font-medium text-gray-700">
								Credential ID
							</label>
							<input
								type="text"
								id="credentialId"
								bind:value={credentialId}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
								placeholder="e.g., ABC123XYZ"
							/>
						</div>
					</div>
				</div>

				<div class="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
					<button
						type="button"
						on:click={onCancel}
						class="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
						disabled={submitting}
					>
						Cancel
					</button>
					<button
						type="submit"
						class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={submitting}
					>
						{submitting ? 'Saving...' : certification ? 'Update' : 'Create'}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
