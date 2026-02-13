<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="h-full w-full space-y-6 overflow-y-auto p-6">
	<div class="space-y-2">
		<h1 class="text-2xl font-bold tracking-tight">{data.category.name}</h1>
		<p class="text-sm text-muted-foreground">
			{data.tools.length} tool{data.tools.length !== 1 ? 's' : ''} in this category
		</p>
	</div>

	<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each data.tools as tool (tool.slug)}
			{@const ToolIcon = tool.icon}
			<a
				href="/tools/{tool.category}/{tool.slug}"
				class="group relative flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50"
				class:opacity-50={!tool.implemented}
			>
				<div class="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
					<ToolIcon class="size-4 text-muted-foreground" />
				</div>
				<div class="flex flex-1 flex-col gap-0.5">
					<div class="flex items-center justify-between">
						<h3 class="text-sm font-medium">{tool.name}</h3>
						{#if !tool.implemented}
							<Badge variant="secondary" class="text-[10px]">Soon</Badge>
						{/if}
					</div>
					<p class="text-xs text-muted-foreground">{tool.description}</p>
				</div>
			</a>
		{/each}
	</div>
</div>
