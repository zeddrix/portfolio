<script lang="ts">
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
	import ProjectForm from '$lib/components/admin/ProjectForm.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Edit Project - Admin - Zeddrix Portfolio</title>
</svelte:head>

<div class="space-y-6">
	<Breadcrumb
		items={[
			{ label: 'Dashboard', href: '/admin' },
			{ label: 'Projects', href: '/admin/projects' },
			{
				label: data.project?.title || 'Edit Project',
				href: `/admin/projects/${data.project?.id}/edit`
			}
		]}
	/>

	<div>
		<h1 class="text-3xl font-bold text-text-primary">Edit Project</h1>
		<p class="text-text-secondary mt-1">Update project information</p>
	</div>

	<ProjectForm
		project={data.project}
		isEdit={true}
		buttonTextPresets={data.buttonTextPresets}
		projectCategories={data.projectCategories}
	/>
</div>
