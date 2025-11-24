<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import Button from '$lib/components/Button.svelte';
	import Container from '$lib/components/Container.svelte';
	import Card from '$lib/components/Card.svelte';
	import Grid from '$lib/components/Grid.svelte';

	let modalOpen = false;
	let showSuccessToast = false;
	let showErrorToast = false;
	let showWarningToast = false;
	let showInfoToast = false;
	let showFullscreenLoading = false;

	function openModal() {
		modalOpen = true;
	}

	function showToast(type: string) {
		if (type === 'success') showSuccessToast = true;
		if (type === 'error') showErrorToast = true;
		if (type === 'warning') showWarningToast = true;
		if (type === 'info') showInfoToast = true;
	}

	function simulateLoading() {
		showFullscreenLoading = true;
		setTimeout(() => {
			showFullscreenLoading = false;
		}, 3000);
	}
</script>

<Container maxWidth="2xl">
	<div class="py-12 space-y-12">
		<div>
			<h1 class="text-4xl font-bold text-neutral-900 mb-2">Feedback Components</h1>
			<p class="text-lg text-neutral-600">Components for user feedback and loading states</p>
		</div>

		<!-- Modal Component -->
		<section class="space-y-6">
			<div>
				<h2 class="text-2xl font-semibold text-neutral-900 mb-2">Modal</h2>
				<p class="text-neutral-600">Accessible modal dialog with animations</p>
			</div>

			<Card>
				<div slot="header" class="font-semibold">Modal Demo</div>
				<div class="space-y-4">
					<Button on:click={openModal}>Open Modal</Button>
					<ul class="list-disc list-inside text-neutral-600 space-y-1">
						<li>Click outside to close</li>
						<li>Press ESC to close</li>
						<li>Body scroll locking</li>
						<li>Focus trapping</li>
						<li>Multiple sizes supported</li>
					</ul>
				</div>
			</Card>
		</section>

		<!-- Toast Component -->
		<section class="space-y-6">
			<div>
				<h2 class="text-2xl font-semibold text-neutral-900 mb-2">Toast</h2>
				<p class="text-neutral-600">Notification toasts with auto-dismiss</p>
			</div>

			<Card>
				<div slot="header" class="font-semibold">Toast Examples</div>
				<Grid cols={2} md={4} gap="normal">
					<Button on:click={() => showToast('success')}>Success Toast</Button>
					<Button on:click={() => showToast('error')}>Error Toast</Button>
					<Button on:click={() => showToast('warning')}>Warning Toast</Button>
					<Button on:click={() => showToast('info')}>Info Toast</Button>
				</Grid>
			</Card>
		</section>

		<!-- Loading Component -->
		<section class="space-y-6">
			<div>
				<h2 class="text-2xl font-semibold text-neutral-900 mb-2">Loading</h2>
				<p class="text-neutral-600">Loading spinners in multiple sizes</p>
			</div>

			<Card>
				<div slot="header" class="font-semibold">Inline Loading</div>
				<div class="space-y-6">
					<div class="flex items-center gap-6">
						<div>
							<p class="text-sm text-neutral-600 mb-2">Small</p>
							<Loading size="small" />
						</div>
						<div>
							<p class="text-sm text-neutral-600 mb-2">Medium</p>
							<Loading size="medium" />
						</div>
						<div>
							<p class="text-sm text-neutral-600 mb-2">Large</p>
							<Loading size="large" />
						</div>
					</div>

					<div>
						<p class="text-sm text-neutral-600 mb-2">With Text</p>
						<Loading size="medium" text="Loading..." />
					</div>
				</div>
			</Card>

			<Card>
				<div slot="header" class="font-semibold">Fullscreen Loading</div>
				<div>
					<Button on:click={simulateLoading}>Show Fullscreen Loading</Button>
					<p class="text-sm text-neutral-500 mt-2">Will show for 3 seconds</p>
				</div>
			</Card>
		</section>
	</div>
</Container>

<!-- Modal -->
<Modal bind:open={modalOpen} title="Example Modal" size="medium">
	<div class="space-y-4">
		<p class="text-neutral-600">This is an example modal dialog. You can add any content here.</p>
		<p class="text-neutral-600">
			The modal supports header, body, and footer sections with full customization.
		</p>
	</div>

	<div slot="footer" let:close>
		<Button variant="ghost" on:click={close}>Cancel</Button>
		<Button on:click={close}>Confirm</Button>
	</div>
</Modal>

<!-- Toasts -->
{#if showSuccessToast}
	<Toast message="Action completed successfully!" type="success" bind:visible={showSuccessToast} />
{/if}

{#if showErrorToast}
	<Toast
		message="An error occurred. Please try again."
		type="error"
		bind:visible={showErrorToast}
	/>
{/if}

{#if showWarningToast}
	<Toast
		message="Warning: This action cannot be undone."
		type="warning"
		bind:visible={showWarningToast}
	/>
{/if}

{#if showInfoToast}
	<Toast message="Here's some helpful information." type="info" bind:visible={showInfoToast} />
{/if}

<!-- Fullscreen Loading -->
{#if showFullscreenLoading}
	<Loading fullscreen text="Loading, please wait..." />
{/if}
