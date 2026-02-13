<script lang="ts">
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { UseClipboard } from '$lib/hooks/use-clipboard.svelte';
	import { toast } from 'svelte-sonner';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import CheckIcon from '@lucide/svelte/icons/check';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import ClipboardPasteIcon from '@lucide/svelte/icons/clipboard-paste';
	import type { Snippet } from 'svelte';

	let {
		label,
		value = $bindable(''),
		placeholder = '',
		readonly = false,
		rows = 8,
		grow = false,
		actions
	}: {
		label: string;
		value?: string;
		placeholder?: string;
		readonly?: boolean;
		rows?: number;
		grow?: boolean;
		actions?: Snippet;
	} = $props();

	const clipboard = new UseClipboard();

	async function handlePaste() {
		try {
			const text = await navigator.clipboard.readText();
			value = text;
		} catch {
			// fallback: user denied clipboard
		}
	}
</script>

<div class={cn('space-y-2', grow && 'flex min-h-0 flex-1 flex-col')}>
	<div class="flex shrink-0 items-center justify-between">
		<span class="text-sm font-medium">{label}</span>
		<div class="flex items-center gap-1">
			{#if actions}
				{@render actions()}
			{/if}
			{#if !readonly}
				<Button variant="ghost" size="icon" class="size-7" onclick={handlePaste} title="Paste">
					<ClipboardPasteIcon class="size-3.5" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					class="size-7"
					onclick={() => (value = '')}
					title="Clear"
				>
					<Trash2Icon class="size-3.5" />
				</Button>
			{/if}
			<Button
				variant="ghost"
				size="icon"
				class="size-7"
				onclick={async () => {
					const result = await clipboard.copy(value);
					if (result === 'success') toast.success('Copied to clipboard');
				}}
				title="Copy"
			>
				{#if clipboard.copied}
					<CheckIcon class="size-3.5" />
				{:else}
					<CopyIcon class="size-3.5" />
				{/if}
			</Button>
		</div>
	</div>
	<Textarea
		class={cn('font-mono text-sm', grow && '!field-sizing-fixed min-h-0 flex-1 resize-none overflow-y-auto')}
		bind:value
		{placeholder}
		{readonly}
		{rows}
	/>
</div>
