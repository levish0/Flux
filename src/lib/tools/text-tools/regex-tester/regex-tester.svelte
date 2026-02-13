<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import ToolOptionRow from '$lib/components/app/tool-option-row.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils';

	let pattern = $state('');
	let text = $state('');
	let error = $state('');

	// Flags
	let flagGlobal = $state(true);
	let flagCaseInsensitive = $state(false);
	let flagMultiline = $state(false);
	let flagSingleLine = $state(false);
	let flagUnicode = $state(false);
	let flagSticky = $state(false);

	const flagDefs = [
		{ key: 'g', label: 'Global', get: () => flagGlobal, set: (v: boolean) => (flagGlobal = v) },
		{ key: 'i', label: 'Case Insensitive', get: () => flagCaseInsensitive, set: (v: boolean) => (flagCaseInsensitive = v) },
		{ key: 'm', label: 'Multiline', get: () => flagMultiline, set: (v: boolean) => (flagMultiline = v) },
		{ key: 's', label: 'Single Line', get: () => flagSingleLine, set: (v: boolean) => (flagSingleLine = v) },
		{ key: 'u', label: 'Unicode', get: () => flagUnicode, set: (v: boolean) => (flagUnicode = v) },
		{ key: 'y', label: 'Sticky', get: () => flagSticky, set: (v: boolean) => (flagSticky = v) }
	];

	let flags = $derived(
		(flagGlobal ? 'g' : '') +
		(flagCaseInsensitive ? 'i' : '') +
		(flagMultiline ? 'm' : '') +
		(flagSingleLine ? 's' : '') +
		(flagUnicode ? 'u' : '') +
		(flagSticky ? 'y' : '')
	);

	interface MatchResult {
		index: number;
		value: string;
		groups: Record<string, string> | null;
	}

	let matches = $derived.by((): MatchResult[] => {
		error = '';
		if (!pattern || !text) return [];

		try {
			const regex = new RegExp(pattern, flags);
			const results: MatchResult[] = [];

			if (flags.includes('g')) {
				let match: RegExpExecArray | null;
				let safety = 0;
				while ((match = regex.exec(text)) !== null && safety < 10000) {
					results.push({
						index: match.index,
						value: match[0],
						groups: match.groups ? { ...match.groups } : null
					});
					if (match[0].length === 0) regex.lastIndex++;
					safety++;
				}
			} else {
				const match = regex.exec(text);
				if (match) {
					results.push({
						index: match.index,
						value: match[0],
						groups: match.groups ? { ...match.groups } : null
					});
				}
			}

			return results;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Invalid regular expression';
			return [];
		}
	});
</script>

<ToolPage title="Regex Tester" fillHeight>
	<div class="shrink-0 space-y-3">
		<div class="space-y-1.5">
			<Label class="text-sm font-medium">Regular Expression</Label>
			<Input class="font-mono" bind:value={pattern} placeholder="[A-Za-z]+" />
		</div>

		<div class="flex flex-wrap gap-1">
			{#each flagDefs as flag (flag.key)}
				<Button
					variant={flag.get() ? 'default' : 'outline'}
					size="sm"
					class="h-7 px-2 font-mono text-xs"
					onclick={() => flag.set(!flag.get())}
					title={flag.label}
				>
					{flag.key}
				</Button>
			{/each}
		</div>

		{#if error}
			<div class="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
				{error}
			</div>
		{/if}
	</div>

	<ToolTextarea
		label="Test String"
		bind:value={text}
		placeholder="Enter text to test against..."
		grow
	/>

	<div class="shrink-0 space-y-2">
		<div class="flex items-center gap-2">
			<Label class="text-sm font-medium">Matches</Label>
			<span class="text-xs text-muted-foreground">({matches.length} found)</span>
		</div>
		{#if matches.length > 0}
			<div class="max-h-48 overflow-auto rounded-lg border">
				<table class="w-full text-sm">
					<thead class="sticky top-0 border-b bg-muted/50">
						<tr>
							<th class="px-3 py-1.5 text-left font-medium">#</th>
							<th class="px-3 py-1.5 text-left font-medium">Match</th>
							<th class="px-3 py-1.5 text-left font-medium">Index</th>
							{#if matches.some((m) => m.groups)}
								<th class="px-3 py-1.5 text-left font-medium">Groups</th>
							{/if}
						</tr>
					</thead>
					<tbody>
						{#each matches as match, i (i)}
							<tr class={cn('border-b last:border-0', i % 2 === 0 ? 'bg-transparent' : 'bg-muted/20')}>
								<td class="px-3 py-1.5 font-mono text-muted-foreground">{i + 1}</td>
								<td class="px-3 py-1.5 font-mono">{match.value || '(empty)'}</td>
								<td class="px-3 py-1.5 font-mono text-muted-foreground">{match.index}</td>
								{#if matches.some((m) => m.groups)}
									<td class="px-3 py-1.5 font-mono text-xs">
										{#if match.groups}
											{JSON.stringify(match.groups)}
										{/if}
									</td>
								{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else if pattern && text}
			<div class="rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
				No matches found.
			</div>
		{/if}
	</div>
</ToolPage>
