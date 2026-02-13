<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import ToolOptionRow from '$lib/components/app/tool-option-row.svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	let escape = $state(true);
	let language = $state('json');
	let input = $state('');

	const languageOptions = [
		{ value: 'json', label: 'JSON' },
		{ value: 'html', label: 'HTML' },
		{ value: 'xml', label: 'XML' },
		{ value: 'javascript', label: 'JavaScript' },
		{ value: 'url', label: 'URL' },
		{ value: 'csv', label: 'CSV' }
	];

	function escapeJSON(str: string): string {
		return JSON.stringify(str).slice(1, -1);
	}

	function unescapeJSON(str: string): string {
		try {
			return JSON.parse(`"${str}"`);
		} catch {
			return '⚠ Invalid escaped JSON string';
		}
	}

	function escapeHTML(str: string): string {
		return str
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	function unescapeHTML(str: string): string {
		const el = document.createElement('textarea');
		el.innerHTML = str;
		return el.value;
	}

	function escapeXML(str: string): string {
		return str
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;');
	}

	function unescapeXML(str: string): string {
		return str
			.replace(/&apos;/g, "'")
			.replace(/&quot;/g, '"')
			.replace(/&gt;/g, '>')
			.replace(/&lt;/g, '<')
			.replace(/&amp;/g, '&');
	}

	function escapeJS(str: string): string {
		return str
			.replace(/\\/g, '\\\\')
			.replace(/'/g, "\\'")
			.replace(/"/g, '\\"')
			.replace(/\n/g, '\\n')
			.replace(/\r/g, '\\r')
			.replace(/\t/g, '\\t')
			.replace(/\0/g, '\\0');
	}

	function unescapeJS(str: string): string {
		try {
			// Use Function constructor for safe evaluation
			return new Function(`return "${str.replace(/"/g, '\\"')}"`)() as string;
		} catch {
			return '⚠ Invalid escaped JavaScript string';
		}
	}

	function escapeURL(str: string): string {
		return encodeURIComponent(str);
	}

	function unescapeURL(str: string): string {
		try {
			return decodeURIComponent(str);
		} catch {
			return '⚠ Invalid URL encoded string';
		}
	}

	function escapeCSV(str: string): string {
		if (str.includes(',') || str.includes('"') || str.includes('\n')) {
			return '"' + str.replace(/"/g, '""') + '"';
		}
		return str;
	}

	function unescapeCSV(str: string): string {
		if (str.startsWith('"') && str.endsWith('"')) {
			return str.slice(1, -1).replace(/""/g, '"');
		}
		return str;
	}

	const converters: Record<string, { escape: (s: string) => string; unescape: (s: string) => string }> = {
		json: { escape: escapeJSON, unescape: unescapeJSON },
		html: { escape: escapeHTML, unescape: unescapeHTML },
		xml: { escape: escapeXML, unescape: unescapeXML },
		javascript: { escape: escapeJS, unescape: unescapeJS },
		url: { escape: escapeURL, unescape: unescapeURL },
		csv: { escape: escapeCSV, unescape: unescapeCSV }
	};

	let output = $derived.by(() => {
		if (!input) return '';
		const converter = converters[language];
		if (!converter) return '';
		try {
			return escape ? converter.escape(input) : converter.unescape(input);
		} catch {
			return '⚠ Conversion error';
		}
	});

	function handleToggle(checked: boolean) {
		const currentOutput = output;
		if (currentOutput && !currentOutput.startsWith('⚠')) {
			input = currentOutput;
		}
		escape = checked;
	}
</script>

<ToolPage title="Escape / Unescape" fillHeight>
	<ToolOptionRow
		label="Conversion"
		description={escape ? 'Escaping text' : 'Unescaping text'}
	>
		<div class="flex items-center gap-2">
			<Label class="text-xs text-muted-foreground">Unescape</Label>
			<Switch checked={escape} onCheckedChange={handleToggle} />
			<Label class="text-xs text-muted-foreground">Escape</Label>
		</div>
	</ToolOptionRow>

	<ToolOptionRow label="Language">
		<Select.Root type="single" bind:value={language}>
			<Select.Trigger class="w-[140px]" size="sm">
				{languageOptions.find((o) => o.value === language)?.label}
			</Select.Trigger>
			<Select.Content>
				{#each languageOptions as option (option.value)}
					<Select.Item value={option.value} label={option.label} />
				{/each}
			</Select.Content>
		</Select.Root>
	</ToolOptionRow>

	<ToolTextarea
		label="Input"
		bind:value={input}
		placeholder={escape ? 'Enter text to escape...' : 'Enter escaped text...'}
		grow
	/>
	<ToolTextarea label="Output" value={output} readonly grow />
</ToolPage>
