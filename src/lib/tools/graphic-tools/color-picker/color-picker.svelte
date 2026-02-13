<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { UseClipboard } from '$lib/hooks/use-clipboard.svelte';
	import { toast } from 'svelte-sonner';
	import CopyIcon from '@lucide/svelte/icons/copy';

	let hex = $state('#3b82f6');
	let activeField = $state<string | null>(null);

	// Parse hex to RGB
	function hexToRgb(h: string): { r: number; g: number; b: number } | null {
		const match = h.replace('#', '').match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
		if (!match) return null;
		return { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) };
	}

	function rgbToHex(r: number, g: number, b: number): string {
		return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
	}

	function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
		r /= 255; g /= 255; b /= 255;
		const max = Math.max(r, g, b), min = Math.min(r, g, b);
		const l = (max + min) / 2;
		if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
		const d = max - min;
		const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		let h = 0;
		if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
		else if (max === g) h = ((b - r) / d + 2) / 6;
		else h = ((r - g) / d + 4) / 6;
		return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
	}

	function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
		h /= 360; s /= 100; l /= 100;
		if (s === 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v }; }
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		return {
			r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
			g: Math.round(hue2rgb(p, q, h) * 255),
			b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
		};
	}

	let rgb = $derived(hexToRgb(hex) ?? { r: 0, g: 0, b: 0 });
	let hsl = $derived(rgbToHsl(rgb.r, rgb.g, rgb.b));

	let rgbString = $derived(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
	let hslString = $derived(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);

	function handleHexInput(value: string) {
		let v = value.trim();
		if (!v.startsWith('#')) v = '#' + v;
		if (/^#[0-9a-fA-F]{6}$/.test(v)) {
			hex = v;
		}
	}

	function handleRgbInput(channel: 'r' | 'g' | 'b', value: string) {
		const num = parseInt(value);
		if (isNaN(num)) return;
		const clamped = Math.max(0, Math.min(255, num));
		const newRgb = { ...rgb, [channel]: clamped };
		hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
	}

	function handleHslInput(channel: 'h' | 's' | 'l', value: string) {
		const num = parseInt(value);
		if (isNaN(num)) return;
		const maxVal = channel === 'h' ? 360 : 100;
		const clamped = Math.max(0, Math.min(maxVal, num));
		const newHsl = { ...hsl, [channel]: clamped };
		const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
		hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
	}

	const clipboard = new UseClipboard();

	async function copyValue(value: string) {
		const result = await clipboard.copy(value);
		if (result === 'success') toast.success('Copied');
	}
</script>

<ToolPage title="Color Picker">
	<!-- Color preview -->
	<div class="flex gap-4">
		<div
			class="h-32 w-32 shrink-0 rounded-lg border shadow-inner"
			style:background-color={hex}
		></div>
		<div class="flex flex-1 flex-col justify-center gap-2">
			<input
				type="color"
				bind:value={hex}
				class="h-10 w-full cursor-pointer rounded border bg-transparent"
			/>
		</div>
	</div>

	<!-- HEX -->
	<div class="space-y-1.5">
		<div class="flex items-center justify-between">
			<Label class="text-sm font-medium">HEX</Label>
			<Button variant="ghost" size="icon" class="size-7" onclick={() => copyValue(hex)}>
				<CopyIcon class="size-3.5" />
			</Button>
		</div>
		<Input
			class="font-mono"
			value={hex}
			oninput={(e) => handleHexInput((e.target as HTMLInputElement).value)}
		/>
	</div>

	<!-- RGB -->
	<div class="space-y-1.5">
		<div class="flex items-center justify-between">
			<Label class="text-sm font-medium">RGB</Label>
			<Button variant="ghost" size="icon" class="size-7" onclick={() => copyValue(rgbString)}>
				<CopyIcon class="size-3.5" />
			</Button>
		</div>
		<div class="grid grid-cols-3 gap-2">
			<div class="space-y-1">
				<Label class="text-xs text-muted-foreground">R</Label>
				<Input
					type="number"
					class="font-mono"
					value={rgb.r.toString()}
					min={0}
					max={255}
					oninput={(e) => handleRgbInput('r', (e.target as HTMLInputElement).value)}
				/>
			</div>
			<div class="space-y-1">
				<Label class="text-xs text-muted-foreground">G</Label>
				<Input
					type="number"
					class="font-mono"
					value={rgb.g.toString()}
					min={0}
					max={255}
					oninput={(e) => handleRgbInput('g', (e.target as HTMLInputElement).value)}
				/>
			</div>
			<div class="space-y-1">
				<Label class="text-xs text-muted-foreground">B</Label>
				<Input
					type="number"
					class="font-mono"
					value={rgb.b.toString()}
					min={0}
					max={255}
					oninput={(e) => handleRgbInput('b', (e.target as HTMLInputElement).value)}
				/>
			</div>
		</div>
	</div>

	<!-- HSL -->
	<div class="space-y-1.5">
		<div class="flex items-center justify-between">
			<Label class="text-sm font-medium">HSL</Label>
			<Button variant="ghost" size="icon" class="size-7" onclick={() => copyValue(hslString)}>
				<CopyIcon class="size-3.5" />
			</Button>
		</div>
		<div class="grid grid-cols-3 gap-2">
			<div class="space-y-1">
				<Label class="text-xs text-muted-foreground">H</Label>
				<Input
					type="number"
					class="font-mono"
					value={hsl.h.toString()}
					min={0}
					max={360}
					oninput={(e) => handleHslInput('h', (e.target as HTMLInputElement).value)}
				/>
			</div>
			<div class="space-y-1">
				<Label class="text-xs text-muted-foreground">S</Label>
				<Input
					type="number"
					class="font-mono"
					value={hsl.s.toString()}
					min={0}
					max={100}
					oninput={(e) => handleHslInput('s', (e.target as HTMLInputElement).value)}
				/>
			</div>
			<div class="space-y-1">
				<Label class="text-xs text-muted-foreground">L</Label>
				<Input
					type="number"
					class="font-mono"
					value={hsl.l.toString()}
					min={0}
					max={100}
					oninput={(e) => handleHslInput('l', (e.target as HTMLInputElement).value)}
				/>
			</div>
		</div>
	</div>
</ToolPage>
