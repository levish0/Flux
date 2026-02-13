<script lang="ts">
	import ToolTextarea from './tool-textarea.svelte';
	import type { Snippet } from 'svelte';

	let {
		inputLabel = 'Input',
		outputLabel = 'Output',
		inputValue = $bindable(''),
		outputValue = $bindable(''),
		inputPlaceholder = '',
		outputPlaceholder = '',
		direction = 'vertical',
		inputActions,
		outputActions
	}: {
		inputLabel?: string;
		outputLabel?: string;
		inputValue?: string;
		outputValue?: string;
		inputPlaceholder?: string;
		outputPlaceholder?: string;
		direction?: 'horizontal' | 'vertical';
		inputActions?: Snippet;
		outputActions?: Snippet;
	} = $props();
</script>

<div
	class={direction === 'horizontal'
		? 'grid grid-cols-1 gap-4 md:grid-cols-2'
		: 'flex flex-col gap-4'}
>
	<ToolTextarea
		label={inputLabel}
		bind:value={inputValue}
		placeholder={inputPlaceholder}
		actions={inputActions}
	/>
	<ToolTextarea
		label={outputLabel}
		value={outputValue}
		placeholder={outputPlaceholder}
		readonly
		actions={outputActions}
	/>
</div>
