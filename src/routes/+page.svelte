<script lang="ts">
	import { categories, toolsByCategory, searchTools } from '$lib/tools/registry';
	import SearchIcon from '@lucide/svelte/icons/search';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';

	let searchQuery = $state('');

	let displayCategories = $derived.by(() => {
		if (!searchQuery.trim()) {
			return categories.map((cat) => ({
				...cat,
				tools: toolsByCategory.get(cat.slug) ?? []
			}));
		}
		const matched = searchTools(searchQuery);
		return categories
			.map((cat) => ({
				...cat,
				tools: matched.filter((t) => t.category === cat.slug)
			}))
			.filter((cat) => cat.tools.length > 0);
	});
</script>

<div class="w-full space-y-8 p-6">
	<div class="space-y-2">
		<h1 class="text-3xl font-bold tracking-tight">All Tools</h1>
		<p class="text-muted-foreground">A collection of developer utilities, all in one place.</p>
	</div>

	<div class="relative max-w-md">
		<SearchIcon
			class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
		/>
		<Input placeholder="Search tools..." class="pl-9" bind:value={searchQuery} />
	</div>

	{#each displayCategories as cat (cat.slug)}
		<section class="space-y-3">
			<div class="flex items-center gap-2">
				<h2 class="text-lg font-semibold">{cat.name}</h2>
				<span class="text-sm text-muted-foreground">({cat.tools.length})</span>
			</div>

			<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each cat.tools as tool (tool.slug)}
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
		</section>
	{/each}

	{#if displayCategories.length === 0}
		<div class="py-12 text-center text-muted-foreground">
			No tools found matching "{searchQuery}"
		</div>
	{/if}
</div>
