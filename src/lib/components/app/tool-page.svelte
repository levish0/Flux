<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils";

	let {
		title,
		description,
		fillHeight = false,
		children,
	}: {
		title: string;
		description?: string;
		fillHeight?: boolean;
		children: Snippet;
	} = $props();
</script>

<div
	class={cn(
		"flex w-full flex-col gap-4 p-6",
		fillHeight && "h-full overflow-hidden"
	)}
>
	<div class="shrink-0">
		<h1 class="text-2xl font-bold tracking-tight">{title}</h1>
		{#if description}
			<p class="text-muted-foreground mt-1 text-sm">{description}</p>
		{/if}
	</div>
	{@render children()}
</div>
