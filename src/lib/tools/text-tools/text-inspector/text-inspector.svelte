<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import { Label } from '$lib/components/ui/label/index.js';

	let input = $state('');

	let stats = $derived.by(() => {
		const text = input;
		if (!text) return null;

		const characters = text.length;
		const bytes = new TextEncoder().encode(text).length;
		const words = text.trim() ? text.trim().split(/\s+/).length : 0;
		const lines = text.split('\n').length;
		const sentences = text.trim() ? text.split(/[.!?]+\s*/g).filter(Boolean).length : 0;
		const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;

		// Character distribution
		const charMap = new Map<string, number>();
		for (const ch of text) {
			charMap.set(ch, (charMap.get(ch) ?? 0) + 1);
		}
		const charDist = [...charMap.entries()]
			.sort((a, b) => b[1] - a[1])
			.slice(0, 20)
			.map(([ch, count]) => ({
				char: ch === '\n' ? '\\n' : ch === '\t' ? '\\t' : ch === ' ' ? '⎵' : ch,
				count,
				percent: ((count / characters) * 100).toFixed(1)
			}));

		// Word distribution
		const wordMap = new Map<string, number>();
		if (text.trim()) {
			for (const word of text.toLowerCase().split(/\s+/)) {
				const clean = word.replace(/[^\w]/g, '');
				if (clean) wordMap.set(clean, (wordMap.get(clean) ?? 0) + 1);
			}
		}
		const wordDist = [...wordMap.entries()]
			.sort((a, b) => b[1] - a[1])
			.slice(0, 15);

		// Line endings
		const crlf = (text.match(/\r\n/g) ?? []).length;
		const lf = (text.match(/(?<!\r)\n/g) ?? []).length;
		const cr = (text.match(/\r(?!\n)/g) ?? []).length;
		let lineEnding = 'None';
		if (crlf > 0 && lf === 0 && cr === 0) lineEnding = 'CRLF (Windows)';
		else if (lf > 0 && crlf === 0 && cr === 0) lineEnding = 'LF (Unix/Mac)';
		else if (cr > 0 && crlf === 0 && lf === 0) lineEnding = 'CR (Classic Mac)';
		else if (crlf > 0 || lf > 0 || cr > 0) lineEnding = 'Mixed';

		return { characters, bytes, words, lines, sentences, paragraphs, lineEnding, charDist, wordDist };
	});
</script>

<ToolPage title="Text Inspector" fillHeight>
	<ToolTextarea label="Text" bind:value={input} placeholder="Paste text to inspect..." grow />

	{#if stats}
		<div class="shrink-0 space-y-4">
			<!-- Statistics grid -->
			<div class="grid grid-cols-3 gap-3 lg:grid-cols-6">
				<div class="rounded-lg border p-3 text-center">
					<div class="text-2xl font-bold">{stats.characters.toLocaleString()}</div>
					<div class="text-xs text-muted-foreground">Characters</div>
				</div>
				<div class="rounded-lg border p-3 text-center">
					<div class="text-2xl font-bold">{stats.words.toLocaleString()}</div>
					<div class="text-xs text-muted-foreground">Words</div>
				</div>
				<div class="rounded-lg border p-3 text-center">
					<div class="text-2xl font-bold">{stats.lines.toLocaleString()}</div>
					<div class="text-xs text-muted-foreground">Lines</div>
				</div>
				<div class="rounded-lg border p-3 text-center">
					<div class="text-2xl font-bold">{stats.sentences.toLocaleString()}</div>
					<div class="text-xs text-muted-foreground">Sentences</div>
				</div>
				<div class="rounded-lg border p-3 text-center">
					<div class="text-2xl font-bold">{stats.paragraphs.toLocaleString()}</div>
					<div class="text-xs text-muted-foreground">Paragraphs</div>
				</div>
				<div class="rounded-lg border p-3 text-center">
					<div class="text-2xl font-bold">{stats.bytes.toLocaleString()}</div>
					<div class="text-xs text-muted-foreground">Bytes</div>
				</div>
			</div>

			<div class="text-sm text-muted-foreground">
				Line Endings: {stats.lineEnding}
			</div>

			<!-- Character & Word distribution -->
			<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{#if stats.charDist.length > 0}
					<div class="space-y-2">
						<Label class="text-sm font-medium">Character Distribution</Label>
						<div class="max-h-48 overflow-auto rounded-lg border">
							<table class="w-full text-sm">
								<thead class="sticky top-0 border-b bg-muted/50">
									<tr>
										<th class="px-3 py-1 text-left font-medium">Char</th>
										<th class="px-3 py-1 text-right font-medium">Count</th>
										<th class="px-3 py-1 text-right font-medium">%</th>
									</tr>
								</thead>
								<tbody>
									{#each stats.charDist as item (item.char)}
										<tr class="border-b last:border-0">
											<td class="px-3 py-1 font-mono">{item.char}</td>
											<td class="px-3 py-1 text-right font-mono text-muted-foreground">{item.count}</td>
											<td class="px-3 py-1 text-right font-mono text-muted-foreground">{item.percent}%</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				{/if}

				{#if stats.wordDist.length > 0}
					<div class="space-y-2">
						<Label class="text-sm font-medium">Word Frequency</Label>
						<div class="max-h-48 overflow-auto rounded-lg border">
							<table class="w-full text-sm">
								<thead class="sticky top-0 border-b bg-muted/50">
									<tr>
										<th class="px-3 py-1 text-left font-medium">Word</th>
										<th class="px-3 py-1 text-right font-medium">Count</th>
									</tr>
								</thead>
								<tbody>
									{#each stats.wordDist as [word, count] (word)}
										<tr class="border-b last:border-0">
											<td class="px-3 py-1 font-mono">{word}</td>
											<td class="px-3 py-1 text-right font-mono text-muted-foreground">{count}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</ToolPage>
