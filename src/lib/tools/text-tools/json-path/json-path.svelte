<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { JSONPath } from 'jsonpath-plus';

	let jsonInput = $state(`{
  "store": {
    "name": "My Store",
    "books": [
      { "title": "Book A", "price": 10 },
      { "title": "Book B", "price": 20 },
      { "title": "Book C", "price": 15 }
    ],
    "owner": {
      "name": "John",
      "age": 30
    }
  }
}`);
	let pathInput = $state('$.store.books[0].title');

	let result = $derived.by(() => {
		if (!jsonInput.trim() || !pathInput.trim()) return '';

		try {
			const obj = JSON.parse(jsonInput);
			const matches = JSONPath({ path: pathInput.trim(), json: obj });

			if (!matches || matches.length === 0) return 'No matches found.';
			if (matches.length === 1) return JSON.stringify(matches[0], null, 2);
			return JSON.stringify(matches, null, 2);
		} catch (e) {
			return `⚠ ${e instanceof Error ? e.message : 'Error'}`;
		}
	});
</script>

<ToolPage title="JSON Path Tester" fillHeight>
	<div class="shrink-0 space-y-1.5">
		<Label class="text-sm font-medium">JSONPath Expression</Label>
		<Input class="font-mono" bind:value={pathInput} placeholder="$.store.books[*].title" />
		<p class="text-xs text-muted-foreground">Supports: $.property, [index], [*], .., [?(@.price>10)]</p>
	</div>

	<ToolTextarea label="JSON" bind:value={jsonInput} placeholder="Paste JSON here..." grow />
	<ToolTextarea label="Result" value={result} readonly rows={6} />
</ToolPage>
