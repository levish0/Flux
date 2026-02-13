<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolOptionRow from '$lib/components/app/tool-option-row.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';

	let hyphens = $state(true);
	let uppercase = $state(false);
	let version = $state('v4');
	let count = $state(1);
	let output = $state('');

	const versionOptions = [
		{ value: 'v1', label: 'Version 1 (Time-based)' },
		{ value: 'v4', label: 'Version 4 (Random)' }
	];

	function generateV1(): string {
		// Time-based UUID v1 (simplified implementation)
		const now = BigInt(Date.now());
		// UUID epoch is Oct 15, 1582 — offset in ms
		const uuidEpoch = BigInt(122192928000000000);
		const ticks = now * BigInt(10000) + uuidEpoch;

		const timeLow = Number(ticks & BigInt(0xffffffff));
		const timeMid = Number((ticks >> BigInt(32)) & BigInt(0xffff));
		const timeHi = Number((ticks >> BigInt(48)) & BigInt(0x0fff)) | 0x1000;

		const clockSeq = (Math.random() * 0x3fff) | 0x8000;

		const node = new Uint8Array(6);
		crypto.getRandomValues(node);

		const hex = (n: number, len: number) => n.toString(16).padStart(len, '0');
		return [
			hex(timeLow, 8),
			hex(timeMid, 4),
			hex(timeHi, 4),
			hex(clockSeq, 4),
			Array.from(node)
				.map((b) => hex(b, 2))
				.join('')
		].join('-');
	}

	function generate() {
		const lines: string[] = [];
		for (let i = 0; i < count; i++) {
			let uuid: string = version === 'v1' ? generateV1() : crypto.randomUUID();
			if (!hyphens) uuid = uuid.replaceAll('-', '');
			if (uppercase) uuid = uuid.toUpperCase();
			lines.push(uuid);
		}
		const newBlock = lines.join('\n');
		output = output ? output + '\n' + newBlock : newBlock;
	}

	// Generate one on mount
	$effect(() => {
		if (!output) generate();
	});
</script>

<ToolPage title="UUID Generator" fillHeight>
	<ToolOptionRow label="Hyphens" description="Include hyphens in the UUID">
		<Switch bind:checked={hyphens} />
	</ToolOptionRow>

	<ToolOptionRow label="Uppercase" description="Generate uppercase UUIDs">
		<Switch bind:checked={uppercase} />
	</ToolOptionRow>

	<ToolOptionRow label="Version" description="UUID version to generate">
		<Select.Root type="single" bind:value={version}>
			<Select.Trigger class="w-[220px]" size="sm">
				{versionOptions.find((o) => o.value === version)?.label ?? 'Version 4 (Random)'}
			</Select.Trigger>
			<Select.Content>
				{#each versionOptions as option (option.value)}
					<Select.Item value={option.value} label={option.label} />
				{/each}
			</Select.Content>
		</Select.Root>
	</ToolOptionRow>

	<div class="flex shrink-0 items-center gap-3">
		<Button onclick={generate}>
			<RefreshCwIcon class="mr-2 size-4" />
			Generate
		</Button>
		<span class="text-sm font-bold">×</span>
		<Input type="number" class="w-24" min={1} max={10000} bind:value={count} />
	</div>

	<ToolTextarea label="UUIDs" bind:value={output} readonly grow />
</ToolPage>
