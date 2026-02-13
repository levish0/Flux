<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolOptionRow from '$lib/components/app/tool-option-row.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';

	let timestamp = $state(Math.floor(Date.now() / 1000).toString());
	let format = $state<'seconds' | 'milliseconds'>('seconds');
	let error = $state('');

	// Derived date from timestamp
	let date = $derived.by(() => {
		error = '';
		const raw = timestamp.trim();
		if (!raw) return null;
		const num = Number(raw);
		if (isNaN(num)) {
			error = 'Invalid timestamp';
			return null;
		}
		const ms = format === 'seconds' ? num * 1000 : num;
		const d = new Date(ms);
		if (isNaN(d.getTime())) {
			error = 'Invalid date';
			return null;
		}
		return d;
	});

	let utcDate = $derived(date ? formatDateParts(date, 'UTC') : null);
	let localDate = $derived(date ? formatDateParts(date, 'local') : null);
	let iso8601 = $derived(date ? date.toISOString() : '');
	let relativeTime = $derived(date ? getRelativeTime(date) : '');

	function formatDateParts(d: Date, tz: 'UTC' | 'local') {
		if (tz === 'UTC') {
			return {
				year: d.getUTCFullYear().toString(),
				month: (d.getUTCMonth() + 1).toString().padStart(2, '0'),
				day: d.getUTCDate().toString().padStart(2, '0'),
				hours: d.getUTCHours().toString().padStart(2, '0'),
				minutes: d.getUTCMinutes().toString().padStart(2, '0'),
				seconds: d.getUTCSeconds().toString().padStart(2, '0'),
				dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getUTCDay()]
			};
		}
		return {
			year: d.getFullYear().toString(),
			month: (d.getMonth() + 1).toString().padStart(2, '0'),
			day: d.getDate().toString().padStart(2, '0'),
			hours: d.getHours().toString().padStart(2, '0'),
			minutes: d.getMinutes().toString().padStart(2, '0'),
			seconds: d.getSeconds().toString().padStart(2, '0'),
			dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()]
		};
	}

	function getRelativeTime(d: Date): string {
		const now = Date.now();
		const diff = now - d.getTime();
		const abs = Math.abs(diff);
		const suffix = diff > 0 ? 'ago' : 'from now';

		if (abs < 1000) return 'just now';
		if (abs < 60000) return `${Math.floor(abs / 1000)} seconds ${suffix}`;
		if (abs < 3600000) return `${Math.floor(abs / 60000)} minutes ${suffix}`;
		if (abs < 86400000) return `${Math.floor(abs / 3600000)} hours ${suffix}`;
		if (abs < 2592000000) return `${Math.floor(abs / 86400000)} days ${suffix}`;
		if (abs < 31536000000) return `${Math.floor(abs / 2592000000)} months ${suffix}`;
		return `${Math.floor(abs / 31536000000)} years ${suffix}`;
	}

	function setNow() {
		const now = Date.now();
		timestamp = format === 'seconds' ? Math.floor(now / 1000).toString() : now.toString();
	}

	function updateFromLocal(field: string, value: string) {
		if (!localDate) return;
		const parts = { ...localDate };
		(parts as Record<string, string>)[field] = value;

		const d = new Date(
			parseInt(parts.year),
			parseInt(parts.month) - 1,
			parseInt(parts.day),
			parseInt(parts.hours),
			parseInt(parts.minutes),
			parseInt(parts.seconds)
		);
		if (isNaN(d.getTime())) return;
		timestamp = format === 'seconds'
			? Math.floor(d.getTime() / 1000).toString()
			: d.getTime().toString();
	}

	function updateFromUTC(field: string, value: string) {
		if (!utcDate) return;
		const parts = { ...utcDate };
		(parts as Record<string, string>)[field] = value;

		const d = new Date(
			Date.UTC(
				parseInt(parts.year),
				parseInt(parts.month) - 1,
				parseInt(parts.day),
				parseInt(parts.hours),
				parseInt(parts.minutes),
				parseInt(parts.seconds)
			)
		);
		if (isNaN(d.getTime())) return;
		timestamp = format === 'seconds'
			? Math.floor(d.getTime() / 1000).toString()
			: d.getTime().toString();
	}

	const formatOptions = [
		{ value: 'seconds' as const, label: 'Seconds' },
		{ value: 'milliseconds' as const, label: 'Milliseconds' }
	];
</script>

<ToolPage title="Timestamp Converter">
	<ToolOptionRow label="Format" description="Unix timestamp unit">
		<Select.Root type="single" bind:value={format}>
			<Select.Trigger class="w-[140px]" size="sm">
				{formatOptions.find((o) => o.value === format)?.label}
			</Select.Trigger>
			<Select.Content>
				{#each formatOptions as option (option.value)}
					<Select.Item value={option.value} label={option.label} />
				{/each}
			</Select.Content>
		</Select.Root>
	</ToolOptionRow>

	<div class="space-y-1.5">
		<div class="flex items-center gap-2">
			<Label class="text-sm font-medium">Timestamp</Label>
			<Button variant="ghost" size="icon" class="size-7" onclick={setNow} title="Set to now">
				<RefreshCwIcon class="size-3.5" />
			</Button>
		</div>
		<Input class="font-mono" bind:value={timestamp} placeholder="1700000000" />
	</div>

	{#if error}
		<div class="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
			{error}
		</div>
	{/if}

	{#if date}
		<div class="space-y-1.5">
			<Label class="text-sm font-medium">ISO 8601</Label>
			<Input class="font-mono" value={iso8601} readonly />
		</div>

		<div class="space-y-1.5">
			<Label class="text-sm font-medium">Relative</Label>
			<Input value={relativeTime} readonly />
		</div>

		<!-- UTC -->
		<div class="space-y-3">
			<h3 class="text-sm font-semibold">UTC</h3>
			<div class="grid grid-cols-3 gap-3 lg:grid-cols-6">
				<div class="space-y-1">
					<Label class="text-xs text-muted-foreground">Year</Label>
					<Input class="font-mono" value={utcDate?.year ?? ''} oninput={(e) => updateFromUTC('year', (e.target as HTMLInputElement).value)} />
				</div>
				<div class="space-y-1">
					<Label class="text-xs text-muted-foreground">Month</Label>
					<Input class="font-mono" value={utcDate?.month ?? ''} oninput={(e) => updateFromUTC('month', (e.target as HTMLInputElement).value)} />
				</div>
				<div class="space-y-1">
					<Label class="text-xs text-muted-foreground">Day</Label>
					<Input class="font-mono" value={utcDate?.day ?? ''} oninput={(e) => updateFromUTC('day', (e.target as HTMLInputElement).value)} />
				</div>
				<div class="space-y-1">
					<Label class="text-xs text-muted-foreground">Hour</Label>
					<Input class="font-mono" value={utcDate?.hours ?? ''} oninput={(e) => updateFromUTC('hours', (e.target as HTMLInputElement).value)} />
				</div>
				<div class="space-y-1">
					<Label class="text-xs text-muted-foreground">Minute</Label>
					<Input class="font-mono" value={utcDate?.minutes ?? ''} oninput={(e) => updateFromUTC('minutes', (e.target as HTMLInputElement).value)} />
				</div>
				<div class="space-y-1">
					<Label class="text-xs text-muted-foreground">Second</Label>
					<Input class="font-mono" value={utcDate?.seconds ?? ''} oninput={(e) => updateFromUTC('seconds', (e.target as HTMLInputElement).value)} />
				</div>
			</div>
			<div class="text-sm text-muted-foreground">
				{utcDate?.dayOfWeek}
			</div>
		</div>

		<!-- Local -->
		<div class="space-y-3">
			<h3 class="text-sm font-semibold">Local ({Intl.DateTimeFormat().resolvedOptions().timeZone})</h3>
			<div class="grid grid-cols-3 gap-3 lg:grid-cols-6">
				<div class="space-y-1">
					<Label class="text-xs text-muted-foreground">Year</Label>
					<Input class="font-mono" value={localDate?.year ?? ''} oninput={(e) => updateFromLocal('year', (e.target as HTMLInputElement).value)} />
				</div>
				<div class="space-y-1">
					<Label class="text-xs text-muted-foreground">Month</Label>
					<Input class="font-mono" value={localDate?.month ?? ''} oninput={(e) => updateFromLocal('month', (e.target as HTMLInputElement).value)} />
				</div>
				<div class="space-y-1">
					<Label class="text-xs text-muted-foreground">Day</Label>
					<Input class="font-mono" value={localDate?.day ?? ''} oninput={(e) => updateFromLocal('day', (e.target as HTMLInputElement).value)} />
				</div>
				<div class="space-y-1">
					<Label class="text-xs text-muted-foreground">Hour</Label>
					<Input class="font-mono" value={localDate?.hours ?? ''} oninput={(e) => updateFromLocal('hours', (e.target as HTMLInputElement).value)} />
				</div>
				<div class="space-y-1">
					<Label class="text-xs text-muted-foreground">Minute</Label>
					<Input class="font-mono" value={localDate?.minutes ?? ''} oninput={(e) => updateFromLocal('minutes', (e.target as HTMLInputElement).value)} />
				</div>
				<div class="space-y-1">
					<Label class="text-xs text-muted-foreground">Second</Label>
					<Input class="font-mono" value={localDate?.seconds ?? ''} oninput={(e) => updateFromLocal('seconds', (e.target as HTMLInputElement).value)} />
				</div>
			</div>
			<div class="text-sm text-muted-foreground">
				{localDate?.dayOfWeek}
			</div>
		</div>
	{/if}
</ToolPage>
