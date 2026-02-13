<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import CheckIcon from '@lucide/svelte/icons/check';
	import XIcon from '@lucide/svelte/icons/x';

	let input = $state('');

	let result = $derived.by(() => {
		const trimmed = input.trim();
		if (!trimmed) return null;

		const parser = new DOMParser();
		const doc = parser.parseFromString(trimmed, 'application/xml');
		const errors = doc.getElementsByTagName('parsererror');

		if (errors.length > 0) {
			const errorText = errors[0].textContent || 'Unknown XML error';
			return { valid: false, message: errorText };
		}

		// Count elements
		const allElements = doc.getElementsByTagName('*');
		const rootTag = doc.documentElement.tagName;

		return {
			valid: true,
			message: `Valid XML. Root: <${rootTag}>, ${allElements.length} element(s).`
		};
	});
</script>

<ToolPage title="XML Validator" fillHeight>
	<ToolTextarea
		label="XML"
		bind:value={input}
		placeholder="Paste XML to validate..."
		grow
	/>

	{#if result}
		<div
			class="shrink-0 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm {result.valid
				? 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400'
				: 'border-destructive/50 bg-destructive/10 text-destructive'}"
		>
			{#if result.valid}
				<CheckIcon class="size-4 shrink-0" />
			{:else}
				<XIcon class="size-4 shrink-0" />
			{/if}
			<span class="whitespace-pre-wrap">{result.message}</span>
		</div>
	{/if}
</ToolPage>
