<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import ToolOptionRow from '$lib/components/app/tool-option-row.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { UseClipboard } from '$lib/hooks/use-clipboard.svelte';
	import { toast } from 'svelte-sonner';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import CheckIcon from '@lucide/svelte/icons/check';

	let input = $state('');
	let uppercase = $state(false);
	let outputType = $state('hex');
	let hmacMode = $state(false);
	let secretKey = $state('');

	const outputTypeOptions = [
		{ value: 'hex', label: 'Hex' },
		{ value: 'base64', label: 'Base64' }
	];

	const algorithms: { name: string; algorithm: string }[] = [
		{ name: 'SHA-1', algorithm: 'SHA-1' },
		{ name: 'SHA-256', algorithm: 'SHA-256' },
		{ name: 'SHA-384', algorithm: 'SHA-384' },
		{ name: 'SHA-512', algorithm: 'SHA-512' }
	];

	interface HashResult {
		name: string;
		value: string;
	}

	let hashes = $state<HashResult[]>([]);

	function bufferToHex(buffer: ArrayBuffer): string {
		const hex = Array.from(new Uint8Array(buffer))
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');
		return uppercase ? hex.toUpperCase() : hex;
	}

	function bufferToBase64(buffer: ArrayBuffer): string {
		const bytes = new Uint8Array(buffer);
		let binary = '';
		for (const byte of bytes) {
			binary += String.fromCharCode(byte);
		}
		return btoa(binary);
	}

	function formatOutput(buffer: ArrayBuffer): string {
		return outputType === 'base64' ? bufferToBase64(buffer) : bufferToHex(buffer);
	}

	async function computeHash(algorithm: string, text: string): Promise<string> {
		const data = new TextEncoder().encode(text);
		const hashBuffer = await crypto.subtle.digest(algorithm, data);
		return formatOutput(hashBuffer);
	}

	async function computeHmac(algorithm: string, text: string, key: string): Promise<string> {
		const enc = new TextEncoder();
		const keyData = enc.encode(key);
		const cryptoKey = await crypto.subtle.importKey(
			'raw',
			keyData,
			{ name: 'HMAC', hash: algorithm },
			false,
			['sign']
		);
		const signature = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(text));
		return formatOutput(signature);
	}

	$effect(() => {
		// Track reactive dependencies
		const _input = input;
		const _uppercase = uppercase;
		const _outputType = outputType;
		const _hmacMode = hmacMode;
		const _secretKey = secretKey;

		if (!_input) {
			hashes = [];
			return;
		}

		Promise.all(
			algorithms.map(async (algo) => ({
				name: _hmacMode ? `HMAC-${algo.name}` : algo.name,
				value: _hmacMode
					? await computeHmac(algo.algorithm, _input, _secretKey)
					: await computeHash(algo.algorithm, _input)
			}))
		).then((results) => {
			hashes = results;
		});
	});
</script>

<ToolPage title="Hash Generator">
	<ToolOptionRow label="Uppercase" description="Show hash in uppercase">
		<Switch bind:checked={uppercase} />
	</ToolOptionRow>

	<ToolOptionRow label="Output Type" description="Hash output format">
		<Select.Root type="single" bind:value={outputType}>
			<Select.Trigger class="w-[120px]" size="sm">
				{outputTypeOptions.find((o) => o.value === outputType)?.label ?? 'Hex'}
			</Select.Trigger>
			<Select.Content>
				{#each outputTypeOptions as option (option.value)}
					<Select.Item value={option.value} label={option.label} />
				{/each}
			</Select.Content>
		</Select.Root>
	</ToolOptionRow>

	<ToolOptionRow label="HMAC Mode" description="Use HMAC with a secret key">
		<Switch bind:checked={hmacMode} />
	</ToolOptionRow>

	<ToolTextarea label="Input" bind:value={input} placeholder="Enter text to hash..." />

	{#if hmacMode}
		<ToolTextarea
			label="Secret Key"
			bind:value={secretKey}
			placeholder="Enter secret key for HMAC..."
		/>
	{/if}

	{#if hashes.length > 0}
		<div class="space-y-3">
			{#each hashes as hash (hash.name)}
				{@const clipboard = new UseClipboard()}
				<div class="space-y-1">
					<div class="flex items-center justify-between">
						<span class="text-xs font-medium text-muted-foreground">{hash.name}</span>
						<Button
							variant="ghost"
							size="icon"
							class="size-7"
							onclick={async () => {
								const result = await clipboard.copy(hash.value);
								if (result === 'success') toast.success(`Copied ${hash.name} hash`);
							}}
						>
							{#if clipboard.copied}
								<CheckIcon class="size-3.5" />
							{:else}
								<CopyIcon class="size-3.5" />
							{/if}
						</Button>
					</div>
					<div class="rounded-md bg-muted px-3 py-2 font-mono text-xs break-all select-all">
						{hash.value}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</ToolPage>
