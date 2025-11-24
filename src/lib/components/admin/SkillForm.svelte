<script lang="ts">
	import { skillCategories, skillCategoryMetadata } from '$lib/schemas/skill';
	import type { Database } from '$lib/types/database';

	type Skill = Database['public']['Tables']['skills']['Row'];

	// Props
	export let skill: Skill | null = null;
	export let onCancel: () => void;
	export let onSubmit: (data: FormData) => void;

	// Form state
	let name = skill?.name || '';
	let category = skill?.category || 'programming';
	let proficiency_level = skill?.proficiency_level || 3;
	let icon_url = skill?.icon_url || '';
	let badge_url = skill?.badge_url || '';
	let is_featured = skill?.is_featured || false;

	// Validation state
	let errors: Record<string, string> = {};

	/**
	 * Validate form
	 */
	function validate(): boolean {
		errors = {};

		if (!name.trim()) {
			errors.name = 'Name is required';
		}

		if (icon_url && !isValidUrl(icon_url)) {
			errors.icon_url = 'Must be a valid URL';
		}

		if (badge_url && !isValidUrl(badge_url)) {
			errors.badge_url = 'Must be a valid URL';
		}

		return Object.keys(errors).length === 0;
	}

	/**
	 * Check if string is valid URL
	 */
	function isValidUrl(url: string): boolean {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Handle form submission
	 */
	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!validate()) return;

		const formData = new FormData();
		if (skill) formData.append('id', skill.id);
		formData.append('name', name.trim());
		formData.append('category', category);
		formData.append('proficiency_level', proficiency_level.toString());
		formData.append('icon_url', icon_url.trim());
		formData.append('badge_url', badge_url.trim());
		formData.append('is_featured', is_featured.toString());

		onSubmit(formData);
	}

	/**
	 * Proficiency level labels
	 */
	const proficiencyLabels: Record<number, string> = {
		1: 'Beginner',
		2: 'Intermediate',
		3: 'Proficient',
		4: 'Advanced',
		5: 'Expert'
	};
</script>

<div class="fixed inset-0 z-50 overflow-y-auto">
	<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
		<!-- Backdrop -->
		<button
			type="button"
			class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
			on:click={onCancel}
			aria-label="Close modal"
		></button>

		<!-- Modal -->
		<div
			class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
		>
			<div class="absolute right-0 top-0 pr-4 pt-4">
				<button
					type="button"
					class="rounded-md bg-white text-gray-400 hover:text-gray-500"
					on:click={onCancel}
				>
					<span class="sr-only">Close</span>
					<span class="material-icons text-2xl">close</span>
				</button>
			</div>

			<div class="sm:flex sm:items-start">
				<div
					class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10"
				>
					<span class="material-icons text-blue-600">code</span>
				</div>
				<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
					<h3 class="text-lg font-semibold leading-6 text-gray-900">
						{skill ? 'Edit Skill' : 'Add New Skill'}
					</h3>
					<div class="mt-4">
						<form on:submit={handleSubmit} class="space-y-4">
							<!-- Name -->
							<div>
								<label for="name" class="block text-sm font-medium text-gray-700">
									Skill Name <span class="text-red-500">*</span>
								</label>
								<input
									type="text"
									id="name"
									bind:value={name}
									class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
									class:border-red-500={errors.name}
									placeholder="e.g., TypeScript, React, Node.js"
								/>
								{#if errors.name}
									<p class="mt-1 text-sm text-red-600">{errors.name}</p>
								{/if}
							</div>

							<!-- Category -->
							<div>
								<label for="category" class="block text-sm font-medium text-gray-700">
									Category <span class="text-red-500">*</span>
								</label>
								<select
									id="category"
									bind:value={category}
									class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
								>
									{#each skillCategories as cat}
										<option value={cat}>
											{skillCategoryMetadata[cat].label}
										</option>
									{/each}
								</select>
							</div>

							<!-- Proficiency Level -->
							<div>
								<label for="proficiency" class="block text-sm font-medium text-gray-700 mb-2">
									Proficiency Level: {proficiencyLabels[proficiency_level]}
								</label>
								<div class="flex items-center space-x-2">
									<span class="text-sm text-gray-500">1</span>
									<input
										type="range"
										id="proficiency"
										bind:value={proficiency_level}
										min="1"
										max="5"
										step="1"
										class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
									/>
									<span class="text-sm text-gray-500">5</span>
								</div>
								<div class="mt-1 flex justify-between text-xs text-gray-500">
									<span>Beginner</span>
									<span>Expert</span>
								</div>
							</div>

							<!-- Icon URL -->
							<div>
								<label for="icon_url" class="block text-sm font-medium text-gray-700">
									Icon URL (optional)
								</label>
								<input
									type="url"
									id="icon_url"
									bind:value={icon_url}
									class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
									class:border-red-500={errors.icon_url}
									placeholder="https://example.com/icon.svg"
								/>
								{#if errors.icon_url}
									<p class="mt-1 text-sm text-red-600">{errors.icon_url}</p>
								{/if}
								<p class="mt-1 text-xs text-gray-500">Direct URL to skill icon/logo</p>
							</div>

							<!-- Badge URL -->
							<div>
								<label for="badge_url" class="block text-sm font-medium text-gray-700">
									Badge URL (optional)
								</label>
								<input
									type="url"
									id="badge_url"
									bind:value={badge_url}
									class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
									class:border-red-500={errors.badge_url}
									placeholder="https://img.shields.io/badge/..."
								/>
								{#if errors.badge_url}
									<p class="mt-1 text-sm text-red-600">{errors.badge_url}</p>
								{/if}
								<p class="mt-1 text-xs text-gray-500">Badge from shields.io or similar</p>
							</div>

							<!-- Featured Toggle -->
							<div class="flex items-center">
								<input
									type="checkbox"
									id="is_featured"
									bind:checked={is_featured}
									class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<label for="is_featured" class="ml-2 block text-sm text-gray-700">
									Featured skill (display prominently on portfolio)
								</label>
							</div>

							<!-- Actions -->
							<div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
								<button
									type="submit"
									class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:w-auto"
								>
									{skill ? 'Update Skill' : 'Create Skill'}
								</button>
								<button
									type="button"
									on:click={onCancel}
									class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
