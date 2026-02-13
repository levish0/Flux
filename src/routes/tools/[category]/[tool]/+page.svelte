<script lang="ts">
	import { toolComponents } from '$lib/tools/components';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import type { PageData } from './$types';
	import type { Component } from 'svelte';

	let { data }: { data: PageData } = $props();

	let ToolComponent = $state<Component | null>(null);
	let loadError = $state('');

	$effect(() => {
		ToolComponent = null;
		loadError = '';
		const loader = toolComponents[data.tool.slug];
		if (!loader) {
			loadError = 'This tool is not yet implemented. Check back soon!';
			return;
		}
		loader()
			.then((mod) => {
				ToolComponent = mod.default;
			})
			.catch(() => {
				loadError = 'Failed to load tool component.';
			});
	});
</script>

{#if loadError}
	<div class="flex flex-1 flex-col items-center justify-center gap-4 p-6">
		<div class="text-center text-muted-foreground">
			<h2 class="mb-2 text-xl font-semibold">{data.tool.name}</h2>
			<p>{loadError}</p>
		</div>
	</div>
{:else if ToolComponent}
	<ToolComponent />
{:else}
	<div class="flex flex-1 items-center justify-center gap-2 p-6">
		<Spinner class="size-5" />
		<span class="text-sm text-muted-foreground">Loading...</span>
	</div>
{/if}
