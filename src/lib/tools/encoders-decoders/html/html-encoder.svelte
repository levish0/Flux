<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import ToolOptionRow from '$lib/components/app/tool-option-row.svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let encode = $state(true);
	let input = $state('');

	function htmlEncode(str: string): string {
		const el = document.createElement('div');
		el.textContent = str;
		return el.innerHTML;
	}

	function htmlDecode(str: string): string {
		const el = document.createElement('textarea');
		el.innerHTML = str;
		return el.value;
	}

	let output = $derived.by(() => {
		if (!input) return '';
		try {
			return encode ? htmlEncode(input) : htmlDecode(input);
		} catch {
			return '⚠ Invalid input';
		}
	});

	function handleToggle(checked: boolean) {
		const currentOutput = output;
		if (currentOutput && !currentOutput.startsWith('⚠')) {
			input = currentOutput;
		}
		encode = checked;
	}
</script>

<ToolPage title="HTML Encoder / Decoder" fillHeight>
	<ToolOptionRow
		label="Conversion"
		description={encode ? 'Encoding text → HTML entities' : 'Decoding HTML entities → text'}
	>
		<div class="flex items-center gap-2">
			<Label class="text-xs text-muted-foreground">Decode</Label>
			<Switch checked={encode} onCheckedChange={handleToggle} />
			<Label class="text-xs text-muted-foreground">Encode</Label>
		</div>
	</ToolOptionRow>

	<ToolTextarea
		label="Input"
		bind:value={input}
		placeholder={encode ? 'Enter HTML to encode...' : 'Enter encoded entities to decode...'}
		grow
	/>
	<ToolTextarea label="Output" value={output} readonly grow />
</ToolPage>
