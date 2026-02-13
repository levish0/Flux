<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { cn } from '$lib/utils';
	import cronstrue from 'cronstrue';

	let expression = $state('*/5 * * * *');

	const fieldNames = ['Minute', 'Hour', 'Day of Month', 'Month', 'Day of Week'] as const;
	const fieldRanges = [
		{ min: 0, max: 59 },
		{ min: 0, max: 23 },
		{ min: 1, max: 31 },
		{ min: 1, max: 12 },
		{ min: 0, max: 6 }
	];

	function matchField(value: number, pattern: string, range: { min: number; max: number }): boolean {
		if (pattern === '*') return true;
		for (const part of pattern.split(',')) {
			if (part.includes('/')) {
				const [rangeStr, stepStr] = part.split('/');
				const step = parseInt(stepStr);
				if (isNaN(step) || step <= 0) continue;
				const start = rangeStr === '*' ? range.min : parseInt(rangeStr);
				if ((value - start) % step === 0 && value >= start) return true;
			} else if (part.includes('-')) {
				const [start, end] = part.split('-').map(Number);
				if (value >= start && value <= end) return true;
			} else {
				if (parseInt(part) === value) return true;
			}
		}
		return false;
	}

	function matchesCron(date: Date, parts: string[]): boolean {
		const values = [date.getMinutes(), date.getHours(), date.getDate(), date.getMonth() + 1, date.getDay()];
		for (let i = 0; i < 5; i++) {
			if (!matchField(values[i], parts[i], fieldRanges[i])) return false;
		}
		return true;
	}

	function getNextRuns(expr: string, count: number = 5): Date[] {
		const parts = expr.trim().split(/\s+/);
		if (parts.length !== 5) return [];
		const runs: Date[] = [];
		const check = new Date();
		check.setSeconds(0, 0);
		check.setMinutes(check.getMinutes() + 1);
		const maxIter = 60 * 24 * 365;
		for (let i = 0; i < maxIter && runs.length < count; i++) {
			if (matchesCron(check, parts)) runs.push(new Date(check));
			check.setMinutes(check.getMinutes() + 1);
		}
		return runs;
	}

	let parsed = $derived.by(() => {
		const parts = expression.trim().split(/\s+/);
		if (parts.length !== 5) {
			return { valid: false, error: 'Expected 5 fields: minute hour day-of-month month day-of-week', description: '', nextRuns: [] };
		}

		let description = '';
		try {
			description = cronstrue.toString(expression);
		} catch (e) {
			return { valid: false, error: e instanceof Error ? e.message : 'Invalid cron expression', description: '', nextRuns: [] };
		}

		const nextRuns = getNextRuns(expression, 5);
		return { valid: true, error: null, description, nextRuns };
	});
</script>

<ToolPage title="Cron Parser">
	<div class="space-y-1.5">
		<Label class="text-sm font-medium">Cron Expression</Label>
		<Input class="font-mono text-lg" bind:value={expression} placeholder="*/5 * * * *" />
		<p class="text-xs text-muted-foreground">Format: minute hour day-of-month month day-of-week</p>
	</div>

	{#if !parsed.valid}
		<div class="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
			{parsed.error}
		</div>
	{:else}
		<!-- Human-readable description -->
		<div class="rounded-lg border bg-muted/30 px-4 py-3">
			<p class="text-lg font-medium">{parsed.description}</p>
		</div>

		<!-- Next runs -->
		{#if parsed.nextRuns.length > 0}
			<div class="space-y-2">
				<Label class="text-sm font-medium">Next {parsed.nextRuns.length} Runs</Label>
				<div class="rounded-lg border">
					{#each parsed.nextRuns as run, i (i)}
						<div class={cn('px-4 py-2 font-mono text-sm border-b last:border-0', i % 2 === 0 ? 'bg-transparent' : 'bg-muted/20')}>
							{run.toLocaleString()}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</ToolPage>
