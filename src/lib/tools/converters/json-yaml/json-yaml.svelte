<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import CodeEditor from '$lib/components/app/code-editor.svelte';
	import ToolOptionRow from '$lib/components/app/tool-option-row.svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
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
			return `Error: ${e instanceof Error ? e.message : 'Conversion error'}`;
		}
	});

	function handleToggle(checked: boolean) {
		const currentOutput = output;
		if (currentOutput && !currentOutput.startsWith('Error:')) {
			input = currentOutput;
		}
		jsonToYaml = checked;
	}

	let inputLang = $derived(jsonToYaml ? 'json' : 'yaml') as 'json' | 'yaml';
	let outputLang = $derived(jsonToYaml ? 'yaml' : 'json') as 'json' | 'yaml';
</script>

<ToolPage title="JSON <> YAML" fillHeight>
	<div class="shrink-0 space-y-2">
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
	</div>

	<Resizable.PaneGroup direction="horizontal" class="!h-0 min-h-0 flex-1">
		<Resizable.Pane defaultSize={50} minSize={20}>
			<CodeEditor label="Input" bind:value={input} lang={inputLang} />
		</Resizable.Pane>
		<Resizable.Handle
			class="w-3 rounded bg-transparent transition-colors hover:bg-accent/50 data-[resize-handle-active]:bg-accent/50"
		/>
		<Resizable.Pane defaultSize={50} minSize={20}>
			<CodeEditor label="Output" value={output} readonly lang={outputLang} />
		</Resizable.Pane>
	</Resizable.PaneGroup>
</ToolPage>
