<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolOptionRow from '$lib/components/app/tool-option-row.svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let formatNumber = $state(true);

	let hexValue = $state('');
	let decValue = $state('');
	let octValue = $state('');
	let binValue = $state('');
	let activeField = $state<string | null>(null);
	let error = $state('');

	const MAX_SAFE = BigInt('9223372036854775807'); // long.MaxValue
	const MIN_SAFE = BigInt('-9223372036854775808');

	function parseInput(value: string, base: number): bigint | null {
		const cleaned = value.replace(/\s+/g, '').trim();
		if (!cleaned) return null;

		try {
			let negative = false;
			let str = cleaned;

			if (base === 10 && str.startsWith('-')) {
				negative = true;
				str = str.slice(1);
			}

			// Validate characters
			const validChars = '0123456789ABCDEF'.slice(0, base);
			const upper = str.toUpperCase();
			for (const ch of upper) {
				if (!validChars.includes(ch)) return null;
			}

			if (!str) return null;
			const result = BigInt(
				base === 10 ? str : (base === 16 ? '0x' : base === 8 ? '0o' : '0b') + upper
			);
			const final = negative ? -result : result;

			if (final > MAX_SAFE || final < MIN_SAFE) return null;
			return final;
		} catch {
			return null;
		}
	}

	function formatBase(num: bigint, base: number, format: boolean): string {
		if (base === 10) {
			const str = num.toString(10);
			if (!format) return str;
			const negative = str.startsWith('-');
			const abs = negative ? str.slice(1) : str;
			const formatted = abs.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
			return negative ? '-' + formatted : formatted;
		}

		// For non-decimal, use unsigned representation for negative numbers
		let unsigned = num;
		if (num < 0n) {
			unsigned = (1n << 64n) + num;
		}

		let str = unsigned.toString(base).toUpperCase();

		if (base === 2 && format) {
			// Pad to multiple of 4
			const padLen = Math.ceil(str.length / 4) * 4;
			str = str.padStart(padLen, '0');
			return str.replace(/(.{4})(?=.)/g, '$1 ');
		}

		if (base === 16 && format) {
			const padLen = Math.ceil(str.length / 4) * 4;
			str = str.padStart(padLen, '0');
			return str.replace(/(.{4})(?=.)/g, '$1 ');
		}

		if (base === 8 && format) {
			return str.replace(/(.{3})(?=.)/g, '$1 ');
		}

		return str;
	}

	function updateFromField(field: string, raw: string) {
		error = '';
		const base = field === 'hex' ? 16 : field === 'dec' ? 10 : field === 'oct' ? 8 : 2;

		if (!raw.replace(/\s+/g, '').trim()) {
			hexValue = '';
			decValue = '';
			octValue = '';
			binValue = '';
			return;
		}

		const num = parseInput(raw, base);
		if (num === null) {
			error = `Invalid ${field === 'hex' ? 'hexadecimal' : field === 'dec' ? 'decimal' : field === 'oct' ? 'octal' : 'binary'} value`;
			return;
		}

		if (field !== 'hex') hexValue = formatBase(num, 16, formatNumber);
		if (field !== 'dec') decValue = formatBase(num, 10, formatNumber);
		if (field !== 'oct') octValue = formatBase(num, 8, formatNumber);
		if (field !== 'bin') binValue = formatBase(num, 2, formatNumber);
	}

	function handleInput(field: string) {
		return (e: Event) => {
			activeField = field;
			const target = e.target as HTMLInputElement;
			const raw = target.value;
			if (field === 'hex') hexValue = raw;
			else if (field === 'dec') decValue = raw;
			else if (field === 'oct') octValue = raw;
			else binValue = raw;
			updateFromField(field, raw);
		};
	}

	function handleBlur(field: string) {
		return () => {
			if (!formatNumber) return;
			const base = field === 'hex' ? 16 : field === 'dec' ? 10 : field === 'oct' ? 8 : 2;
			const raw = field === 'hex' ? hexValue : field === 'dec' ? decValue : field === 'oct' ? octValue : binValue;
			const num = parseInput(raw, base);
			if (num !== null) {
				const formatted = formatBase(num, base, true);
				if (field === 'hex') hexValue = formatted;
				else if (field === 'dec') decValue = formatted;
				else if (field === 'oct') octValue = formatted;
				else binValue = formatted;
			}
			activeField = null;
		};
	}

	// Re-format all when toggle changes
	function handleFormatToggle(checked: boolean) {
		formatNumber = checked;
		// Find any non-empty field to recalculate from
		const sources: [string, string, number][] = [
			['dec', decValue, 10],
			['hex', hexValue, 16],
			['oct', octValue, 8],
			['bin', binValue, 2]
		];
		for (const [, raw, base] of sources) {
			const num = parseInput(raw, base);
			if (num !== null) {
				hexValue = formatBase(num, 16, checked);
				decValue = formatBase(num, 10, checked);
				octValue = formatBase(num, 8, checked);
				binValue = formatBase(num, 2, checked);
				return;
			}
		}
	}

	const fields = [
		{ id: 'hex', label: 'Hexadecimal' },
		{ id: 'dec', label: 'Decimal' },
		{ id: 'oct', label: 'Octal' },
		{ id: 'bin', label: 'Binary' }
	] as const;
</script>

<ToolPage title="Number Base Converter">
	<ToolOptionRow label="Format number" description="Group digits with spaces">
		<Switch checked={formatNumber} onCheckedChange={handleFormatToggle} />
	</ToolOptionRow>

	{#if error}
		<div class="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
			{error}
		</div>
	{/if}

	<div class="space-y-3">
		{#each fields as field (field.id)}
			<div class="space-y-1.5">
				<Label class="text-sm font-medium">{field.label}</Label>
				<Input
					class="font-mono"
					value={field.id === 'hex' ? hexValue : field.id === 'dec' ? decValue : field.id === 'oct' ? octValue : binValue}
					oninput={handleInput(field.id)}
					onblur={handleBlur(field.id)}
					placeholder={field.id === 'hex' ? 'FF' : field.id === 'dec' ? '255' : field.id === 'oct' ? '377' : '1111 1111'}
				/>
			</div>
		{/each}
	</div>
</ToolPage>
