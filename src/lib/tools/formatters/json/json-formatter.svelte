<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import CodeEditor from '$lib/components/app/code-editor.svelte';
	import ToolOptionRow from '$lib/components/app/tool-option-row.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';

	const indentOptions = [
		{ value: '2', label: '2 Spaces' },
		{ value: '4', label: '4 Spaces' },
		{ value: 'tab', label: '1 Tab' },
		{ value: 'minified', label: 'Minified' }
	];

	let indentValue = $state('2');
	let sortProperties = $state(false);
	let input = $state('');

	function sortKeys(obj: unknown): unknown {
		if (Array.isArray(obj)) return obj.map(sortKeys);
		if (obj !== null && typeof obj === 'object') {
			return Object.keys(obj as Record<string, unknown>)
				.sort()
				.reduce(
					(sorted, key) => {
						sorted[key] = sortKeys((obj as Record<string, unknown>)[key]);
						return sorted;
					},
					{} as Record<string, unknown>
				);
		}
		return obj;
	}

	let result = $derived.by(() => {
		if (!input.trim()) {
			return { output: '', error: '' };
		}
		try {
			let parsed = JSON.parse(input);
			if (sortProperties) {
				parsed = sortKeys(parsed);
			}
			let formatted: string;
			if (indentValue === 'minified') {
				formatted = JSON.stringify(parsed);
			} else if (indentValue === 'tab') {
				formatted = JSON.stringify(parsed, null, '\t');
			} else {
				formatted = JSON.stringify(parsed, null, Number(indentValue));
			}
			return { output: formatted, error: '' };
		} catch (e) {
			return { output: '', error: e instanceof Error ? e.message : 'Invalid JSON' };
		}
	});

	let output = $derived(result.output);
	let error = $derived(result.error);
</script>

<ToolPage title="JSON Formatter" fillHeight>
	<div class="shrink-0 space-y-4">
		<ToolOptionRow label="Indentation" description="Format style for the output">
			<Select.Root type="single" bind:value={indentValue}>
				<Select.Trigger class="w-[140px]" size="sm">
					{indentOptions.find((o) => o.value === indentValue)?.label ?? '2 Spaces'}
				</Select.Trigger>
				<Select.Content>
					{#each indentOptions as option (option.value)}
						<Select.Item value={option.value} label={option.label} />
					{/each}
				</Select.Content>
			</Select.Root>
		</ToolOptionRow>

		<ToolOptionRow label="Sort Properties" description="Sort JSON properties alphabetically">
			<Switch bind:checked={sortProperties} />
		</ToolOptionRow>

		{#if error}
			<div class="rounded-md border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-500">
				{error}
			</div>
		{/if}
	</div>

	<Resizable.PaneGroup direction="horizontal" class="!h-0 min-h-0 flex-1">
		<Resizable.Pane defaultSize={50} minSize={20}>
			<CodeEditor label="Input" bind:value={input} lang="json" />
		</Resizable.Pane>
		<Resizable.Handle
			class="w-3 rounded bg-transparent transition-colors hover:bg-accent/50 data-[resize-handle-active]:bg-accent/50"
		/>
		<Resizable.Pane defaultSize={50} minSize={20}>
			<CodeEditor label="Output" value={output} readonly lang="json" />
		</Resizable.Pane>
	</Resizable.PaneGroup>
</ToolPage>
