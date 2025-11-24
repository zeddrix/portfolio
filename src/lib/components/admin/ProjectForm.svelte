<script lang="ts">
	import { enhance } from '$app/forms';
	import RichTextEditor from './RichTextEditor.svelte';
	import MediaUploader from './MediaUploader.svelte';
	import { generateSlug } from '$lib/utils/slug';
	import type { GalleryMedia } from '$lib/schemas/project';

	interface Project {
		id?: string;
		title: string;
		slug: string;
		short_description: string;
		full_description: string;
		challenge?: string | null;
		solution?: string | null;
		tech_stack?: string[];
		project_url?: string | null;
		github_url?: string | null;
		featured_image_url: string;
		featured_image_cloudinary_id: string;
		gallery_images?: GalleryMedia[];
		demo_video_url?: string | null;
		demo_video_cloudinary_id?: string | null;
		is_featured: boolean;
		published: boolean;
	}

	export let project: Project | null = null;
	export let isEdit = false;

	let title = project?.title || '';
	let slug = project?.slug || '';
	let shortDescription = project?.short_description || '';
	let fullDescription = project?.full_description || '';
	let challenge = project?.challenge || '';
	let solution = project?.solution || '';
	let techStackInput = project?.tech_stack?.join(', ') || '';
	let projectUrl = project?.project_url || '';
	let githubUrl = project?.github_url || '';
	let featuredImageUrl = project?.featured_image_url || '';
	let featuredImageCloudinaryId = project?.featured_image_cloudinary_id || '';
	let galleryImages: GalleryMedia[] = (project?.gallery_images as GalleryMedia[]) || [];
	let demoVideoUrl = project?.demo_video_url || '';
	let demoVideoCloudinaryId = project?.demo_video_cloudinary_id || '';
	let isFeatured = project?.is_featured || false;
	let published = project?.published || false;

	let autoGenerateSlug = !isEdit;

	// Upload state
	let uploadingFeaturedImage = false;
	let uploadingGallery = false;
	let uploadingDemoVideo = false;
	let uploadError = '';
	let uploadSuccess = '';

	$: if (autoGenerateSlug && title) {
		slug = generateSlug(title);
	}

	// Computed tech stack array for form submission
	$: techStackArray = techStackInput
		.split(',')
		.map((t) => t.trim())
		.filter(Boolean);

	// Helper function to get auth token from localStorage
	function getAuthToken(): string | null {
		if (typeof window === 'undefined') return null;

		// Find the Supabase auth token in localStorage
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.startsWith('sb-') && key.includes('auth-token')) {
				const value = localStorage.getItem(key);
				if (value) {
					try {
						const parsed = JSON.parse(value);
						return parsed.access_token || null;
					} catch {
						return null;
					}
				}
			}
		}
		return null;
	}

	// Upload handlers
	async function handleFeaturedImageUpload(event: CustomEvent) {
		uploadError = '';
		uploadSuccess = '';
		uploadingFeaturedImage = true;

		console.log('[ProjectForm] Starting featured image upload', event.detail);

		try {
			const { dataUrl, mediaType, fileName } = event.detail;

			// Ensure slug exists for upload
			if (!slug) {
				slug = generateSlug(title || 'untitled');
			}

			// Get auth token from localStorage
			const authToken = getAuthToken();
			if (!authToken) {
				throw new Error('Not authenticated - please log in again');
			}

			console.log(`[ProjectForm] Uploading featured image to API for project: ${slug}`);

			const response = await fetch('/api/admin/upload', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authToken}`
				},
				body: JSON.stringify({
					dataUrl,
					mediaType,
					projectSlug: slug,
					uploadType: 'featured'
				})
			});

			console.log(`[ProjectForm] API response status: ${response.status}`);

			if (!response.ok) {
				const errorData = await response.json();
				console.error('[ProjectForm] API error response:', errorData);
				throw new Error(errorData.message || 'Upload failed');
			}

			const result = await response.json();
			console.log('[ProjectForm] Upload successful:', result);

			featuredImageUrl = result.url;
			featuredImageCloudinaryId = result.cloudinaryId;
			uploadSuccess = `Featured image uploaded successfully! (${fileName})`;

			console.log('[ProjectForm] Featured image state updated:', {
				url: featuredImageUrl,
				cloudinaryId: featuredImageCloudinaryId
			});
		} catch (err) {
			uploadError = err instanceof Error ? err.message : 'Failed to upload featured image';
			console.error('[ProjectForm] Featured image upload error:', err);
		} finally {
			uploadingFeaturedImage = false;
		}
	}

	async function handleGalleryUpload(event: CustomEvent) {
		uploadError = '';
		uploadSuccess = '';
		uploadingGallery = true;

		console.log('[ProjectForm] Starting gallery upload', event.detail);

		try {
			const { dataUrl, mediaType, fileName } = event.detail;

			// Ensure slug exists for upload
			if (!slug) {
				slug = generateSlug(title || 'untitled');
			}

			// Get auth token from localStorage
			const authToken = getAuthToken();
			if (!authToken) {
				throw new Error('Not authenticated - please log in again');
			}

			console.log(`[ProjectForm] Uploading gallery media to API for project: ${slug}`);

			const response = await fetch('/api/admin/upload', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authToken}`
				},
				body: JSON.stringify({
					dataUrl,
					mediaType,
					projectSlug: slug,
					uploadType: 'gallery'
				})
			});

			console.log(`[ProjectForm] API response status: ${response.status}`);

			if (!response.ok) {
				const errorData = await response.json();
				console.error('[ProjectForm] API error response:', errorData);
				throw new Error(errorData.message || 'Upload failed');
			}

			const result = await response.json();
			console.log('[ProjectForm] Upload successful:', result);

			// Add to gallery images array
			const newMedia: GalleryMedia = {
				url: result.url,
				cloudinary_id: result.cloudinaryId,
				media_type: mediaType,
				order: galleryImages.length
			};

			galleryImages = [...galleryImages, newMedia];
			uploadSuccess = `Gallery ${mediaType} uploaded successfully! (${fileName})`;

			console.log('[ProjectForm] Gallery updated, now has', galleryImages.length, 'items');
		} catch (err) {
			uploadError = err instanceof Error ? err.message : 'Failed to upload gallery media';
			console.error('[ProjectForm] Gallery upload error:', err);
		} finally {
			uploadingGallery = false;
		}
	}

	async function handleDemoVideoUpload(event: CustomEvent) {
		uploadError = '';
		uploadSuccess = '';
		uploadingDemoVideo = true;

		console.log('[ProjectForm] Starting demo video upload', event.detail);

		try {
			const { dataUrl, mediaType, fileName } = event.detail;

			// Ensure slug exists for upload
			if (!slug) {
				slug = generateSlug(title || 'untitled');
			}

			// Get auth token from localStorage
			const authToken = getAuthToken();
			if (!authToken) {
				throw new Error('Not authenticated - please log in again');
			}

			console.log(`[ProjectForm] Uploading demo video to API for project: ${slug}`);

			const response = await fetch('/api/admin/upload', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authToken}`
				},
				body: JSON.stringify({
					dataUrl,
					mediaType,
					projectSlug: slug,
					uploadType: 'demo'
				})
			});

			console.log(`[ProjectForm] API response status: ${response.status}`);

			if (!response.ok) {
				const errorData = await response.json();
				console.error('[ProjectForm] API error response:', errorData);
				throw new Error(errorData.message || 'Upload failed');
			}

			const result = await response.json();
			console.log('[ProjectForm] Upload successful:', result);

			demoVideoUrl = result.url;
			demoVideoCloudinaryId = result.cloudinaryId;
			uploadSuccess = `Demo video uploaded successfully! (${fileName})`;

			console.log('[ProjectForm] Demo video state updated:', {
				url: demoVideoUrl,
				cloudinaryId: demoVideoCloudinaryId
			});
		} catch (err) {
			uploadError = err instanceof Error ? err.message : 'Failed to upload demo video';
			console.error('[ProjectForm] Demo video upload error:', err);
		} finally {
			uploadingDemoVideo = false;
		}
	}

	function handleRemoveGalleryItem(index: number) {
		galleryImages = galleryImages.filter((_, i) => i !== index);
	}
</script>

<form method="POST" use:enhance class="space-y-8">
	<!-- Basic Info -->
	<div class="bg-surface border border-border rounded-lg p-6">
		<h2 class="text-xl font-bold text-text-primary mb-4">Basic Information</h2>
		<div class="space-y-4">
			<div>
				<label for="title" class="block text-sm font-semibold text-text-primary mb-2">
					Title <span class="text-error">*</span>
				</label>
				<input
					id="title"
					name="title"
					type="text"
					bind:value={title}
					required
					class="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
				/>
			</div>

			<div>
				<label for="slug" class="block text-sm font-semibold text-text-primary mb-2">
					Slug <span class="text-error">*</span>
				</label>
				<div class="flex gap-2">
					<input
						id="slug"
						name="slug"
						type="text"
						bind:value={slug}
						required
						pattern="[a-z0-9-]+"
						class="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
					/>
					{#if !isEdit}
						<button
							type="button"
							on:click={() => (autoGenerateSlug = !autoGenerateSlug)}
							class="px-4 py-2 border border-border rounded-lg text-text-secondary hover:bg-background"
						>
							{autoGenerateSlug ? 'Manual' : 'Auto'}
						</button>
					{/if}
				</div>
			</div>

			<div>
				<label for="short_description" class="block text-sm font-semibold text-text-primary mb-2">
					Short Description <span class="text-error">*</span>
				</label>
				<textarea
					id="short_description"
					name="short_description"
					bind:value={shortDescription}
					required
					maxlength="500"
					rows="3"
					class="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
				></textarea>
				<p class="text-xs text-text-secondary mt-1">{shortDescription.length}/500 characters</p>
			</div>
		</div>
	</div>

	<!-- Full Description -->
	<div class="bg-surface border border-border rounded-lg p-6">
		<h2 class="text-xl font-bold text-text-primary mb-4">Full Description</h2>
		<input type="hidden" name="full_description" value={fullDescription} />
		<RichTextEditor bind:value={fullDescription} minHeight="300px" />
	</div>

	<!-- Challenge & Solution -->
	<div class="bg-surface border border-border rounded-lg p-6">
		<h2 class="text-xl font-bold text-text-primary mb-4">Challenge & Solution</h2>
		<div class="space-y-4">
			<div>
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="block text-sm font-semibold text-text-primary mb-2">Challenge</label>
				<input type="hidden" name="challenge" value={challenge} />
				<RichTextEditor bind:value={challenge} minHeight="200px" />
			</div>
			<div>
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="block text-sm font-semibold text-text-primary mb-2">Solution</label>
				<input type="hidden" name="solution" value={solution} />
				<RichTextEditor bind:value={solution} minHeight="200px" />
			</div>
		</div>
	</div>

	<!-- Tech Stack & Links -->
	<div class="bg-surface border border-border rounded-lg p-6">
		<h2 class="text-xl font-bold text-text-primary mb-4">Tech Stack & Links</h2>
		<div class="space-y-4">
			<div>
				<label for="tech_stack" class="block text-sm font-semibold text-text-primary mb-2">
					Tech Stack <span class="text-error">*</span>
				</label>
				<input
					id="tech_stack"
					type="text"
					bind:value={techStackInput}
					placeholder="React, Node.js, PostgreSQL, etc."
					class="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
				/>
				<input type="hidden" name="tech_stack" value={JSON.stringify(techStackArray)} />
				<p class="text-xs text-text-secondary mt-1">Separate technologies with commas</p>
			</div>

			<div>
				<label for="project_url" class="block text-sm font-semibold text-text-primary mb-2">
					Project URL
				</label>
				<input
					id="project_url"
					name="project_url"
					type="url"
					bind:value={projectUrl}
					placeholder="https://example.com"
					class="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
				/>
			</div>

			<div>
				<label for="github_url" class="block text-sm font-semibold text-text-primary mb-2">
					GitHub URL
				</label>
				<input
					id="github_url"
					name="github_url"
					type="url"
					bind:value={githubUrl}
					placeholder="https://github.com/username/repo"
					class="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
				/>
			</div>
		</div>
	</div>

	<!-- Media -->
	<div class="bg-surface border border-border rounded-lg p-6">
		<h2 class="text-xl font-bold text-text-primary mb-4">Media</h2>

		<!-- Success message -->
		{#if uploadSuccess}
			<div class="mb-4 p-3 bg-success/10 border border-success rounded-lg">
				<p class="text-sm text-success flex items-center gap-2">
					<span class="material-icons text-base">check_circle</span>
					{uploadSuccess}
				</p>
			</div>
		{/if}

		<!-- Error message -->
		{#if uploadError}
			<div class="mb-4 p-3 bg-error/10 border border-error rounded-lg">
				<p class="text-sm text-error flex items-center gap-2">
					<span class="material-icons text-base">error</span>
					{uploadError}
				</p>
			</div>
		{/if}

		<div class="space-y-6">
			<!-- Featured Image -->
			<div>
				<MediaUploader
					mediaType="image"
					multiple={false}
					maxSizeMB={10}
					preview={true}
					bind:value={featuredImageUrl}
					bind:cloudinaryId={featuredImageCloudinaryId}
					label="Featured Image *"
					helpText="Main project image displayed on the projects page"
					on:upload={handleFeaturedImageUpload}
				/>
				{#if uploadingFeaturedImage}
					<p class="text-sm text-primary mt-2 flex items-center gap-2">
						<span class="material-icons text-base animate-spin">refresh</span>
						Uploading featured image...
					</p>
				{/if}
				<input type="hidden" name="featured_image_url" value={featuredImageUrl} />
				<input
					type="hidden"
					name="featured_image_cloudinary_id"
					value={featuredImageCloudinaryId}
				/>
			</div>

			<!-- Gallery Images -->
			<div>
				<MediaUploader
					mediaType="all"
					multiple={true}
					maxSizeMB={20}
					preview={true}
					bind:galleryMedia={galleryImages}
					label="Gallery Images"
					helpText="Additional project images, videos, or GIFs (optional)"
					on:upload={handleGalleryUpload}
				/>
				{#if uploadingGallery}
					<p class="text-sm text-primary mt-2 flex items-center gap-2">
						<span class="material-icons text-base animate-spin">refresh</span>
						Uploading gallery media...
					</p>
				{/if}

				<!-- Manual remove buttons for gallery items -->
				{#if galleryImages.length > 0}
					<div class="mt-4 space-y-2">
						<p class="text-sm font-semibold text-text-primary">
							Gallery Items ({galleryImages.length})
						</p>
						{#each galleryImages as item, index}
							<div
								class="flex items-center justify-between p-2 bg-background rounded border border-border"
							>
								<span class="text-sm text-text-secondary truncate flex-1">
									{item.media_type} - {item.cloudinary_id}
								</span>
								<button
									type="button"
									on:click={() => handleRemoveGalleryItem(index)}
									class="ml-2 p-1 text-error hover:bg-error/10 rounded"
									title="Remove"
								>
									<span class="material-icons text-sm">delete</span>
								</button>
							</div>
						{/each}
					</div>
				{/if}
				<input type="hidden" name="gallery_images" value={JSON.stringify(galleryImages)} />
			</div>

			<!-- Demo Video -->
			<div>
				<MediaUploader
					mediaType="video"
					multiple={false}
					maxSizeMB={50}
					preview={true}
					bind:value={demoVideoUrl}
					bind:cloudinaryId={demoVideoCloudinaryId}
					label="Demo Video"
					helpText="Project demonstration video (optional)"
					on:upload={handleDemoVideoUpload}
				/>
				{#if uploadingDemoVideo}
					<p class="text-sm text-primary mt-2 flex items-center gap-2">
						<span class="material-icons text-base animate-spin">refresh</span>
						Uploading demo video...
					</p>
				{/if}
				<input type="hidden" name="demo_video_url" value={demoVideoUrl} />
				<input type="hidden" name="demo_video_cloudinary_id" value={demoVideoCloudinaryId} />
			</div>
		</div>
	</div>

	<!-- Settings -->
	<div class="bg-surface border border-border rounded-lg p-6">
		<h2 class="text-xl font-bold text-text-primary mb-4">Settings</h2>
		<div class="space-y-3">
			<label class="flex items-center gap-2">
				<input
					type="checkbox"
					name="is_featured"
					bind:checked={isFeatured}
					value="true"
					class="w-4 h-4 rounded"
				/>
				<span class="text-text-primary">Mark as featured project</span>
			</label>
			<label class="flex items-center gap-2">
				<input
					type="checkbox"
					name="published"
					bind:checked={published}
					value="true"
					class="w-4 h-4 rounded"
				/>
				<span class="text-text-primary">Publish project</span>
			</label>
		</div>
		<input type="hidden" name="metrics" value="" />
	</div>

	<!-- Actions -->
	<div class="flex items-center justify-end gap-3">
		<a
			href="/admin/projects"
			class="px-6 py-2 border border-border text-text-primary rounded-lg hover:bg-background"
		>
			Cancel
		</a>
		<button type="submit" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
			{isEdit ? 'Update Project' : 'Create Project'}
		</button>
	</div>
</form>
