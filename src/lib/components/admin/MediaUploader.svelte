<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { GalleryMedia } from '$lib/schemas/project';

	// Props
	export let mediaType: 'image' | 'video' | 'gif' | 'all' = 'all';
	export let multiple: boolean = false;
	export let maxSizeMB: number = 20; // Default 20MB, videos can be larger
	export let preview: boolean = true;
	export let value: string = ''; // For single file mode (URL)
	export let cloudinaryId: string = ''; // For single file mode
	export let galleryMedia: GalleryMedia[] = []; // For multiple files mode
	export let label: string = 'Upload Media';
	export let helpText: string = '';

	const dispatch = createEventDispatcher();

	let isDragging = false;
	let fileInput: HTMLInputElement;
	let uploadProgress: number | null = null;
	let errorMessage: string = '';

	// Accepted file types based on mediaType
	$: acceptedTypes = getAcceptedTypes(mediaType);

	function getAcceptedTypes(type: string): string {
		switch (type) {
			case 'image':
				return 'image/jpeg,image/png,image/webp,image/gif';
			case 'video':
				return 'video/mp4,video/webm,video/quicktime';
			case 'gif':
				return 'image/gif';
			case 'all':
				return 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime';
			default:
				return '';
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	async function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;

		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			await handleFiles(files);
		}
	}

	function handleFileInputChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			handleFiles(input.files);
		}
	}

	async function handleFiles(files: FileList) {
		errorMessage = '';
		console.log(`[MediaUploader] Processing ${files.length} file(s)`);

		// Validate file count
		if (!multiple && files.length > 1) {
			errorMessage = 'Only one file can be uploaded at a time';
			console.error('[MediaUploader]', errorMessage);
			return;
		}

		// Validate and process each file
		const validFiles: File[] = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];

			// Validate file type
			if (!acceptedTypes.split(',').some((type) => file.type === type.trim())) {
				errorMessage = `Invalid file type: ${file.type}`;
				console.error('[MediaUploader]', errorMessage);
				continue;
			}

			// Validate file size
			const maxSizeBytes = maxSizeMB * 1024 * 1024;
			if (file.size > maxSizeBytes) {
				errorMessage = `File size exceeds ${maxSizeMB}MB limit`;
				console.error('[MediaUploader]', errorMessage);
				continue;
			}

			validFiles.push(file);
		}

		if (validFiles.length === 0) {
			console.warn('[MediaUploader] No valid files to process');
			return;
		}

		console.log(`[MediaUploader] Processing ${validFiles.length} valid file(s)`);

		// Convert files to base64 and emit event
		for (const file of validFiles) {
			await processFile(file);
		}
	}

	async function processFile(file: File): Promise<void> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onloadstart = () => {
				uploadProgress = 0;
				console.log(`[MediaUploader] Starting to read file: ${file.name}`);
			};

			reader.onprogress = (event: ProgressEvent<FileReader>) => {
				if (event.lengthComputable) {
					uploadProgress = Math.round((event.loaded / event.total) * 100);
					console.log(`[MediaUploader] Progress: ${uploadProgress}%`);
				}
			};

			reader.onload = () => {
				const dataUrl = reader.result as string;

				// Determine media type from file
				let detectedMediaType: 'image' | 'video' | 'gif';
				if (file.type.startsWith('video/')) {
					detectedMediaType = 'video';
				} else if (file.type === 'image/gif') {
					detectedMediaType = 'gif';
				} else {
					detectedMediaType = 'image';
				}

				console.log('[MediaUploader] File read successfully:', {
					fileName: file.name,
					fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
					fileType: file.type,
					detectedMediaType
				});

				// Dispatch event using Svelte's event dispatcher
				dispatch('upload', {
					dataUrl,
					mediaType: detectedMediaType,
					fileName: file.name,
					fileSize: file.size,
					fileType: file.type
				});

				console.log('[MediaUploader] Upload event dispatched successfully');

				uploadProgress = null;
				resolve();
			};

			reader.onerror = () => {
				errorMessage = 'Failed to read file';
				console.error('[MediaUploader] FileReader error:', reader.error);
				uploadProgress = null;
				reject(new Error('Failed to read file'));
			};

			reader.readAsDataURL(file);
		});
	}

	function handleRemoveMedia(index: number) {
		if (multiple) {
			galleryMedia = galleryMedia.filter((_, i) => i !== index);
		} else {
			value = '';
			cloudinaryId = '';
		}
	}

	function getMediaTypeFromUrl(url: string): 'image' | 'video' | 'gif' {
		const extension = url.split('.').pop()?.toLowerCase();
		if (extension === 'mp4' || extension === 'webm') {
			return 'video';
		} else if (extension === 'gif') {
			return 'gif';
		} else {
			return 'image';
		}
	}
</script>

<div class="media-uploader">
	{#if label}
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="block text-sm font-semibold text-text-primary mb-2">
			{label}
		</label>
	{/if}

	{#if helpText}
		<p class="text-sm text-text-secondary mb-3">{helpText}</p>
	{/if}

	<!-- Upload area -->
	<div
		class="upload-area border-2 border-dashed rounded-lg p-8 text-center transition-colors {isDragging
			? 'border-primary bg-primary/5'
			: 'border-border hover:border-primary/50 hover:bg-surface/50'}"
		role="button"
		tabindex="0"
		on:click={() => fileInput.click()}
		on:keydown={(e) => e.key === 'Enter' && fileInput.click()}
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		on:drop={handleDrop}
	>
		<input
			bind:this={fileInput}
			type="file"
			accept={acceptedTypes}
			{multiple}
			on:change={handleFileInputChange}
			class="hidden"
			aria-label={label}
		/>

		{#if uploadProgress !== null}
			<div class="space-y-2">
				<span class="material-icons text-4xl text-primary animate-pulse">cloud_upload</span>
				<p class="text-sm text-text-secondary">Uploading... {uploadProgress}%</p>
				<div class="w-full bg-background rounded-full h-2 overflow-hidden">
					<div
						class="h-full bg-primary transition-all duration-300"
						style="width: {uploadProgress}%"
					></div>
				</div>
			</div>
		{:else}
			<span class="material-icons text-5xl text-text-secondary mb-2">cloud_upload</span>
			<p class="text-sm text-text-primary font-medium mb-1">Click to upload or drag and drop</p>
			<p class="text-xs text-text-secondary">
				{mediaType === 'all' ? 'Images, Videos, or GIFs' : mediaType.toUpperCase()}
				{multiple ? '(multiple files)' : '(single file)'}
				up to {maxSizeMB}MB
			</p>
		{/if}
	</div>

	<!-- Error message -->
	{#if errorMessage}
		<div class="mt-3 p-3 bg-error/10 border border-error rounded-lg">
			<p class="text-sm text-error flex items-center gap-2">
				<span class="material-icons text-base">error</span>
				{errorMessage}
			</p>
		</div>
	{/if}

	<!-- Preview area for single file -->
	{#if preview && !multiple && value}
		<div class="mt-4">
			<p class="text-sm font-semibold text-text-primary mb-2">Preview</p>
			<div class="relative inline-block">
				{#if getMediaTypeFromUrl(value) === 'video'}
					<video src={value} controls class="max-w-full h-auto rounded-lg border border-border">
						<track kind="captions" />
					</video>
				{:else}
					<img
						src={value}
						alt="Preview"
						class="max-w-full h-auto rounded-lg border border-border"
					/>
				{/if}
				<button
					type="button"
					on:click={() => handleRemoveMedia(0)}
					class="absolute top-2 right-2 p-2 bg-error text-white rounded-full hover:bg-error/80 transition-colors shadow-lg"
					title="Remove"
				>
					<span class="material-icons text-lg">close</span>
				</button>
			</div>
		</div>
	{/if}

	<!-- Preview area for multiple files (gallery) -->
	{#if preview && multiple && galleryMedia.length > 0}
		<div class="mt-4">
			<p class="text-sm font-semibold text-text-primary mb-2">
				Gallery ({galleryMedia.length}
				{galleryMedia.length === 1 ? 'item' : 'items'})
			</p>
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{#each galleryMedia as media, index (media.cloudinary_id)}
					<div class="relative group">
						{#if media.media_type === 'video' || media.media_type === 'gif'}
							<video
								src={media.url}
								class="w-full h-32 object-cover rounded-lg border border-border"
								muted
								loop
								autoplay
							>
								<track kind="captions" />
							</video>
						{:else}
							<img
								src={media.url}
								alt="Gallery item {index + 1}"
								class="w-full h-32 object-cover rounded-lg border border-border"
							/>
						{/if}
						<div
							class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
						>
							<button
								type="button"
								on:click={() => handleRemoveMedia(index)}
								class="p-2 bg-error text-white rounded-full hover:bg-error/80 transition-colors"
								title="Remove"
							>
								<span class="material-icons text-lg">delete</span>
							</button>
						</div>
						<span
							class="absolute top-2 left-2 px-2 py-1 bg-background/80 text-xs text-text-primary rounded"
						>
							{media.media_type}
						</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.upload-area {
		cursor: pointer;
		user-select: none;
	}

	.upload-area:focus-visible {
		outline: 2px solid rgb(var(--color-primary));
		outline-offset: 2px;
	}
</style>
