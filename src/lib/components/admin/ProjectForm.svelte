<script lang="ts">
	import { enhance } from '$app/forms';
	import RichTextEditor from './RichTextEditor.svelte';
	import MediaUploader from './MediaUploader.svelte';
	import { generateSlug } from '$lib/utils/slug';
	import type { GalleryMedia } from '$lib/schemas/project';
	import type { ButtonTextPreset, ProjectCategory, ButtonTextModeType } from '$lib/types/database';

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
		// New fields from UI overhaul
		show_in_hero_carousel?: boolean;
		hero_display_order?: number;
		video_preview_start?: number;
		video_preview_end?: number;
		button_text_mode?: ButtonTextModeType;
		button_text?: string | null;
		project_category_id?: string | null;
	}

	export let project: Project | null = null;
	export let isEdit = false;
	export let buttonTextPresets: ButtonTextPreset[] = [];
	export let projectCategories: ProjectCategory[] = [];

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

	// Hero carousel state
	let showInHeroCarousel = project?.show_in_hero_carousel || false;
	let heroDisplayOrder = project?.hero_display_order || 0;

	// Video preview state (in seconds)
	let videoPreviewStart = project?.video_preview_start || 0;
	let videoPreviewEnd = project?.video_preview_end || 5;

	// Button text state
	let buttonTextMode: ButtonTextModeType = project?.button_text_mode || 'predefined';
	let buttonText = project?.button_text || '';
	let projectCategoryId = project?.project_category_id || '';

	// Get default button text from selected category
	$: selectedCategory = projectCategories.find((c) => c.id === projectCategoryId);

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

	let formElement: HTMLFormElement;
	let isSubmitting = false;

	// Enhanced form submission with debugging - using before submit callback
	function handleFormSubmit(event: Event) {
		console.log('[ProjectForm] Form submit event triggered');

		// Check form validity
		if (!formElement.checkValidity()) {
			console.error('[ProjectForm] Form validation failed');
			formElement.reportValidity();
			event.preventDefault();
			return;
		}

		// Check required fields
		const requiredFields = {
			title,
			slug,
			shortDescription,
			fullDescription,
			featuredImageUrl,
			featuredImageCloudinaryId,
			techStackArray: techStackArray.length > 0
		};

		console.log('[ProjectForm] Required fields check:', requiredFields);

		const missingFields = [];
		if (!title) missingFields.push('title');
		if (!slug) missingFields.push('slug');
		if (!shortDescription) missingFields.push('short_description');
		if (!fullDescription) missingFields.push('full_description');
		if (!featuredImageUrl) missingFields.push('featured_image_url');
		if (!featuredImageCloudinaryId) missingFields.push('featured_image_cloudinary_id');
		if (techStackArray.length === 0) missingFields.push('tech_stack');

		if (missingFields.length > 0) {
			console.error('[ProjectForm] Missing required fields:', missingFields);
			uploadError = `Missing required fields: ${missingFields.join(', ')}`;
			event.preventDefault();
			return;
		}

		isSubmitting = true;
		uploadError = '';
		uploadSuccess = '';
		console.log('[ProjectForm] Form validation passed, submitting...');
	}
</script>

<form
	bind:this={formElement}
	method="POST"
	use:enhance
	on:submit={handleFormSubmit}
	class="space-y-8"
>
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

				<!-- Video Preview Segment -->
				{#if demoVideoUrl}
					<div class="mt-4 p-4 bg-background rounded-lg border border-border">
						<h3 class="text-sm font-semibold text-text-primary mb-3">Video Preview Segment</h3>
						<p class="text-xs text-text-secondary mb-4">
							Set the 5-second segment to show as a preview in the hero carousel.
						</p>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<label
									for="video_preview_start"
									class="block text-xs font-medium text-text-secondary mb-1"
								>
									Start Time (seconds)
								</label>
								<input
									id="video_preview_start"
									name="video_preview_start"
									type="number"
									min="0"
									step="0.1"
									bind:value={videoPreviewStart}
									on:change={() => {
										// Auto-adjust end time to be 5 seconds after start
										videoPreviewEnd = videoPreviewStart + 5;
									}}
									class="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>
							<div>
								<label
									for="video_preview_end"
									class="block text-xs font-medium text-text-secondary mb-1"
								>
									End Time (seconds)
								</label>
								<input
									id="video_preview_end"
									name="video_preview_end"
									type="number"
									min="0"
									step="0.1"
									bind:value={videoPreviewEnd}
									class="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>
						</div>
						<p class="text-xs text-text-secondary mt-2">
							Preview duration: {(videoPreviewEnd - videoPreviewStart).toFixed(1)} seconds
						</p>
					</div>
				{:else}
					<input type="hidden" name="video_preview_start" value={videoPreviewStart} />
					<input type="hidden" name="video_preview_end" value={videoPreviewEnd} />
				{/if}
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

	<!-- Hero Carousel Settings -->
	<div class="bg-surface border border-border rounded-lg p-6">
		<h2 class="text-xl font-bold text-text-primary mb-4">Hero Carousel</h2>
		<div class="space-y-4">
			<label class="flex items-center gap-2">
				<input
					type="checkbox"
					name="show_in_hero_carousel"
					bind:checked={showInHeroCarousel}
					value="true"
					class="w-4 h-4 rounded"
				/>
				<span class="text-text-primary">Show in hero carousel</span>
			</label>

			{#if showInHeroCarousel}
				<div>
					<label
						for="hero_display_order"
						class="block text-sm font-semibold text-text-primary mb-2"
					>
						Display Order
					</label>
					<input
						id="hero_display_order"
						name="hero_display_order"
						type="number"
						min="0"
						bind:value={heroDisplayOrder}
						class="w-32 px-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
					/>
					<p class="text-xs text-text-secondary mt-1">Lower numbers appear first in the carousel</p>
				</div>
			{:else}
				<input type="hidden" name="hero_display_order" value={heroDisplayOrder} />
			{/if}
		</div>
	</div>

	<!-- Button Text Settings -->
	<div class="bg-surface border border-border rounded-lg p-6">
		<h2 class="text-xl font-bold text-text-primary mb-4">Button Text</h2>
		<p class="text-sm text-text-secondary mb-4">
			Choose how the project action button text is determined.
		</p>

		<div class="space-y-4">
			<!-- Button Text Mode Selection -->
			<div class="space-y-2">
				<label
					class="flex items-center gap-3 p-3 bg-background rounded-lg border border-border cursor-pointer hover:border-primary/50"
				>
					<input
						type="radio"
						name="button_text_mode"
						value="predefined"
						bind:group={buttonTextMode}
						class="w-4 h-4"
					/>
					<div>
						<span class="text-text-primary font-medium">Use Preset</span>
						<p class="text-xs text-text-secondary">Select from predefined button text options</p>
					</div>
				</label>

				<label
					class="flex items-center gap-3 p-3 bg-background rounded-lg border border-border cursor-pointer hover:border-primary/50"
				>
					<input
						type="radio"
						name="button_text_mode"
						value="custom"
						bind:group={buttonTextMode}
						class="w-4 h-4"
					/>
					<div>
						<span class="text-text-primary font-medium">Custom Text</span>
						<p class="text-xs text-text-secondary">Enter your own button text</p>
					</div>
				</label>

				<label
					class="flex items-center gap-3 p-3 bg-background rounded-lg border border-border cursor-pointer hover:border-primary/50"
				>
					<input
						type="radio"
						name="button_text_mode"
						value="category"
						bind:group={buttonTextMode}
						class="w-4 h-4"
					/>
					<div>
						<span class="text-text-primary font-medium">By Category</span>
						<p class="text-xs text-text-secondary">Use the default text for the project category</p>
					</div>
				</label>
			</div>

			<!-- Conditional fields based on mode -->
			{#if buttonTextMode === 'predefined'}
				<div>
					<label
						for="button_text_preset"
						class="block text-sm font-semibold text-text-primary mb-2"
					>
						Select Preset
					</label>
					<select
						id="button_text_preset"
						name="button_text_preset_id"
						bind:value={buttonText}
						required
						class="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
					>
						<option value="">Choose a preset...</option>
						{#each buttonTextPresets as preset}
							<option value={preset.text}>{preset.text}</option>
						{/each}
					</select>
					<input type="hidden" name="button_text" value={buttonText} />
				</div>
			{:else if buttonTextMode === 'custom'}
				<div>
					<label
						for="button_text_custom"
						class="block text-sm font-semibold text-text-primary mb-2"
					>
						Custom Button Text
					</label>
					<input
						id="button_text_custom"
						name="button_text"
						type="text"
						bind:value={buttonText}
						required
						placeholder="e.g., View Live Demo"
						class="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>
			{:else if buttonTextMode === 'category'}
				<div>
					<label for="project_category" class="block text-sm font-semibold text-text-primary mb-2">
						Project Category
					</label>
					<select
						id="project_category"
						name="project_category_id"
						bind:value={projectCategoryId}
						required
						class="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
					>
						<option value="">Choose a category...</option>
						{#each projectCategories as category}
							<option value={category.id}
								>{category.display_name} → {category.default_button_text}</option
							>
						{/each}
					</select>
					{#if selectedCategory}
						<p class="text-xs text-text-secondary mt-1">
							Button will display: "{selectedCategory.default_button_text}"
						</p>
					{/if}
				</div>
			{/if}

			<!-- Hidden fields to ensure all data is submitted -->
			{#if buttonTextMode !== 'custom'}
				{#if buttonTextMode === 'category'}
					<input
						type="hidden"
						name="button_text"
						value={selectedCategory?.default_button_text || ''}
					/>
				{/if}
			{/if}
			{#if buttonTextMode !== 'category'}
				<input type="hidden" name="project_category_id" value="" />
			{/if}
		</div>
	</div>

	<!-- Actions -->
	<div class="flex items-center justify-end gap-3">
		<a
			href="/admin/projects"
			class="px-6 py-2 border border-border text-text-primary rounded-lg hover:bg-background transition-colors"
		>
			Cancel
		</a>
		<button
			type="submit"
			disabled={isSubmitting || uploadingFeaturedImage || uploadingGallery || uploadingDemoVideo}
			class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
			on:click={() =>
				console.log('[ProjectForm] Submit button clicked', {
					isSubmitting,
					uploadingFeaturedImage,
					uploadingGallery,
					uploadingDemoVideo,
					featuredImageUrl,
					featuredImageCloudinaryId
				})}
		>
			{#if isSubmitting}
				<span class="flex items-center gap-2">
					<span
						class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"
					></span>
					Saving...
				</span>
			{:else}
				{isEdit ? 'Update Project' : 'Create Project'}
			{/if}
		</button>
	</div>
</form>
