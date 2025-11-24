<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
	import SkillForm from '$lib/components/admin/SkillForm.svelte';
	import { skillCategoryMetadata, type SkillCategory } from '$lib/schemas/skill';
	import type { PageData, ActionData } from './$types';
	import type { Database } from '$lib/types/database';

	type Skill = Database['public']['Tables']['skills']['Row'];

	export let data: PageData;
	export let form: ActionData;

	// Modal state
	let showForm = false;
	let editingSkill: Skill | null = null;

	// Confirmation modal state
	let showDeleteConfirm = false;
	let deletingSkill: Skill | null = null;

	// Drag and drop state
	let draggedSkill: Skill | null = null;
	let draggedOverCategory: SkillCategory | null = null;

	// Group skills by category
	$: skillsByCategory = (data.skills || []).reduce(
		(acc, skill) => {
			if (!acc[skill.category]) {
				acc[skill.category] = [];
			}
			acc[skill.category].push(skill);
			return acc;
		},
		{} as Record<SkillCategory, Skill[]>
	);

	// Categories to display (all categories, even if empty)
	const categories: SkillCategory[] = ['programming', 'frontend', 'backend', 'devops', 'tools'];

	/**
	 * Open create form
	 */
	function openCreateForm() {
		editingSkill = null;
		showForm = true;
	}

	/**
	 * Open edit form
	 */
	function openEditForm(skill: Skill) {
		editingSkill = skill;
		showForm = true;
	}

	/**
	 * Close form modal
	 */
	function closeForm() {
		showForm = false;
		editingSkill = null;
	}

	/**
	 * Handle form submission
	 */
	async function handleFormSubmit(formData: FormData) {
		const action = editingSkill ? '?/update' : '?/create';

		try {
			const response = await fetch(action, {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				closeForm();
				await invalidateAll();
			}
		} catch (error) {
			console.error('Error submitting form:', error);
		}
	}

	/**
	 * Open delete confirmation
	 */
	function openDeleteConfirm(skill: Skill) {
		deletingSkill = skill;
		showDeleteConfirm = true;
	}

	/**
	 * Close delete confirmation
	 */
	function closeDeleteConfirm() {
		showDeleteConfirm = false;
		deletingSkill = null;
	}

	/**
	 * Handle drag start
	 */
	function handleDragStart(event: DragEvent, skill: Skill) {
		draggedSkill = skill;
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
		}
	}

	/**
	 * Handle drag over
	 */
	function handleDragOver(event: DragEvent, category: SkillCategory) {
		event.preventDefault();
		draggedOverCategory = category;
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	}

	/**
	 * Handle drop
	 */
	async function handleDrop(event: DragEvent, targetSkill: Skill) {
		event.preventDefault();

		if (!draggedSkill || draggedSkill.id === targetSkill.id) {
			draggedSkill = null;
			draggedOverCategory = null;
			return;
		}

		// Only allow reordering within the same category
		if (draggedSkill.category !== targetSkill.category) {
			draggedSkill = null;
			draggedOverCategory = null;
			return;
		}

		const category = draggedSkill.category;
		const categorySkills = skillsByCategory[category] || [];

		// Find indices
		const draggedIndex = categorySkills.findIndex((s) => s.id === draggedSkill?.id);
		const targetIndex = categorySkills.findIndex((s) => s.id === targetSkill.id);

		if (draggedIndex === -1 || targetIndex === -1) return;

		// Reorder array
		const newOrder = [...categorySkills];
		const [removed] = newOrder.splice(draggedIndex, 1);
		newOrder.splice(targetIndex, 0, removed);

		// Create update data with new display orders
		const updates = newOrder.map((skill, index) => ({
			id: skill.id,
			display_order: index
		}));

		// Submit reorder
		const formData = new FormData();
		formData.append('skills', JSON.stringify(updates));

		try {
			const response = await fetch('?/reorder', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				await invalidateAll();
			}
		} catch (error) {
			console.error('Error reordering skills:', error);
		}

		draggedSkill = null;
		draggedOverCategory = null;
	}

	/**
	 * Handle drag end
	 */
	function handleDragEnd() {
		draggedSkill = null;
		draggedOverCategory = null;
	}

	/**
	 * Get proficiency label
	 */
	function getProficiencyLabel(level: number): string {
		const labels: Record<number, string> = {
			1: 'Beginner',
			2: 'Intermediate',
			3: 'Proficient',
			4: 'Advanced',
			5: 'Expert'
		};
		return labels[level] || 'Unknown';
	}
</script>

<svelte:head>
	<title>Manage Skills - Admin - Zeddrix Portfolio</title>
</svelte:head>

<div class="py-6 px-4 sm:px-6 lg:px-8">
	<Breadcrumb items={[{ label: 'Skills' }]} />

	<!-- Header -->
	<div class="md:flex md:items-center md:justify-between mb-6">
		<div class="min-w-0 flex-1">
			<h2
				class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
			>
				Skills Management
			</h2>
			<p class="mt-1 text-sm text-gray-500">
				Manage your technical skills organized by category. Drag and drop to reorder within each
				category.
			</p>
		</div>
		<div class="mt-4 flex md:ml-4 md:mt-0">
			<button
				type="button"
				on:click={openCreateForm}
				class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
			>
				<span class="material-icons text-base mr-1">add</span>
				Add Skill
			</button>
		</div>
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

	<!-- Skills by Category -->
	<div class="space-y-6">
		{#each categories as category}
			{@const categorySkills = skillsByCategory[category] || []}
			{@const metadata = skillCategoryMetadata[category]}

			<div class="bg-white shadow rounded-lg overflow-hidden">
				<!-- Category Header -->
				<div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
					<div class="flex items-center">
						<span class="material-icons text-gray-600 mr-3">{metadata.icon}</span>
						<div>
							<h3 class="text-lg font-semibold text-gray-900">{metadata.label}</h3>
							<p class="text-sm text-gray-500">{metadata.description}</p>
						</div>
						<div class="ml-auto">
							<span
								class="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800"
							>
								{categorySkills.length}
								{categorySkills.length === 1 ? 'skill' : 'skills'}
							</span>
						</div>
					</div>
				</div>

				<!-- Skills List -->
				<div class="divide-y divide-gray-200">
					{#if categorySkills.length === 0}
						<div class="px-6 py-8 text-center">
							<span class="material-icons text-gray-400 text-5xl mb-2">code_off</span>
							<p class="text-gray-500 text-sm">No skills in this category yet.</p>
							<button
								type="button"
								on:click={openCreateForm}
								class="mt-3 inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
							>
								<span class="material-icons text-base mr-1">add</span>
								Add your first {metadata.label.toLowerCase()} skill
							</button>
						</div>
					{:else}
						{#each categorySkills as skill (skill.id)}
							<div
								role="listitem"
								draggable="true"
								on:dragstart={(e) => handleDragStart(e, skill)}
								on:dragover={(e) => handleDragOver(e, category)}
								on:drop={(e) => handleDrop(e, skill)}
								on:dragend={handleDragEnd}
								class="px-6 py-4 hover:bg-gray-50 transition-colors cursor-move"
								class:bg-blue-50={draggedSkill?.id === skill.id}
								class:border-t-2={draggedOverCategory === category &&
									draggedSkill?.category === category}
								class:border-blue-500={draggedOverCategory === category &&
									draggedSkill?.category === category}
							>
								<div class="flex items-center">
									<!-- Drag Handle -->
									<span class="material-icons text-gray-400 mr-3 cursor-move">drag_indicator</span>

									<!-- Skill Info -->
									<div class="flex-1 min-w-0">
										<div class="flex items-center">
											<p class="text-sm font-medium text-gray-900 truncate">{skill.name}</p>
											{#if skill.is_featured}
												<span
													class="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800"
												>
													<span class="material-icons text-xs mr-0.5">star</span>
													Featured
												</span>
											{/if}
										</div>
										<div class="mt-1 flex items-center space-x-4 text-sm text-gray-500">
											<span class="flex items-center">
												<span class="material-icons text-xs mr-1">bar_chart</span>
												{getProficiencyLabel(skill.proficiency_level)} (Level {skill.proficiency_level})
											</span>
											{#if skill.icon_url}
												<span class="flex items-center">
													<span class="material-icons text-xs mr-1">image</span>
													Icon
												</span>
											{/if}
											{#if skill.badge_url}
												<span class="flex items-center">
													<span class="material-icons text-xs mr-1">badge</span>
													Badge
												</span>
											{/if}
										</div>
									</div>

									<!-- Actions -->
									<div class="ml-4 flex items-center space-x-2">
										<!-- Toggle Featured -->
										<form method="POST" action="?/toggleFeatured" use:enhance>
											<input type="hidden" name="id" value={skill.id} />
											<input
												type="hidden"
												name="is_featured"
												value={(!skill.is_featured).toString()}
											/>
											<button
												type="submit"
												class="p-2 rounded-md text-gray-400 hover:text-yellow-600 hover:bg-gray-100"
												title={skill.is_featured ? 'Remove from featured' : 'Mark as featured'}
											>
												<span class="material-icons text-xl">
													{skill.is_featured ? 'star' : 'star_outline'}
												</span>
											</button>
										</form>

										<!-- Edit -->
										<button
											type="button"
											on:click={() => openEditForm(skill)}
											class="p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-gray-100"
											title="Edit skill"
										>
											<span class="material-icons text-xl">edit</span>
										</button>

										<!-- Delete -->
										<button
											type="button"
											on:click={() => openDeleteConfirm(skill)}
											class="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-gray-100"
											title="Delete skill"
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
		{/each}
	</div>

	<!-- Total Count -->
	<div class="mt-6 text-center text-sm text-gray-500">
		Total: {data.skills?.length || 0}
		{data.skills?.length === 1 ? 'skill' : 'skills'}
	</div>
</div>

<!-- Skill Form Modal -->
{#if showForm}
	<SkillForm skill={editingSkill} onCancel={closeForm} onSubmit={handleFormSubmit} />
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm && deletingSkill}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<!-- Backdrop -->
			<button
				type="button"
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				on:click={closeDeleteConfirm}
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
						<h3 class="text-lg font-semibold leading-6 text-gray-900">Delete Skill</h3>
						<div class="mt-2">
							<p class="text-sm text-gray-500">
								Are you sure you want to delete <strong>{deletingSkill.name}</strong>? This action
								cannot be undone.
							</p>
						</div>
					</div>
				</div>
				<div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
					<form method="POST" action="?/delete" use:enhance>
						<input type="hidden" name="id" value={deletingSkill.id} />
						<button
							type="submit"
							class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:w-auto"
							on:click={closeDeleteConfirm}
						>
							Delete
						</button>
					</form>
					<button
						type="button"
						on:click={closeDeleteConfirm}
						class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Hidden form for server actions -->
<form id="skillFormSubmit" method="POST" class="hidden" use:enhance>
	<!-- This form is used by the modal to submit data -->
</form>
