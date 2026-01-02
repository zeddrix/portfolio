<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let loading = false;
	let showNotification = false;
	let notificationMessage = '';
	let notificationType: 'success' | 'error' = 'success';

	// Form values
	let heroAnimationType = data.settings.hero_animation_type;
	let heroIntroDuration = data.settings.hero_intro_duration;
	let heroVideoDuration = data.settings.hero_video_duration;

	// Animation type options
	const animationTypes = [
		{ value: 'fade_up', label: 'Fade Up', description: 'Text fades in while moving upward' },
		{
			value: 'typewriter',
			label: 'Typewriter',
			description: 'Text appears character by character'
		},
		{
			value: 'slide_in',
			label: 'Slide In',
			description: 'Text slides in from the side'
		}
	];

	// Show notification when form action completes
	$: if (form) {
		if (form.success) {
			showNotification = true;
			notificationMessage = form.message || 'Settings updated successfully';
			notificationType = 'success';
			invalidateAll();
			setTimeout(() => {
				showNotification = false;
			}, 5000);
		} else if (form.error) {
			showNotification = true;
			notificationMessage = form.error;
			notificationType = 'error';
			setTimeout(() => {
				showNotification = false;
			}, 5000);
		}
	}

	// Format milliseconds to seconds for display
	function msToSeconds(ms: number): string {
		return (ms / 1000).toFixed(1) + 's';
	}
</script>

<svelte:head>
	<title>Hero Settings - Admin</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
	<Breadcrumb
		items={[
			{ label: 'Dashboard', href: '/admin' },
			{ label: 'Settings', href: '/admin/settings' },
			{ label: 'Hero Settings', href: '/admin/settings/hero' }
		]}
	/>

	<div class="mb-8">
		<h1 class="text-3xl font-bold text-text-primary mb-2">Hero Settings</h1>
		<p class="text-text-secondary">Configure the hero section animation and display settings.</p>
	</div>

	<!-- Success/Error Notification -->
	{#if showNotification}
		<div class="fixed top-4 right-4 z-50 max-w-md animate-slide-in" role="alert" aria-live="polite">
			<div
				class="p-4 rounded-lg shadow-xl border flex items-start gap-3
				{notificationType === 'success'
					? 'bg-success/10 border-success text-success'
					: 'bg-error/10 border-error text-error'}
			"
			>
				<span class="material-icons">
					{notificationType === 'success' ? 'check_circle' : 'error'}
				</span>
				<div class="flex-1">
					<p class="font-medium">{notificationMessage}</p>
				</div>
				<button
					type="button"
					on:click={() => (showNotification = false)}
					class="text-current hover:opacity-70 transition-opacity"
				>
					<span class="material-icons text-sm">close</span>
				</button>
			</div>
		</div>
	{/if}

	<form
		method="POST"
		action="?/updateHeroSettings"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
				loading = false;
			};
		}}
	>
		<div class="space-y-8">
			<!-- Animation Type -->
			<section class="bg-surface rounded-lg border border-border p-6">
				<h2 class="text-xl font-semibold text-text-primary mb-2">Animation Type</h2>
				<p class="text-text-secondary text-sm mb-6">
					Choose how the intro text animates when visitors first see your site.
				</p>

				<div class="grid gap-4 sm:grid-cols-3">
					{#each animationTypes as type}
						<label
							class="relative flex flex-col p-4 cursor-pointer rounded-lg border-2 transition-all
							{heroAnimationType === type.value
								? 'border-primary bg-primary/5'
								: 'border-border hover:border-primary/50'}
						"
						>
							<input
								type="radio"
								name="hero_animation_type"
								value={type.value}
								bind:group={heroAnimationType}
								class="sr-only"
							/>
							<span class="text-lg font-medium text-text-primary">{type.label}</span>
							<span class="text-sm text-text-secondary mt-1">{type.description}</span>
							{#if heroAnimationType === type.value}
								<span class="absolute top-2 right-2 text-primary">
									<span class="material-icons">check_circle</span>
								</span>
							{/if}
						</label>
					{/each}
				</div>
			</section>

			<!-- Intro Duration -->
			<section class="bg-surface rounded-lg border border-border p-6">
				<h2 class="text-xl font-semibold text-text-primary mb-2">Intro Duration</h2>
				<p class="text-text-secondary text-sm mb-6">
					How long the intro text is displayed before transitioning to the video carousel.
				</p>

				<div class="flex items-center gap-4">
					<input
						type="range"
						name="hero_intro_duration"
						min="3000"
						max="10000"
						step="500"
						bind:value={heroIntroDuration}
						class="flex-1 h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
					/>
					<span
						class="text-lg font-semibold text-text-primary min-w-[4rem] text-right tabular-nums"
					>
						{msToSeconds(heroIntroDuration)}
					</span>
				</div>
				<div class="flex justify-between text-xs text-text-secondary mt-2">
					<span>3s (Quick)</span>
					<span>10s (Slow)</span>
				</div>
			</section>

			<!-- Video Duration -->
			<section class="bg-surface rounded-lg border border-border p-6">
				<h2 class="text-xl font-semibold text-text-primary mb-2">Video Duration</h2>
				<p class="text-text-secondary text-sm mb-6">
					How long each video plays in the carousel before transitioning to the next.
				</p>

				<div class="flex items-center gap-4">
					<input
						type="range"
						name="hero_video_duration"
						min="3000"
						max="10000"
						step="500"
						bind:value={heroVideoDuration}
						class="flex-1 h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
					/>
					<span
						class="text-lg font-semibold text-text-primary min-w-[4rem] text-right tabular-nums"
					>
						{msToSeconds(heroVideoDuration)}
					</span>
				</div>
				<div class="flex justify-between text-xs text-text-secondary mt-2">
					<span>3s (Quick)</span>
					<span>10s (Slow)</span>
				</div>
			</section>

			<!-- Submit Button -->
			<div class="flex justify-end">
				<button
					type="submit"
					disabled={loading}
					class="px-6 py-3 bg-primary text-white font-semibold rounded-lg
						   hover:bg-primary/90 transition-colors
						   disabled:opacity-50 disabled:cursor-not-allowed
						   flex items-center gap-2"
				>
					{#if loading}
						<span class="material-icons animate-spin">refresh</span>
						Saving...
					{:else}
						<span class="material-icons">save</span>
						Save Settings
					{/if}
				</button>
			</div>
		</div>
	</form>
</div>

<style>
	@keyframes slide-in {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	.animate-slide-in {
		animation: slide-in 0.3s ease-out;
	}
</style>
