<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import ToolOptionRow from '$lib/components/app/tool-option-row.svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let encode = $state(true);
	let input = $state('');

	let output = $derived.by(() => {
		if (!input) return '';
		try {
			return encode ? encodeURIComponent(input) : decodeURIComponent(input);
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

<ToolPage title="URL Encoder / Decoder" fillHeight>
	<ToolOptionRow
		label="Conversion"
		description={encode ? 'Encoding text → URL' : 'Decoding URL → text'}
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
		placeholder={encode ? 'Enter text to encode...' : 'Enter URL-encoded text to decode...'}
		grow
	/>
	<ToolTextarea label="Output" value={output} readonly grow />
</ToolPage>
