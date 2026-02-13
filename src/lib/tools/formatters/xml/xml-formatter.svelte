<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import ToolOptionRow from '$lib/components/app/tool-option-row.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
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
			return `⚠ ${e instanceof Error ? e.message : 'Failed to format XML'}`;
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

	<ToolTextarea label="Input" bind:value={input} placeholder="Paste XML here..." grow />
	<ToolTextarea label="Output" value={output} readonly grow />
</ToolPage>
