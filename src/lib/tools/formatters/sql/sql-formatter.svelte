<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import ToolOptionRow from '$lib/components/app/tool-option-row.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { format } from 'sql-formatter';

	let language = $state('sql');
	let indentation = $state('2-spaces');
	let keywordCase = $state('upper');
	let input = $state('');

	const languageOptions = [
		{ value: 'sql', label: 'Standard SQL' },
		{ value: 'mysql', label: 'MySQL' },
		{ value: 'postgresql', label: 'PostgreSQL' },
		{ value: 'sqlite', label: 'SQLite' },
		{ value: 'transactsql', label: 'T-SQL' },
		{ value: 'plsql', label: 'PL/SQL' }
	];

	const indentOptions = [
		{ value: '2-spaces', label: '2 Spaces' },
		{ value: '4-spaces', label: '4 Spaces' },
		{ value: 'tab', label: 'Tab' }
	];

	const caseOptions = [
		{ value: 'upper', label: 'UPPERCASE' },
		{ value: 'lower', label: 'lowercase' },
		{ value: 'preserve', label: 'Preserve' }
	];

	function getTabWidth(): number {
		if (indentation === '4-spaces') return 4;
		return 2;
	}

	let output = $derived.by(() => {
		if (!input.trim()) return '';
		try {
			return format(input, {
				language: language as any,
				tabWidth: getTabWidth(),
				useTabs: indentation === 'tab',
				keywordCase: keywordCase as any
			});
		} catch (e) {
			return `⚠ ${e instanceof Error ? e.message : 'Failed to format SQL'}`;
		}
	});
</script>

<ToolPage title="SQL Formatter" fillHeight>
	<div class="shrink-0 space-y-2">
		<ToolOptionRow label="Language">
			<Select.Root type="single" bind:value={language}>
				<Select.Trigger class="w-[150px]" size="sm">
					{languageOptions.find((o) => o.value === language)?.label}
				</Select.Trigger>
				<Select.Content>
					{#each languageOptions as option (option.value)}
						<Select.Item value={option.value} label={option.label} />
					{/each}
				</Select.Content>
			</Select.Root>
		</ToolOptionRow>

		<ToolOptionRow label="Indentation">
			<Select.Root type="single" bind:value={indentation}>
				<Select.Trigger class="w-[130px]" size="sm">
					{indentOptions.find((o) => o.value === indentation)?.label}
				</Select.Trigger>
				<Select.Content>
					{#each indentOptions as option (option.value)}
						<Select.Item value={option.value} label={option.label} />
					{/each}
				</Select.Content>
			</Select.Root>
		</ToolOptionRow>

		<ToolOptionRow label="Keywords">
			<Select.Root type="single" bind:value={keywordCase}>
				<Select.Trigger class="w-[130px]" size="sm">
					{caseOptions.find((o) => o.value === keywordCase)?.label}
				</Select.Trigger>
				<Select.Content>
					{#each caseOptions as option (option.value)}
						<Select.Item value={option.value} label={option.label} />
					{/each}
				</Select.Content>
			</Select.Root>
		</ToolOptionRow>
	</div>

	<ToolTextarea label="Input" bind:value={input} placeholder="SELECT * FROM users WHERE id = 1" grow />
	<ToolTextarea label="Output" value={output} readonly grow />
</ToolPage>
