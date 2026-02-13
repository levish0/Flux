<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolOptionRow from '$lib/components/app/tool-option-row.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	let type = $state<'words' | 'sentences' | 'paragraphs'>('paragraphs');
	let length = $state(3);
	let startWithLorem = $state(true);

	const typeOptions = [
		{ value: 'words' as const, label: 'Words' },
		{ value: 'sentences' as const, label: 'Sentences' },
		{ value: 'paragraphs' as const, label: 'Paragraphs' }
	];

	const WORDS = [
		'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
		'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
		'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
		'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
		'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
		'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
		'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
		'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'porta', 'nibh', 'venenatis',
		'cras', 'pulvinar', 'mattis', 'nunc', 'blandit', 'volutpat', 'maecenas',
		'accumsan', 'lacus', 'vel', 'facilisis', 'viverra', 'arcu', 'dictum', 'varius',
		'duis', 'at', 'tellus', 'integer', 'feugiat', 'scelerisque', 'sapien', 'nec',
		'sagittis', 'orci', 'a', 'condimentum', 'vitae', 'tempus', 'quam', 'pellentesque',
		'eu', 'tincidunt', 'tortor', 'aliquam', 'faucibus', 'purus', 'semper', 'eget',
		'fringilla', 'urna', 'porttitor', 'rhoncus', 'elementum', 'cursus', 'turpis',
		'massa', 'tincidunt', 'dui', 'pretium', 'vulputate', 'gravida', 'neque',
		'imperdiet', 'diam', 'sollicitudin', 'tristique', 'risus', 'fermentum',
		'posuere', 'leo', 'morbi', 'auctor', 'justo', 'suspendisse', 'potenti',
		'nullam', 'ac', 'habitant', 'platea', 'dictumst', 'vestibulum'
	];

	const LOREM_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

	function randomWord(): string {
		return WORDS[Math.floor(Math.random() * WORDS.length)];
	}

	function generateSentence(minWords: number = 6, maxWords: number = 14): string {
		const count = minWords + Math.floor(Math.random() * (maxWords - minWords + 1));
		const words: string[] = [];
		for (let i = 0; i < count; i++) {
			words.push(randomWord());
		}
		return words[0].charAt(0).toUpperCase() + words[0].slice(1) + ' ' + words.slice(1).join(' ') + '.';
	}

	function generateParagraph(minSentences: number = 3, maxSentences: number = 7): string {
		const count = minSentences + Math.floor(Math.random() * (maxSentences - minSentences + 1));
		const sentences: string[] = [];
		for (let i = 0; i < count; i++) {
			sentences.push(generateSentence());
		}
		return sentences.join(' ');
	}

	let output = $derived.by(() => {
		if (length <= 0) return '';

		if (type === 'words') {
			const words: string[] = [];
			if (startWithLorem) {
				const loremWords = LOREM_START.toLowerCase().split(/[\s,]+/).filter(Boolean);
				for (let i = 0; i < Math.min(length, loremWords.length); i++) {
					words.push(loremWords[i]);
				}
			}
			while (words.length < length) {
				words.push(randomWord());
			}
			// Capitalize first word
			return words[0].charAt(0).toUpperCase() + words[0].slice(1) + ' ' + words.slice(1).join(' ');
		}

		if (type === 'sentences') {
			const sentences: string[] = [];
			if (startWithLorem) {
				sentences.push(LOREM_START + '.');
			}
			while (sentences.length < length) {
				sentences.push(generateSentence());
			}
			return sentences.join(' ');
		}

		// paragraphs
		const paragraphs: string[] = [];
		if (startWithLorem) {
			paragraphs.push(LOREM_START + '. ' + generateParagraph(2, 5));
		}
		while (paragraphs.length < length) {
			paragraphs.push(generateParagraph());
		}
		return paragraphs.join('\n\n');
	});
</script>

<ToolPage title="Lorem Ipsum" fillHeight>
	<div class="shrink-0 space-y-2">
		<ToolOptionRow label="Type">
			<Select.Root type="single" bind:value={type}>
				<Select.Trigger class="w-[140px]" size="sm">
					{typeOptions.find((o) => o.value === type)?.label}
				</Select.Trigger>
				<Select.Content>
					{#each typeOptions as option (option.value)}
						<Select.Item value={option.value} label={option.label} />
					{/each}
				</Select.Content>
			</Select.Root>
		</ToolOptionRow>

		<ToolOptionRow label="Length">
			<Input
				type="number"
				class="w-[100px] font-mono"
				bind:value={length}
				min={1}
				max={999}
			/>
		</ToolOptionRow>

		<ToolOptionRow label="Start with &quot;Lorem ipsum...&quot;">
			<Switch bind:checked={startWithLorem} />
		</ToolOptionRow>
	</div>

	<ToolTextarea label="Output" value={output} readonly grow />
</ToolPage>
