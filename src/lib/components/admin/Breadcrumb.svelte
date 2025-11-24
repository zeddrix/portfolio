<script lang="ts">
	export let items: Array<{ label: string; href?: string }> = [];
</script>

<nav class="flex mb-6" aria-label="Breadcrumb">
	<ol class="inline-flex items-center space-x-1 md:space-x-3">
		<li class="inline-flex items-center">
			<a
				href="/admin"
				class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
			>
				<span class="material-icons text-base mr-1">home</span>
				Dashboard
			</a>
		</li>
		{#each items as item, index}
			<li>
				<div class="flex items-center">
					<span class="material-icons text-gray-400 text-base">chevron_right</span>
					{#if item.href && index < items.length - 1}
						<a
							href={item.href}
							class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
						>
							{item.label}
						</a>
					{:else}
						<span class="ml-1 text-sm font-medium text-gray-500 md:ml-2" aria-current="page">
							{item.label}
						</span>
					{/if}
				</div>
			</li>
		{/each}
	</ol>
</nav>
