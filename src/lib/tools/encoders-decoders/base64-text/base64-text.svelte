<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import ToolOptionRow from '$lib/components/app/tool-option-row.svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	let encode = $state(true);
	let encoding = $state('utf-8');
	let input = $state('');

	const encodingOptions = [
		{ value: 'utf-8', label: 'UTF-8' },
		{ value: 'ascii', label: 'ASCII' }
	];

	function base64Encode(str: string): string {
		if (encoding === 'ascii') {
			// ASCII: only keep chars 0-127
			const ascii = Array.from(str)
				.map((c) => c.charCodeAt(0))
				.filter((code) => code < 128);
			return btoa(String.fromCharCode(...ascii));
		}
		// UTF-8
		const bytes = new TextEncoder().encode(str);
		let binary = '';
		for (const byte of bytes) {
			binary += String.fromCharCode(byte);
		}
		return btoa(binary);
	}

	function base64Decode(str: string): string {
		// Pad if needed
		const remainder = str.length % 4;
		if (remainder > 0) {
			str = str.padEnd(str.length + (4 - remainder), '=');
		}
		const binary = atob(str);
		if (encoding === 'ascii') {
			return binary;
		}
		// UTF-8
		const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
		return new TextDecoder('utf-8').decode(bytes);
	}

	let output = $derived.by(() => {
		if (!input) return '';
		try {
			return encode ? base64Encode(input) : base64Decode(input);
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

<ToolPage title="Base64 Text" fillHeight>
	<ToolOptionRow
		label="Conversion"
		description={encode ? 'Encoding text → Base64' : 'Decoding Base64 → text'}
	>
		<div class="flex items-center gap-2">
			<Label class="text-xs text-muted-foreground">Decode</Label>
			<Switch checked={encode} onCheckedChange={handleToggle} />
			<Label class="text-xs text-muted-foreground">Encode</Label>
		</div>
	</ToolOptionRow>

	<ToolOptionRow label="Encoding" description="Character encoding for the text">
		<Select.Root type="single" bind:value={encoding}>
			<Select.Trigger class="w-[120px]" size="sm">
				{encodingOptions.find((o) => o.value === encoding)?.label ?? 'UTF-8'}
			</Select.Trigger>
			<Select.Content>
				{#each encodingOptions as option (option.value)}
					<Select.Item value={option.value} label={option.label} />
				{/each}
			</Select.Content>
		</Select.Root>
	</ToolOptionRow>

	<ToolTextarea
		label="Input"
		bind:value={input}
		placeholder={encode ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
		grow
	/>
	<ToolTextarea label="Output" value={output} readonly grow />
</ToolPage>
