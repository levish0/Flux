<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import CodeEditor from '$lib/components/app/code-editor.svelte';
	import ToolOptionRow from '$lib/components/app/tool-option-row.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import xmlFormat from 'xml-formatter';

	let indentation = $state('2-spaces');
	let input = $state('');

	const indentOptions = [
		{ value: '2-spaces', label: '2 Spaces' },
		{ value: '4-spaces', label: '4 Spaces' },
		{ value: 'tab', label: 'Tab' },
		{ value: 'minified', label: 'Minified' }
	];

	function getIndent(): string {
		switch (indentation) {
			case '2-spaces': return '  ';
			case '4-spaces': return '    ';
			case 'tab': return '\t';
			default: return '';
		}
	}

	let output = $derived.by(() => {
		if (!input.trim()) return '';
		try {
			if (indentation === 'minified') {
				return xmlFormat(input, { indentation: '', collapseContent: true, lineSeparator: '' });
			}
			return xmlFormat(input, { indentation: getIndent(), collapseContent: true });
		} catch (e) {
			return `<!-- Error: ${e instanceof Error ? e.message : 'Failed to format XML'} -->`;
		}
	});
</script>

<ToolPage title="XML Formatter" fillHeight>
	<ToolOptionRow label="Indentation">
		<Select.Root type="single" bind:value={indentation}>
			<Select.Trigger class="w-[130px]" size="sm">
				{indentOptions.find((o) => o.value === indentation)?.label}
			</Select.Trigger>
			<Select.Content>
				{#each indentOptions as option (option.value)}
					<Select.Item value={option.value} label={option.label} />
				{/each}
			</Select.Content>
		</Select.Root>
	</ToolOptionRow>

	<Resizable.PaneGroup direction="horizontal" class="!h-0 min-h-0 flex-1">
		<Resizable.Pane defaultSize={50} minSize={20}>
			<CodeEditor label="Input" bind:value={input} lang="xml" />
		</Resizable.Pane>
		<Resizable.Handle
			class="w-3 rounded bg-transparent transition-colors hover:bg-accent/50 data-[resize-handle-active]:bg-accent/50"
		/>
		<Resizable.Pane defaultSize={50} minSize={20}>
			<CodeEditor label="Output" value={output} readonly lang="xml" />
		</Resizable.Pane>
	</Resizable.PaneGroup>
</ToolPage>
