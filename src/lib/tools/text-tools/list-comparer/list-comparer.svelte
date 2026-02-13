<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import ToolOptionRow from '$lib/components/app/tool-option-row.svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let listA = $state('');
	let listB = $state('');
	let caseSensitive = $state(true);
	let trimWhitespace = $state(true);

	function parseList(text: string): string[] {
		let lines = text.split('\n');
		if (trimWhitespace) lines = lines.map((l) => l.trim());
		lines = lines.filter(Boolean);
		if (!caseSensitive) lines = lines.map((l) => l.toLowerCase());
		return lines;
	}

	let results = $derived.by(() => {
		const a = parseList(listA);
		const b = parseList(listB);

		if (a.length === 0 && b.length === 0) return null;

		const setA = new Set(a);
		const setB = new Set(b);

		const onlyA = a.filter((item) => !setB.has(item));
		const onlyB = b.filter((item) => !setA.has(item));
		const intersection = a.filter((item) => setB.has(item));
		const union = [...new Set([...a, ...b])];

		// Deduplicate results
		const uniqueOnlyA = [...new Set(onlyA)];
		const uniqueOnlyB = [...new Set(onlyB)];
		const uniqueIntersection = [...new Set(intersection)];

		return { onlyA: uniqueOnlyA, onlyB: uniqueOnlyB, intersection: uniqueIntersection, union };
	});
</script>

<ToolPage title="List Comparer" fillHeight>
	<div class="shrink-0 space-y-2">
		<ToolOptionRow label="Case sensitive">
			<Switch bind:checked={caseSensitive} />
		</ToolOptionRow>
		<ToolOptionRow label="Trim whitespace">
			<Switch bind:checked={trimWhitespace} />
		</ToolOptionRow>
	</div>

	<div class="flex shrink-0 gap-4">
		<ToolTextarea label="List A" bind:value={listA} placeholder="One item per line..." rows={6} />
		<ToolTextarea label="List B" bind:value={listB} placeholder="One item per line..." rows={6} />
	</div>

	{#if results}
		<div class="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-auto lg:grid-cols-3">
			<div class="space-y-2">
				<Label class="text-sm font-medium">Only in A ({results.onlyA.length})</Label>
				<div class="max-h-48 overflow-auto rounded-lg border bg-red-500/5 p-3 font-mono text-sm">
					{#if results.onlyA.length > 0}
						{#each results.onlyA as item (item)}
							<div class="text-red-700 dark:text-red-400">{item}</div>
						{/each}
					{:else}
						<div class="text-muted-foreground">None</div>
					{/if}
				</div>
			</div>

			<div class="space-y-2">
				<Label class="text-sm font-medium">In Both ({results.intersection.length})</Label>
				<div class="max-h-48 overflow-auto rounded-lg border bg-green-500/5 p-3 font-mono text-sm">
					{#if results.intersection.length > 0}
						{#each results.intersection as item (item)}
							<div class="text-green-700 dark:text-green-400">{item}</div>
						{/each}
					{:else}
						<div class="text-muted-foreground">None</div>
					{/if}
				</div>
			</div>

			<div class="space-y-2">
				<Label class="text-sm font-medium">Only in B ({results.onlyB.length})</Label>
				<div class="max-h-48 overflow-auto rounded-lg border bg-blue-500/5 p-3 font-mono text-sm">
					{#if results.onlyB.length > 0}
						{#each results.onlyB as item (item)}
							<div class="text-blue-700 dark:text-blue-400">{item}</div>
						{/each}
					{:else}
						<div class="text-muted-foreground">None</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</ToolPage>
