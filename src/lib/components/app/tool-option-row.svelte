<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		label,
		description,
		children
	}: {
		label: string;
		description?: string;
		children: Snippet;
	} = $props();
</script>

<div class="flex items-center justify-between rounded-lg border p-3">
	<div class="space-y-0.5">
		<div class="text-sm font-medium">{label}</div>
		{#if description}
			<div class="text-xs text-muted-foreground">{description}</div>
		{/if}
	</div>
	<div>
		{@render children()}
	</div>
</div>
