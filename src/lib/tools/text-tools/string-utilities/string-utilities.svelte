<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	let text = $state('');
	let originalText = $state('');

	// Track the original text for "Original" button
	$effect(() => {
		// Only update original when user types directly (not from conversion buttons)
		if (!converting) {
			originalText = text;
		}
	});

	let converting = false;

	function applyConversion(fn: (t: string) => string) {
		converting = true;
		text = fn(originalText);
		converting = false;
	}

	// --- Convert functions ---
	function sentenceCase(t: string): string {
		const chars = t.split('');
		let newSentence = true;
		for (let i = 0; i < chars.length; i++) {
			if ('.?!\r\n'.includes(chars[i])) {
				newSentence = true;
				continue;
			}
			if (/[a-zA-Z0-9]/.test(chars[i])) {
				chars[i] = newSentence ? chars[i].toUpperCase() : chars[i].toLowerCase();
				if (newSentence) newSentence = false;
			}
		}
		return chars.join('');
	}

	function titleCase(t: string): string {
		return t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
	}

	function camelCase(t: string): string {
		let result = '';
		let nextUpper = false;
		for (const c of t) {
			if (/[a-zA-Z0-9]/.test(c)) {
				result += nextUpper ? c.toUpperCase() : c.toLowerCase();
				nextUpper = false;
			} else if (c === '\n' || c === '\r') {
				nextUpper = false;
				result += c;
			} else {
				nextUpper = true;
			}
		}
		return result;
	}

	function pascalCase(t: string): string {
		let result = '';
		let nextUpper = true;
		for (const c of t) {
			if (/[a-zA-Z0-9]/.test(c)) {
				result += nextUpper ? c.toUpperCase() : c.toLowerCase();
				nextUpper = false;
			} else if (c === '\n' || c === '\r') {
				nextUpper = true;
				result += c;
			} else {
				nextUpper = true;
			}
		}
		return result;
	}

	function separatorCase(t: string, sep: string, upper: boolean): string {
		let result = '';
		let skipNonAlpha = true;
		for (let i = 0; i < t.length; i++) {
			const c = t[i];
			if (/[a-zA-Z0-9]/.test(c)) {
				skipNonAlpha = false;
				result += upper ? c.toUpperCase() : c.toLowerCase();
			} else if (c === '\n' || c === '\r') {
				skipNonAlpha = true;
				result += c;
			} else if (!skipNonAlpha) {
				if (i < t.length - 1 && /[a-zA-Z0-9]/.test(t[i + 1])) {
					skipNonAlpha = true;
					result += sep;
				}
			}
		}
		return result;
	}

	function trainCase(t: string): string {
		let result = '';
		let nextUpper = true;
		let skipNonAlpha = true;
		for (let i = 0; i < t.length; i++) {
			const c = t[i];
			if (/[a-zA-Z0-9]/.test(c)) {
				result += nextUpper ? c.toUpperCase() : c.toLowerCase();
				nextUpper = false;
				skipNonAlpha = false;
			} else if (c === '\n' || c === '\r') {
				nextUpper = true;
				skipNonAlpha = true;
				result += c;
			} else if (!skipNonAlpha) {
				if (i < t.length - 1 && /[a-zA-Z0-9]/.test(t[i + 1])) {
					nextUpper = true;
					skipNonAlpha = true;
					result += '-';
				}
			}
		}
		return result;
	}

	function alternatingCase(t: string): string {
		let lower = true;
		return t
			.split('')
			.map((c) => {
				const r = lower ? c.toLowerCase() : c.toUpperCase();
				lower = !lower;
				return r;
			})
			.join('');
	}

	function inverseCase(t: string): string {
		let lower = false;
		return t
			.split('')
			.map((c) => {
				const r = lower ? c.toLowerCase() : c.toUpperCase();
				lower = !lower;
				return r;
			})
			.join('');
	}

	// --- Sort functions (operate on originalText lines) ---
	function sortLines(fn: (lines: string[]) => string[]) {
		converting = true;
		const lines = originalText.split('\n');
		text = fn(lines).join('\n');
		converting = false;
	}

	const convertButtons = [
		{ label: 'Original', fn: () => applyConversion((t) => originalText) },
		{ label: 'Sentence Case', fn: () => applyConversion(sentenceCase) },
		{ label: 'lowercase', fn: () => applyConversion((t) => t.toLowerCase()) },
		{ label: 'UPPERCASE', fn: () => applyConversion((t) => t.toUpperCase()) },
		{ label: 'Title Case', fn: () => applyConversion(titleCase) },
		{ label: 'camelCase', fn: () => applyConversion(camelCase) },
		{ label: 'PascalCase', fn: () => applyConversion(pascalCase) },
		{ label: 'snake_case', fn: () => applyConversion((t) => separatorCase(t, '_', false)) },
		{ label: 'CONSTANT_CASE', fn: () => applyConversion((t) => separatorCase(t, '_', true)) },
		{ label: 'kebab-case', fn: () => applyConversion((t) => separatorCase(t, '-', false)) },
		{ label: 'COBOL-CASE', fn: () => applyConversion((t) => separatorCase(t, '-', true)) },
		{ label: 'Train-Case', fn: () => applyConversion(trainCase) },
		{ label: 'aLtErNaTiNg', fn: () => applyConversion(alternatingCase) },
		{ label: 'InVeRsE', fn: () => applyConversion(inverseCase) }
	];

	const sortButtons = [
		{ label: 'Alphabetize', fn: () => sortLines((l) => [...l].sort()) },
		{ label: 'Reverse Alphabetize', fn: () => sortLines((l) => [...l].sort().reverse()) },
		{
			label: 'Alphabetize Last',
			fn: () =>
				sortLines((l) =>
					[...l].sort((a, b) => {
						const lastA = a.split(/\s+/).pop() ?? '';
						const lastB = b.split(/\s+/).pop() ?? '';
						return lastA.localeCompare(lastB);
					})
				)
		},
		{
			label: 'Reverse Alphabetize Last',
			fn: () =>
				sortLines((l) =>
					[...l].sort((a, b) => {
						const lastA = a.split(/\s+/).pop() ?? '';
						const lastB = b.split(/\s+/).pop() ?? '';
						return lastB.localeCompare(lastA);
					})
				)
		},
		{ label: 'Reverse', fn: () => sortLines((l) => [...l].reverse()) },
		{ label: 'Randomize', fn: () => sortLines((l) => [...l].sort(() => Math.random() - 0.5)) }
	];

	// --- Statistics ---
	interface StatItem {
		label: string;
		value: string | number;
	}

	let stats = $derived<StatItem[]>([
		{ label: 'Characters', value: text.length },
		{ label: 'Words', value: text.trim() ? text.trim().split(/\s+/).length : 0 },
		{ label: 'Lines', value: text ? text.split('\n').length : 0 },
		{
			label: 'Sentences',
			value: text ? (text.match(/[^.!?\r\n]*[a-zA-Z0-9][^.!?\r\n]*[.!?]/g) ?? []).length : 0
		},
		{
			label: 'Paragraphs',
			value: text ? text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length : 0
		},
		{ label: 'Bytes', value: new TextEncoder().encode(text).length }
	]);
</script>

<ToolPage title="String Utilities" fillHeight>
	<div class="shrink-0 space-y-2">
		<span class="text-sm font-medium">Convert</span>
		<div class="flex flex-wrap gap-1.5">
			{#each convertButtons as btn (btn.label)}
				<Button variant="outline" size="sm" onclick={btn.fn}>{btn.label}</Button>
			{/each}
		</div>
	</div>

	<div class="shrink-0 space-y-2">
		<span class="text-sm font-medium">Sort</span>
		<div class="flex flex-wrap gap-1.5">
			{#each sortButtons as btn (btn.label)}
				<Button variant="outline" size="sm" onclick={btn.fn}>{btn.label}</Button>
			{/each}
		</div>
	</div>

	<div class="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_240px]">
		<ToolTextarea
			label="String"
			bind:value={text}
			placeholder="Enter text to inspect and convert..."
			grow
		/>

		<div class="space-y-4 overflow-auto">
			<div class="space-y-2">
				<span class="text-sm font-medium">Statistics</span>
				<div class="rounded-lg border border-border p-3">
					<div class="space-y-1.5">
						{#each stats as stat (stat.label)}
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">{stat.label}</span>
								<span class="font-mono">{stat.value}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</ToolPage>
