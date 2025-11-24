<script lang="ts">
	/**
	 * Admin profile management page
	 */

	import { enhance } from '$app/forms';
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
	import ImageUploader from '$lib/components/admin/ImageUploader.svelte';
	import SocialLinkForm from '$lib/components/admin/SocialLinkForm.svelte';
	import type { PageData } from './$types';
	import type { Database } from '$lib/types/database';

	type SocialLink = Database['public']['Tables']['social_links']['Row'];

	export let data: PageData;
	export let form;

	let { profile, socialLinks } = data;
	let showNotification = false;
	let notificationMessage = '';
	let notificationType: 'success' | 'error' = 'success';

	// Profile form fields
	let fullName = profile?.full_name || '';
	let tagline = profile?.tagline || '';
	let bio = profile?.bio || '';
	let email = profile?.email || '';
	let phone = profile?.phone || '';
	let linkedinUrl = profile?.linkedin_url || '';
	let githubUrl = profile?.github_url || '';
	let websiteUrl = profile?.website_url || '';
	let location = profile?.location || '';
	let availableForWork = profile?.available_for_work ?? true;
	let profileImageUrl = profile?.profile_image_url || null;
	let profileImageCloudinaryId = profile?.profile_image_cloudinary_id || null;

	// Image upload state
	let newImageData = '';

	// Social links state
	let showSocialLinkForm = false;
	let editingSocialLink: SocialLink | null = null;
	let draggedLinkId: string | null = null;

	// Handle image selection
	function handleImageSelect(dataUrl: string) {
		newImageData = dataUrl;
	}

	// Show notification
	function showMessage(message: string, type: 'success' | 'error' = 'success') {
		notificationMessage = message;
		notificationType = type;
		showNotification = true;
		setTimeout(() => {
			showNotification = false;
		}, 5000);
	}

	// Handle form response
	function handleFormResponse() {
		return async ({
			result,
			update
		}: {
			result: { type: string; data?: { message?: string; error?: string } };
			update: () => Promise<void>;
		}) => {
			await update();

			if (result.type === 'success' && result.data?.message) {
				showMessage(result.data.message, 'success');
				newImageData = ''; // Clear image data after successful upload
			} else if (result.type === 'failure' && result.data?.error) {
				showMessage(result.data.error, 'error');
			}
		};
	}

	// Social links CRUD handlers
	function handleAddSocialLink() {
		editingSocialLink = null;
		showSocialLinkForm = true;
	}

	function handleEditSocialLink(link: SocialLink) {
		editingSocialLink = link;
		showSocialLinkForm = true;
	}

	function handleCancelSocialLink() {
		showSocialLinkForm = false;
		editingSocialLink = null;
	}

	async function handleSocialLinkSubmit(formData: FormData) {
		const action = editingSocialLink ? '?/updateSocialLink' : '?/createSocialLink';

		const response = await fetch(action, {
			method: 'POST',
			body: formData
		});

		const result = await response.json();

		if (result.type === 'success') {
			showMessage(result.data.message, 'success');
			showSocialLinkForm = false;
			editingSocialLink = null;
			// Reload page data
			window.location.reload();
		} else {
			showMessage(result.data?.error || 'An error occurred', 'error');
		}
	}

	async function handleDeleteSocialLink(linkId: string) {
		if (!confirm('Are you sure you want to delete this social link?')) {
			return;
		}

		const formData = new FormData();
		formData.append('id', linkId);

		const response = await fetch('?/deleteSocialLink', {
			method: 'POST',
			body: formData
		});

		const result = await response.json();

		if (result.type === 'success') {
			showMessage(result.data.message, 'success');
			window.location.reload();
		} else {
			showMessage(result.data?.error || 'An error occurred', 'error');
		}
	}

	// Drag and drop handlers
	function handleDragStart(event: DragEvent, linkId: string) {
		draggedLinkId = linkId;
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	}

	async function handleDrop(event: DragEvent, targetLinkId: string) {
		event.preventDefault();

		if (!draggedLinkId || draggedLinkId === targetLinkId) {
			draggedLinkId = null;
			return;
		}

		// Find indexes
		const draggedIndex = socialLinks.findIndex((l) => l.id === draggedLinkId);
		const targetIndex = socialLinks.findIndex((l) => l.id === targetLinkId);

		if (draggedIndex === -1 || targetIndex === -1) {
			draggedLinkId = null;
			return;
		}

		// Reorder array
		const newLinks = [...socialLinks];
		const [draggedLink] = newLinks.splice(draggedIndex, 1);
		newLinks.splice(targetIndex, 0, draggedLink);

		// Update display order
		const updatedLinks = newLinks.map((link, index) => ({
			id: link.id,
			display_order: index
		}));

		// Send to server
		const formData = new FormData();
		formData.append('links', JSON.stringify(updatedLinks));

		const response = await fetch('?/reorderSocialLinks', {
			method: 'POST',
			body: formData
		});

		const result = await response.json();

		if (result.type === 'success') {
			socialLinks = newLinks;
			showMessage('Social links reordered successfully', 'success');
		} else {
			showMessage('Failed to reorder social links', 'error');
		}

		draggedLinkId = null;
	}

	// Reactive updates when data changes
	$: if (data.profile) {
		profile = data.profile;
		fullName = profile.full_name;
		tagline = profile.tagline;
		bio = profile.bio;
		email = profile.email;
		phone = profile.phone || '';
		linkedinUrl = profile.linkedin_url || '';
		githubUrl = profile.github_url || '';
		websiteUrl = profile.website_url || '';
		location = profile.location || '';
		availableForWork = profile.available_for_work;
		profileImageUrl = profile.profile_image_url;
		profileImageCloudinaryId = profile.profile_image_cloudinary_id;
	}

	$: if (data.socialLinks) {
		socialLinks = data.socialLinks;
	}

	// Show notification from form response
	$: if (form?.success) {
		showMessage(form.message, 'success');
	} else if (form?.error) {
		showMessage(form.error, 'error');
	}
</script>

<svelte:head>
	<title>Edit Profile - Admin - Zeddrix Portfolio</title>
</svelte:head>

<div class="py-6 px-4 sm:px-6 lg:px-8">
	<Breadcrumb items={[{ label: 'Profile' }]} />

	<!-- Notification -->
	{#if showNotification}
		<div
			class="mb-6 rounded-md p-4 {notificationType === 'success'
				? 'bg-green-50 text-green-800'
				: 'bg-red-50 text-red-800'}"
		>
			<div class="flex">
				<span class="material-icons text-sm mr-2">
					{notificationType === 'success' ? 'check_circle' : 'error'}
				</span>
				<p class="text-sm font-medium">{notificationMessage}</p>
			</div>
		</div>
	{/if}

	<div class="md:flex md:items-center md:justify-between mb-6">
		<div class="min-w-0 flex-1">
			<h2
				class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
			>
				Edit Profile
			</h2>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6">
		<!-- Profile Form -->
		<div class="bg-white shadow rounded-lg p-6">
			<h3 class="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>

			<form method="POST" action="?/updateProfile" use:enhance={handleFormResponse}>
				<!-- Hidden fields for image data -->
				<input type="hidden" name="new_image_data" value={newImageData} />
				<input type="hidden" name="old_cloudinary_id" value={profileImageCloudinaryId || ''} />
				<input type="hidden" name="profile_image_url" value={profileImageUrl || ''} />
				<input
					type="hidden"
					name="profile_image_cloudinary_id"
					value={profileImageCloudinaryId || ''}
				/>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Profile Image -->
					<div class="md:col-span-2">
						<ImageUploader
							currentImageUrl={profileImageUrl}
							onImageSelect={handleImageSelect}
							label="Profile Image"
						/>
					</div>

					<!-- Full Name -->
					<div>
						<label for="full_name" class="block text-sm font-medium text-gray-700 mb-2">
							Full Name *
						</label>
						<input
							id="full_name"
							name="full_name"
							type="text"
							bind:value={fullName}
							required
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<!-- Email -->
					<div>
						<label for="email" class="block text-sm font-medium text-gray-700 mb-2">
							Email *
						</label>
						<input
							id="email"
							name="email"
							type="email"
							bind:value={email}
							required
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<!-- Tagline -->
					<div class="md:col-span-2">
						<label for="tagline" class="block text-sm font-medium text-gray-700 mb-2">
							Tagline *
						</label>
						<input
							id="tagline"
							name="tagline"
							type="text"
							bind:value={tagline}
							required
							placeholder="e.g., Full-Stack Developer & Designer"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<!-- Bio -->
					<div class="md:col-span-2">
						<label for="bio" class="block text-sm font-medium text-gray-700 mb-2"> Bio * </label>
						<textarea
							id="bio"
							name="bio"
							bind:value={bio}
							required
							rows="4"
							placeholder="Tell us about yourself..."
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						></textarea>
					</div>

					<!-- Phone -->
					<div>
						<label for="phone" class="block text-sm font-medium text-gray-700 mb-2"> Phone </label>
						<input
							id="phone"
							name="phone"
							type="tel"
							bind:value={phone}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<!-- Location -->
					<div>
						<label for="location" class="block text-sm font-medium text-gray-700 mb-2">
							Location
						</label>
						<input
							id="location"
							name="location"
							type="text"
							bind:value={location}
							placeholder="e.g., Manila, Philippines"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<!-- LinkedIn URL -->
					<div>
						<label for="linkedin_url" class="block text-sm font-medium text-gray-700 mb-2">
							LinkedIn URL
						</label>
						<input
							id="linkedin_url"
							name="linkedin_url"
							type="url"
							bind:value={linkedinUrl}
							placeholder="https://linkedin.com/in/yourprofile"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<!-- GitHub URL -->
					<div>
						<label for="github_url" class="block text-sm font-medium text-gray-700 mb-2">
							GitHub URL
						</label>
						<input
							id="github_url"
							name="github_url"
							type="url"
							bind:value={githubUrl}
							placeholder="https://github.com/yourusername"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<!-- Website URL -->
					<div class="md:col-span-2">
						<label for="website_url" class="block text-sm font-medium text-gray-700 mb-2">
							Website URL
						</label>
						<input
							id="website_url"
							name="website_url"
							type="url"
							bind:value={websiteUrl}
							placeholder="https://yourwebsite.com"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<!-- Available for Work -->
					<div class="md:col-span-2">
						<div class="flex items-center gap-2">
							<input
								id="available_for_work"
								name="available_for_work"
								type="checkbox"
								bind:checked={availableForWork}
								value="true"
								class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
							/>
							<label for="available_for_work" class="text-sm font-medium text-gray-700">
								Available for work
							</label>
						</div>
					</div>
				</div>

				<!-- Submit Button -->
				<div class="mt-6 flex justify-end">
					<button
						type="submit"
						class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
					>
						Save Profile
					</button>
				</div>
			</form>
		</div>

		<!-- Social Links Management -->
		<div class="bg-white shadow rounded-lg p-6">
			<div class="flex items-center justify-between mb-6">
				<h3 class="text-lg font-semibold text-gray-900">Social Links</h3>
				<button
					type="button"
					on:click={handleAddSocialLink}
					class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
				>
					<span class="material-icons text-sm">add</span>
					Add Link
				</button>
			</div>

			<!-- Social Link Form -->
			{#if showSocialLinkForm}
				<div class="mb-6">
					<SocialLinkForm
						link={editingSocialLink}
						onSubmit={handleSocialLinkSubmit}
						onCancel={handleCancelSocialLink}
					/>
				</div>
			{/if}

			<!-- Social Links List -->
			{#if socialLinks.length > 0}
				<div class="space-y-2">
					<p class="text-sm text-gray-600 mb-4">Drag and drop to reorder</p>
					{#each socialLinks as link (link.id)}
						<div
							draggable="true"
							on:dragstart={(e) => handleDragStart(e, link.id)}
							on:dragover={handleDragOver}
							on:drop={(e) => handleDrop(e, link.id)}
							role="listitem"
							class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-move bg-white"
						>
							<!-- Drag Handle -->
							<span class="material-icons text-gray-400">drag_indicator</span>

							<!-- Icon -->
							<span class="material-icons text-gray-600">{link.icon_name}</span>

							<!-- Details -->
							<div class="flex-1">
								<div class="font-medium text-gray-900">{link.platform}</div>
								<div class="text-sm text-gray-500 truncate">{link.url}</div>
							</div>

							<!-- Visibility Badge -->
							<span
								class="px-2 py-1 text-xs rounded-full {link.is_visible
									? 'bg-green-100 text-green-800'
									: 'bg-gray-100 text-gray-800'}"
							>
								{link.is_visible ? 'Visible' : 'Hidden'}
							</span>

							<!-- Actions -->
							<div class="flex gap-2">
								<button
									type="button"
									on:click={() => handleEditSocialLink(link)}
									class="p-2 text-gray-600 hover:text-blue-600 transition-colors"
									aria-label="Edit"
								>
									<span class="material-icons text-sm">edit</span>
								</button>
								<button
									type="button"
									on:click={() => handleDeleteSocialLink(link.id)}
									class="p-2 text-gray-600 hover:text-red-600 transition-colors"
									aria-label="Delete"
								>
									<span class="material-icons text-sm">delete</span>
								</button>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="text-center py-8 text-gray-500">
					<span class="material-icons text-4xl mb-2">link_off</span>
					<p>No social links yet. Add your first link to get started.</p>
				</div>
			{/if}
		</div>
	</div>
</div>
