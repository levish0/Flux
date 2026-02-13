<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import ToolOptionRow from '$lib/components/app/tool-option-row.svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import yaml from 'js-yaml';

	let jsonToYaml = $state(true);
	let indentSize = $state(2);
	let input = $state('');

	const indentOptions = [
		{ value: 2, label: '2 Spaces' },
		{ value: 4, label: '4 Spaces' }
	];

	let output = $derived.by(() => {
		if (!input.trim()) return '';
		try {
			if (jsonToYaml) {
				const obj = JSON.parse(input);
				return yaml.dump(obj, { indent: indentSize, lineWidth: -1 });
			} else {
				const obj = yaml.load(input);
				return JSON.stringify(obj, null, indentSize);
			}
		} catch (e) {
			return `⚠ ${e instanceof Error ? e.message : 'Conversion error'}`;
		}
	});

	function handleToggle(checked: boolean) {
		const currentOutput = output;
		if (currentOutput && !currentOutput.startsWith('⚠')) {
			input = currentOutput;
		}
		jsonToYaml = checked;
	}
</script>

<ToolPage title="JSON <> YAML" fillHeight>
	<ToolOptionRow
		label="Conversion"
		description={jsonToYaml ? 'JSON → YAML' : 'YAML → JSON'}
	>
		<div class="flex items-center gap-2">
			<Label class="text-xs text-muted-foreground">YAML→JSON</Label>
			<Switch checked={jsonToYaml} onCheckedChange={handleToggle} />
			<Label class="text-xs text-muted-foreground">JSON→YAML</Label>
		</div>
	</ToolOptionRow>

	<ToolOptionRow label="Indent">
		<Select.Root type="single" bind:value={indentSize}>
			<Select.Trigger class="w-[120px]" size="sm">
				{indentOptions.find((o) => o.value === indentSize)?.label}
			</Select.Trigger>
			<Select.Content>
				{#each indentOptions as option (option.value)}
					<Select.Item value={option.value} label={option.label} />
				{/each}
			</Select.Content>
		</Select.Root>
	</ToolOptionRow>

	<ToolTextarea
		label="Input"
		bind:value={input}
		placeholder={jsonToYaml ? 'Paste JSON here...' : 'Paste YAML here...'}
		grow
	/>
	<ToolTextarea label="Output" value={output} readonly grow />
</ToolPage>
