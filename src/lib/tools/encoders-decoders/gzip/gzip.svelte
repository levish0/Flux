<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import ToolOptionRow from '$lib/components/app/tool-option-row.svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let compress = $state(true);
	let input = $state('');

	async function gzipCompress(str: string): Promise<string> {
		const encoder = new TextEncoder();
		const data = encoder.encode(str);
		const cs = new CompressionStream('gzip');
		const writer = cs.writable.getWriter();
		writer.write(data);
		writer.close();
		const chunks: Uint8Array[] = [];
		const reader = cs.readable.getReader();
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			chunks.push(value);
		}
		const totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
		const result = new Uint8Array(totalLen);
		let offset = 0;
		for (const chunk of chunks) {
			result.set(chunk, offset);
			offset += chunk.length;
		}
		let binary = '';
		for (const byte of result) {
			binary += String.fromCharCode(byte);
		}
		return btoa(binary);
	}

	async function gzipDecompress(b64: string): Promise<string> {
		const binary = atob(b64);
		const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
		const ds = new DecompressionStream('gzip');
		const writer = ds.writable.getWriter();
		writer.write(bytes);
		writer.close();
		const chunks: Uint8Array[] = [];
		const reader = ds.readable.getReader();
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			chunks.push(value);
		}
		const totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
		const result = new Uint8Array(totalLen);
		let offset = 0;
		for (const chunk of chunks) {
			result.set(chunk, offset);
			offset += chunk.length;
		}
		return new TextDecoder().decode(result);
	}

	let output = $state('');
	let error = $state('');

	$effect(() => {
		error = '';
		const trimmed = input.trim();
		if (!trimmed) {
			output = '';
			return;
		}

		const doConvert = async () => {
			try {
				output = compress ? await gzipCompress(trimmed) : await gzipDecompress(trimmed);
			} catch {
				error = compress ? 'Failed to compress' : 'Invalid GZip data (expected Base64-encoded GZip)';
				output = '';
			}
		};
		doConvert();
	});

	function handleToggle(checked: boolean) {
		const currentOutput = output;
		if (currentOutput && !error) {
			input = currentOutput;
		}
		compress = checked;
	}
</script>

<ToolPage title="GZip Compress / Decompress" fillHeight>
	<ToolOptionRow
		label="Conversion"
		description={compress ? 'Compressing text → GZip (Base64)' : 'Decompressing GZip (Base64) → text'}
	>
		<div class="flex items-center gap-2">
			<Label class="text-xs text-muted-foreground">Decompress</Label>
			<Switch checked={compress} onCheckedChange={handleToggle} />
			<Label class="text-xs text-muted-foreground">Compress</Label>
		</div>
	</ToolOptionRow>

	{#if error}
		<div class="shrink-0 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
			{error}
		</div>
	{/if}

	<ToolTextarea
		label="Input"
		bind:value={input}
		placeholder={compress ? 'Enter text to compress...' : 'Enter Base64-encoded GZip data...'}
		grow
	/>
	<ToolTextarea label="Output" value={output} readonly grow />
</ToolPage>
