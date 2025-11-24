<script lang="ts">
	/**
	 * Image uploader component with preview and cropping
	 */

	export let currentImageUrl: string | null = null;
	export let onImageSelect: (dataUrl: string) => void;
	export let label = 'Profile Image';
	export let maxSizeMB = 5;

	let fileInput: HTMLInputElement | null = null;
	let previewUrl: string | null = currentImageUrl;
	let isDragging = false;
	let error = '';

	/**
	 * Handle file input change
	 */
	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			processFile(input.files[0]);
		}
	}

	/**
	 * Handle drag and drop
	 */
	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;

		if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
			processFile(event.dataTransfer.files[0]);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	/**
	 * Process uploaded file
	 */
	function processFile(file: File) {
		error = '';

		// Validate file type
		if (!file.type.startsWith('image/')) {
			error = 'Please upload an image file';
			return;
		}

		// Validate file size
		const fileSizeMB = file.size / (1024 * 1024);
		if (fileSizeMB > maxSizeMB) {
			error = `Image size must be less than ${maxSizeMB}MB`;
			return;
		}

		// Read file and create preview
		const reader = new FileReader();
		reader.onload = (e) => {
			const dataUrl = e.target?.result as string;
			previewUrl = dataUrl;
			onImageSelect(dataUrl);
		};
		reader.readAsDataURL(file);
	}

	/**
	 * Remove image
	 */
	function removeImage() {
		previewUrl = null;
		if (fileInput) {
			fileInput.value = '';
		}
		onImageSelect('');
	}

	/**
	 * Open file picker
	 */
	function openFilePicker() {
		fileInput?.click();
	}

	// Update preview when currentImageUrl changes
	$: previewUrl = currentImageUrl;
</script>

<div class="space-y-2">
	<label class="block text-sm font-medium text-gray-700">
		{label}
	</label>

	<!-- Hidden file input -->
	<input
		type="file"
		accept="image/*"
		class="hidden"
		bind:this={fileInput}
		on:change={handleFileChange}
	/>

	<!-- Drop zone / Preview -->
	<div
		class="relative border-2 border-dashed rounded-lg transition-colors {isDragging
			? 'border-blue-500 bg-blue-50'
			: 'border-gray-300 hover:border-gray-400'}"
		on:drop={handleDrop}
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		role="button"
		tabindex="0"
		on:click={openFilePicker}
		on:keydown={(e) => e.key === 'Enter' && openFilePicker()}
	>
		{#if previewUrl}
			<!-- Image Preview -->
			<div class="relative group">
				<img src={previewUrl} alt="Preview" class="w-full h-64 object-cover rounded-lg" />

				<!-- Overlay on hover -->
				<div
					class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 rounded-lg"
				>
					<button
						type="button"
						class="px-4 py-2 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
						on:click|stopPropagation={openFilePicker}
					>
						Change Image
					</button>
					<button
						type="button"
						class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
						on:click|stopPropagation={removeImage}
					>
						Remove
					</button>
				</div>
			</div>
		{:else}
			<!-- Upload placeholder -->
			<div class="p-8 text-center">
				<span class="material-icons text-gray-400 text-5xl mb-2">cloud_upload</span>
				<p class="text-gray-600 mb-1">Click to upload or drag and drop</p>
				<p class="text-sm text-gray-500">
					PNG, JPG, GIF up to {maxSizeMB}MB
				</p>
			</div>
		{/if}
	</div>

	<!-- Error message -->
	{#if error}
		<p class="text-sm text-red-600">
			{error}
		</p>
	{/if}
</div>
