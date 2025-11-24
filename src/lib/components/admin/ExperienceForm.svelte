<script lang="ts">
	import type { Database } from '$lib/types/database';

	type Experience = Database['public']['Tables']['experiences']['Row'];

	export let experience: Experience | null = null;
	export let onCancel: () => void;
	export let onSubmit: (formData: FormData) => Promise<void>;

	// Form state
	let company = experience?.company || '';
	let position = experience?.position || '';
	let description = experience?.description || '';
	let startDate = experience?.start_date || '';
	let endDate = experience?.end_date || '';
	let isCurrent = experience?.is_current || false;
	let location = experience?.location || '';

	let submitting = false;
	let errors: Record<string, string> = {};

	// Watch is_current to clear end_date
	$: if (isCurrent) {
		endDate = '';
	}

	/**
	 * Validate form
	 */
	function validateForm(): boolean {
		errors = {};

		if (!company.trim()) {
			errors.company = 'Company is required';
		}
		if (!position.trim()) {
			errors.position = 'Position is required';
		}
		if (!description.trim()) {
			errors.description = 'Description is required';
		}
		if (!startDate) {
			errors.startDate = 'Start date is required';
		}
		if (!isCurrent && !endDate) {
			errors.endDate = 'End date is required (or mark as current position)';
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
		if (experience) {
			formData.append('id', experience.id);
		}
		formData.append('company', company.trim());
		formData.append('position', position.trim());
		formData.append('description', description.trim());
		formData.append('start_date', startDate);
		formData.append('end_date', isCurrent ? '' : endDate);
		formData.append('is_current', isCurrent.toString());
		formData.append('location', location.trim());

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
							{experience ? 'Edit Experience' : 'Add Experience'}
						</h3>
					</div>

					<div class="mt-4 space-y-4">
						<!-- Company -->
						<div>
							<label for="company" class="block text-sm font-medium text-gray-700">
								Company <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="company"
								bind:value={company}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
								placeholder="e.g., Acme Corporation"
								required
							/>
							{#if errors.company}
								<p class="mt-1 text-sm text-red-600">{errors.company}</p>
							{/if}
						</div>

						<!-- Position -->
						<div>
							<label for="position" class="block text-sm font-medium text-gray-700">
								Position <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="position"
								bind:value={position}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
								placeholder="e.g., Senior Software Engineer"
								required
							/>
							{#if errors.position}
								<p class="mt-1 text-sm text-red-600">{errors.position}</p>
							{/if}
						</div>

						<!-- Location -->
						<div>
							<label for="location" class="block text-sm font-medium text-gray-700">
								Location
							</label>
							<input
								type="text"
								id="location"
								bind:value={location}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
								placeholder="e.g., San Francisco, CA"
							/>
						</div>

						<!-- Description -->
						<div>
							<label for="description" class="block text-sm font-medium text-gray-700">
								Description <span class="text-red-500">*</span>
							</label>
							<textarea
								id="description"
								bind:value={description}
								rows="4"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
								placeholder="Describe your role, responsibilities, and achievements..."
								required
							></textarea>
							<p class="mt-1 text-xs text-gray-500">{description.length}/1000 characters</p>
							{#if errors.description}
								<p class="mt-1 text-sm text-red-600">{errors.description}</p>
							{/if}
						</div>

						<!-- Dates -->
						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<label for="startDate" class="block text-sm font-medium text-gray-700">
									Start Date <span class="text-red-500">*</span>
								</label>
								<input
									type="date"
									id="startDate"
									bind:value={startDate}
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
									required
								/>
								{#if errors.startDate}
									<p class="mt-1 text-sm text-red-600">{errors.startDate}</p>
								{/if}
							</div>

							<div>
								<label for="endDate" class="block text-sm font-medium text-gray-700">
									End Date {#if !isCurrent}<span class="text-red-500">*</span>{/if}
								</label>
								<input
									type="date"
									id="endDate"
									bind:value={endDate}
									disabled={isCurrent}
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
									required={!isCurrent}
								/>
								{#if errors.endDate}
									<p class="mt-1 text-sm text-red-600">{errors.endDate}</p>
								{/if}
							</div>
						</div>

						<!-- Current Position Toggle -->
						<div class="flex items-center">
							<input
								type="checkbox"
								id="isCurrent"
								bind:checked={isCurrent}
								class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<label for="isCurrent" class="ml-2 block text-sm text-gray-700">
								I currently work here
							</label>
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
						{submitting ? 'Saving...' : experience ? 'Update' : 'Create'}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
