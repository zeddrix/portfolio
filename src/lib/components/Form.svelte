<script lang="ts">
	/**
	 * Form Component
	 *
	 * A form wrapper that handles submission and displays form-level errors.
	 * Supports loading state during submission.
	 */

	export let loading: boolean = false;
	export let error: string = '';
	export let success: string = '';

	function handleSubmit(_event: Event) {
		if (!loading) {
			// Allow the submit event to propagate
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit} {...$$restProps}>
	{#if error}
		<div
			class="mb-4 p-4 bg-error/10 border border-error/20 text-error rounded-lg text-sm"
			role="alert"
		>
			{error}
		</div>
	{/if}

	{#if success}
		<div
			class="mb-4 p-4 bg-success/10 border border-success/20 text-successDark rounded-lg text-sm"
			role="alert"
		>
			{success}
		</div>
	{/if}

	<div class="space-y-4">
		<slot />
	</div>

	<div class="mt-6">
		<slot name="actions" {loading} />
	</div>
</form>
