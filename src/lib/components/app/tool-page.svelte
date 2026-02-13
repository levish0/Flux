<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		title,
		description,
		fillHeight = false,
		children
	}: {
		title: string;
		description?: string;
		fillHeight?: boolean;
		children: Snippet;
	} = $props();
</script>

<div class={cn('flex h-full w-full flex-col gap-4 p-6', fillHeight ? 'overflow-hidden' : 'overflow-y-auto')}>
	<div class="shrink-0">
		<h1 class="text-2xl font-bold tracking-tight">{title}</h1>
		{#if description}
			<p class="mt-1 text-sm text-muted-foreground">{description}</p>
		{/if}
	</div>
	{@render children()}
</div>
