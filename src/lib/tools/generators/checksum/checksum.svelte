<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolOptionRow from '$lib/components/app/tool-option-row.svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import UploadIcon from '@lucide/svelte/icons/upload';
	import CheckIcon from '@lucide/svelte/icons/check';
	import XIcon from '@lucide/svelte/icons/x';

	let uppercase = $state(true);
	let algorithm = $state('SHA-256');
	let hashOutput = $state('');
	let compareValue = $state('');
	let fileName = $state('');
	let processing = $state(false);

	const algorithms = [
		{ value: 'SHA-1', label: 'SHA-1' },
		{ value: 'SHA-256', label: 'SHA-256' },
		{ value: 'SHA-384', label: 'SHA-384' },
		{ value: 'SHA-512', label: 'SHA-512' }
	];

	let displayHash = $derived(
		uppercase ? hashOutput.toUpperCase() : hashOutput.toLowerCase()
	);

	let compareResult = $derived.by(() => {
		if (!displayHash || !compareValue.trim()) return null;
		return displayHash.toLowerCase() === compareValue.trim().toLowerCase();
	});

	async function hashFile(file: File) {
		processing = true;
		fileName = file.name;
		try {
			const buffer = await file.arrayBuffer();
			const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
			const hashArray = Array.from(new Uint8Array(hashBuffer));
			hashOutput = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
		} catch {
			hashOutput = '';
		}
		processing = false;
	}

	function handleFileSelect() {
		const input = document.createElement('input');
		input.type = 'file';
		input.onchange = () => {
			const file = input.files?.[0];
			if (file) hashFile(file);
		};
		input.click();
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		const file = e.dataTransfer?.files[0];
		if (file) hashFile(file);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
	}
</script>

<ToolPage title="Checksum File">
	<div class="space-y-2">
		<ToolOptionRow label="Uppercase">
			<Switch bind:checked={uppercase} />
		</ToolOptionRow>

		<ToolOptionRow label="Hash Algorithm">
			<Select.Root type="single" bind:value={algorithm}>
				<Select.Trigger class="w-[130px]" size="sm">
					{algorithms.find((o) => o.value === algorithm)?.label}
				</Select.Trigger>
				<Select.Content>
					{#each algorithms as option (option.value)}
						<Select.Item value={option.value} label={option.label} />
					{/each}
				</Select.Content>
			</Select.Root>
		</ToolOptionRow>
	</div>

	<!-- File drop zone -->
	<div
		class="flex h-32 items-center justify-center rounded-lg border-2 border-dashed bg-muted/30 transition-colors hover:bg-muted/50"
		ondrop={handleDrop}
		ondragover={handleDragOver}
		role="button"
		tabindex="0"
		onclick={handleFileSelect}
		onkeydown={(e) => e.key === 'Enter' && handleFileSelect()}
	>
		<div class="flex flex-col items-center gap-2 text-muted-foreground">
			<UploadIcon class="size-8 opacity-50" />
			{#if processing}
				<p class="text-sm">Computing hash...</p>
			{:else if fileName}
				<p class="text-sm">{fileName}</p>
			{:else}
				<p class="text-sm">Drop a file here or click to browse</p>
			{/if}
		</div>
	</div>

	{#if displayHash}
		<div class="space-y-1.5">
			<Label class="text-sm font-medium">Output</Label>
			<Input class="font-mono text-sm" value={displayHash} readonly />
		</div>

		<div class="space-y-1.5">
			<Label class="text-sm font-medium">Compare</Label>
			<Input class="font-mono text-sm" bind:value={compareValue} placeholder="Paste hash to compare..." />
		</div>

		{#if compareResult !== null}
			<div
				class="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm {compareResult
					? 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400'
					: 'border-destructive/50 bg-destructive/10 text-destructive'}"
			>
				{#if compareResult}
					<CheckIcon class="size-4" />
					Hashes match
				{:else}
					<XIcon class="size-4" />
					Hashes do not match
				{/if}
			</div>
		{/if}
	{/if}
</ToolPage>
