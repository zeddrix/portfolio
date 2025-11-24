<script lang="ts">
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
	import ProjectForm from '$lib/components/admin/ProjectForm.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Create Project - Admin - Zeddrix Portfolio</title>
</svelte:head>

<div class="space-y-6">
	<Breadcrumb
		items={[
			{ label: 'Dashboard', href: '/admin' },
			{ label: 'Projects', href: '/admin/projects' },
			{ label: 'Create New', href: '/admin/projects/new' }
		]}
	/>

	<div>
		<h1 class="text-3xl font-bold text-text-primary">Create New Project</h1>
		<p class="text-text-secondary mt-1">Add a new project to your portfolio</p>
	</div>

	<ProjectForm project={data.project} isEdit={false} />
</div>
