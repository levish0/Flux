<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolOptionRow from '$lib/components/app/tool-option-row.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';

	let length = $state(32);
	let useLowercase = $state(true);
	let useUppercase = $state(true);
	let useDigits = $state(true);
	let useSpecial = $state(true);
	let count = $state(1);
	let output = $state('');

	const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
	const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const DIGITS = '0123456789';
	const SPECIAL = '!@#$%^&*()-_=+[]{}|;:,.<>?';

	function generatePassword(): string {
		let charset = '';
		if (useLowercase) charset += LOWERCASE;
		if (useUppercase) charset += UPPERCASE;
		if (useDigits) charset += DIGITS;
		if (useSpecial) charset += SPECIAL;

		if (!charset) return '';

		const array = new Uint32Array(length);
		crypto.getRandomValues(array);
		return Array.from(array, (v) => charset[v % charset.length]).join('');
	}

	function generate() {
		const passwords: string[] = [];
		for (let i = 0; i < count; i++) {
			passwords.push(generatePassword());
		}
		output = passwords.join('\n');
	}

	// Generate on mount
	generate();
</script>

<ToolPage title="Password Generator" fillHeight>
	<div class="shrink-0 space-y-2">
		<ToolOptionRow label="Length">
			<Input
				type="number"
				class="w-[100px] font-mono"
				bind:value={length}
				min={1}
				max={256}
			/>
		</ToolOptionRow>

		<ToolOptionRow label="Lowercase (a-z)">
			<Switch bind:checked={useLowercase} />
		</ToolOptionRow>

		<ToolOptionRow label="Uppercase (A-Z)">
			<Switch bind:checked={useUppercase} />
		</ToolOptionRow>

		<ToolOptionRow label="Digits (0-9)">
			<Switch bind:checked={useDigits} />
		</ToolOptionRow>

		<ToolOptionRow label="Special (!@#$...)">
			<Switch bind:checked={useSpecial} />
		</ToolOptionRow>

		<ToolOptionRow label="Count">
			<Input
				type="number"
				class="w-[100px] font-mono"
				bind:value={count}
				min={1}
				max={100}
			/>
		</ToolOptionRow>
	</div>

	<div class="shrink-0">
		<Button onclick={generate} class="gap-2">
			<RefreshCwIcon class="size-4" />
			Generate
		</Button>
	</div>

	<ToolTextarea label="Generated Passwords" value={output} readonly grow />
</ToolPage>
