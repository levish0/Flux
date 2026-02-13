<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import { cn } from '$lib/utils';
	import { diffLines, type Change } from 'diff';

	let leftText = $state('');
	let rightText = $state('');

	interface DiffLine {
		type: 'equal' | 'added' | 'removed';
		content: string;
		leftNum?: number;
		rightNum?: number;
	}

	let diff = $derived.by((): DiffLine[] => {
		if (!leftText && !rightText) return [];

		const changes: Change[] = diffLines(leftText, rightText);
		const result: DiffLine[] = [];
		let leftNum = 1;
		let rightNum = 1;

		for (const change of changes) {
			const lines = change.value.replace(/\n$/, '').split('\n');
			for (const line of lines) {
				if (change.added) {
					result.push({ type: 'added', content: line, rightNum: rightNum++ });
				} else if (change.removed) {
					result.push({ type: 'removed', content: line, leftNum: leftNum++ });
				} else {
					result.push({ type: 'equal', content: line, leftNum: leftNum++, rightNum: rightNum++ });
				}
			}
		}

		return result;
	});

	let stats = $derived({
		added: diff.filter((d) => d.type === 'added').length,
		removed: diff.filter((d) => d.type === 'removed').length,
		unchanged: diff.filter((d) => d.type === 'equal').length
	});
</script>

<ToolPage title="Text Diff" fillHeight>
	<div class="flex shrink-0 gap-4">
		<ToolTextarea label="Left" bind:value={leftText} placeholder="Original text..." rows={6} />
		<ToolTextarea label="Right" bind:value={rightText} placeholder="Modified text..." rows={6} />
	</div>

	<div class="flex min-h-0 flex-1 flex-col gap-2">
		<div class="flex shrink-0 items-center gap-3">
			<span class="text-sm font-medium">Diff</span>
			{#if diff.length > 0}
				<span class="text-xs text-green-600 dark:text-green-400">+{stats.added}</span>
				<span class="text-xs text-red-600 dark:text-red-400">-{stats.removed}</span>
				<span class="text-xs text-muted-foreground">{stats.unchanged} unchanged</span>
			{/if}
		</div>
		<div class="min-h-0 flex-1 overflow-auto rounded-lg border font-mono text-sm">
			{#if diff.length > 0}
				{#each diff as line, i (i)}
					<div
						class={cn(
							'flex border-b last:border-0',
							line.type === 'added' && 'bg-green-500/10',
							line.type === 'removed' && 'bg-red-500/10'
						)}
					>
						<span class="w-10 shrink-0 select-none border-r px-1 py-0.5 text-right text-xs text-muted-foreground">
							{line.leftNum ?? ''}
						</span>
						<span class="w-10 shrink-0 select-none border-r px-1 py-0.5 text-right text-xs text-muted-foreground">
							{line.rightNum ?? ''}
						</span>
						<span class={cn(
							'w-6 shrink-0 select-none px-1 py-0.5 text-center',
							line.type === 'added' && 'text-green-600 dark:text-green-400',
							line.type === 'removed' && 'text-red-600 dark:text-red-400'
						)}>
							{line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
						</span>
						<span class="flex-1 whitespace-pre px-2 py-0.5">{line.content}</span>
					</div>
				{/each}
			{:else if leftText || rightText}
				<div class="flex items-center justify-center p-8 text-muted-foreground">
					No differences found.
				</div>
			{/if}
		</div>
	</div>
</ToolPage>
