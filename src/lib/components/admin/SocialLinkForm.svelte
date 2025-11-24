<script lang="ts">
	/**
	 * Social link form component for creating/editing social links
	 */

	import type { Database } from '$lib/types/database';

	type SocialLink = Database['public']['Tables']['social_links']['Row'];

	export let link: SocialLink | null = null;
	export let onSubmit: (data: FormData) => void;
	export let onCancel: () => void;

	let platform = link?.platform || '';
	let url = link?.url || '';
	let iconName = link?.icon_name || '';
	let isVisible = link?.is_visible ?? true;

	// Common social platforms with their icons
	const platforms = [
		{ name: 'GitHub', icon: 'code' },
		{ name: 'LinkedIn', icon: 'work' },
		{ name: 'Twitter', icon: 'tag' },
		{ name: 'Facebook', icon: 'public' },
		{ name: 'Instagram', icon: 'photo_camera' },
		{ name: 'YouTube', icon: 'video_library' },
		{ name: 'Portfolio', icon: 'web' },
		{ name: 'Email', icon: 'email' },
		{ name: 'Other', icon: 'link' }
	];

	function handlePlatformSelect(selectedPlatform: string, icon: string) {
		platform = selectedPlatform;
		iconName = icon;
	}

	function handleSubmit() {
		const formData = new FormData();
		if (link?.id) {
			formData.append('id', link.id);
		}
		formData.append('platform', platform);
		formData.append('url', url);
		formData.append('icon_name', iconName);
		formData.append('is_visible', isVisible.toString());

		onSubmit(formData);
	}
</script>

<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
	<h3 class="text-lg font-semibold text-gray-900 mb-4">
		{link ? 'Edit Social Link' : 'Add New Social Link'}
	</h3>

	<form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<!-- Platform Selection -->
		<div>
			<label for="platform" class="block text-sm font-medium text-gray-700 mb-2"> Platform </label>
			<div class="grid grid-cols-3 gap-2 mb-2">
				{#each platforms as p}
					<button
						type="button"
						class="flex items-center gap-2 px-3 py-2 border rounded-md transition-colors {platform ===
						p.name
							? 'border-blue-500 bg-blue-50 text-blue-700'
							: 'border-gray-300 hover:border-gray-400'}"
						on:click={() => handlePlatformSelect(p.name, p.icon)}
					>
						<span class="material-icons text-sm">{p.icon}</span>
						<span class="text-sm">{p.name}</span>
					</button>
				{/each}
			</div>
			<input
				id="platform"
				type="text"
				bind:value={platform}
				placeholder="Or enter custom platform name"
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
				required
			/>
		</div>

		<!-- URL -->
		<div>
			<label for="url" class="block text-sm font-medium text-gray-700 mb-2"> URL </label>
			<input
				id="url"
				type="url"
				bind:value={url}
				placeholder="https://example.com/yourprofile"
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
				required
			/>
		</div>

		<!-- Icon Name -->
		<div>
			<label for="icon_name" class="block text-sm font-medium text-gray-700 mb-2">
				Icon Name (Material Icons)
			</label>
			<div class="flex gap-2">
				<input
					id="icon_name"
					type="text"
					bind:value={iconName}
					placeholder="link"
					class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
					required
				/>
				{#if iconName}
					<span class="material-icons text-3xl text-gray-600">{iconName}</span>
				{/if}
			</div>
			<p class="text-xs text-gray-500 mt-1">
				Find icons at <a
					href="https://fonts.google.com/icons"
					target="_blank"
					class="text-blue-600 hover:underline"
				>
					Google Material Icons
				</a>
			</p>
		</div>

		<!-- Visibility Toggle -->
		<div class="flex items-center gap-2">
			<input
				id="is_visible"
				type="checkbox"
				bind:checked={isVisible}
				class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
			/>
			<label for="is_visible" class="text-sm font-medium text-gray-700">
				Visible on public site
			</label>
		</div>

		<!-- Actions -->
		<div class="flex gap-3 pt-4">
			<button
				type="submit"
				class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
			>
				{link ? 'Update' : 'Create'} Link
			</button>
			<button
				type="button"
				on:click={onCancel}
				class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
			>
				Cancel
			</button>
		</div>
	</form>
</div>
