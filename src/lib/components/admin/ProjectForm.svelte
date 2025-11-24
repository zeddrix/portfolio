<script lang="ts">
	import { enhance } from '$app/forms';
	import RichTextEditor from './RichTextEditor.svelte';
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

	$: if (autoGenerateSlug && title) {
		slug = generateSlug(title);
	}

	// Computed tech stack array for form submission
	$: techStackArray = techStackInput
		.split(',')
		.map((t) => t.trim())
		.filter(Boolean);
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
				<label class="block text-sm font-semibold text-text-primary mb-2">Challenge</label>
				<input type="hidden" name="challenge" value={challenge} />
				<RichTextEditor bind:value={challenge} minHeight="200px" />
			</div>
			<div>
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

	<!-- Media (simplified - featured image required, others optional) -->
	<div class="bg-surface border border-border rounded-lg p-6">
		<h2 class="text-xl font-bold text-text-primary mb-4">Media</h2>
		<div class="space-y-4">
			<div>
				<label class="block text-sm font-semibold text-text-primary mb-2">
					Featured Image <span class="text-error">*</span>
				</label>
				<input
					type="url"
					bind:value={featuredImageUrl}
					placeholder="Cloudinary URL or upload image"
					class="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
				/>
				<input type="hidden" name="featured_image_url" value={featuredImageUrl} />
				<input
					type="hidden"
					name="featured_image_cloudinary_id"
					value={featuredImageCloudinaryId}
				/>
				<p class="text-xs text-text-secondary mt-1">For now, upload to Cloudinary and paste URL</p>
			</div>
		</div>
		<input type="hidden" name="gallery_images" value={JSON.stringify(galleryImages)} />
		<input type="hidden" name="demo_video_url" value={demoVideoUrl} />
		<input type="hidden" name="demo_video_cloudinary_id" value={demoVideoCloudinaryId} />
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
