<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import { Label } from '$lib/components/ui/label/index.js';

	let token = $state('');

	function base64UrlDecode(str: string): string {
		// Add padding
		let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
		const pad = base64.length % 4;
		if (pad) base64 += '='.repeat(4 - pad);

		try {
			const binary = atob(base64);
			const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
			return new TextDecoder('utf-8').decode(bytes);
		} catch {
			return '';
		}
	}

	let decoded = $derived.by(() => {
		const raw = token.trim();
		if (!raw) return null;

		const parts = raw.split('.');
		if (parts.length !== 3) return { error: 'Invalid JWT: expected 3 parts separated by dots' };

		try {
			const headerRaw = base64UrlDecode(parts[0]);
			const payloadRaw = base64UrlDecode(parts[1]);

			if (!headerRaw || !payloadRaw) {
				return { error: 'Invalid JWT: could not decode Base64URL parts' };
			}

			const header = JSON.parse(headerRaw);
			const payload = JSON.parse(payloadRaw);

			return {
				header: JSON.stringify(header, null, 2),
				payload: JSON.stringify(payload, null, 2),
				signature: parts[2],
				error: null
			};
		} catch {
			return { error: 'Invalid JWT: could not parse JSON' };
		}
	});
</script>

<ToolPage title="JWT Decoder" fillHeight>
	<ToolTextarea
		label="JWT Token"
		bind:value={token}
		placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U"
		rows={4}
	/>

	{#if decoded?.error}
		<div class="shrink-0 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
			{decoded.error}
		</div>
	{/if}

	{#if decoded && !decoded.error}
		<div class="flex min-h-0 flex-1 flex-col gap-4 overflow-auto">
			<div class="space-y-1.5">
				<Label class="text-sm font-medium">Header</Label>
				<pre class="overflow-auto rounded-lg border bg-muted/50 p-3 font-mono text-sm">{decoded.header}</pre>
			</div>
			<div class="space-y-1.5">
				<Label class="text-sm font-medium">Payload</Label>
				<pre class="overflow-auto rounded-lg border bg-muted/50 p-3 font-mono text-sm">{decoded.payload}</pre>
			</div>
			<div class="space-y-1.5">
				<Label class="text-sm font-medium">Signature</Label>
				<pre class="overflow-auto rounded-lg border bg-muted/50 p-3 font-mono text-sm break-all">{decoded.signature}</pre>
			</div>
		</div>
	{/if}
</ToolPage>
