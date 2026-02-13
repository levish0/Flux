<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { toast } from 'svelte-sonner';
	import UploadIcon from '@lucide/svelte/icons/upload';
	import ImageIcon from '@lucide/svelte/icons/image';

	let base64Data = $state('');
	let imageUrl = $state('');
	let fileName = $state('');
	let error = $state('');

	// Decode base64 → image preview
	$effect(() => {
		error = '';
		const trimmed = base64Data.trim();
		if (!trimmed) {
			imageUrl = '';
			return;
		}

		// If it already has a data URI prefix, use as-is
		if (trimmed.startsWith('data:image/')) {
			imageUrl = trimmed;
			return;
		}

		// Try to detect and add prefix
		try {
			atob(trimmed.replace(/\s/g, ''));
			imageUrl = `data:image/png;base64,${trimmed.replace(/\s/g, '')}`;
		} catch {
			error = 'Invalid Base64 data';
			imageUrl = '';
		}
	});

	function handleFileSelect() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/png,image/jpeg,image/gif,image/webp,image/svg+xml,image/bmp,image/x-icon';
		input.onchange = () => {
			const file = input.files?.[0];
			if (!file) return;
			encodeFile(file);
		};
		input.click();
	}

	function encodeFile(file: File) {
		fileName = file.name;
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result as string;
			base64Data = result;
			imageUrl = result;
		};
		reader.onerror = () => {
			error = 'Failed to read file';
		};
		reader.readAsDataURL(file);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		const file = e.dataTransfer?.files[0];
		if (file && file.type.startsWith('image/')) {
			encodeFile(file);
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
	}

	async function handlePaste() {
		try {
			const items = await navigator.clipboard.read();
			for (const item of items) {
				for (const type of item.types) {
					if (type.startsWith('image/')) {
						const blob = await item.getType(type);
						const file = new File([blob], 'pasted-image', { type });
						encodeFile(file);
						return;
					}
				}
			}
		} catch {
			// Fallback: try reading text
			try {
				const text = await navigator.clipboard.readText();
				if (text.startsWith('data:image/') || /^[A-Za-z0-9+/=\s]+$/.test(text)) {
					base64Data = text;
				}
			} catch {
				// ignore
			}
		}
	}
</script>

<ToolPage title="Base64 Image" fillHeight>
	<div class="flex min-h-0 flex-1 gap-4">
		<!-- Left: Base64 data -->
		<div class="flex min-h-0 flex-1 flex-col gap-2">
			<ToolTextarea
				label="Base64"
				bind:value={base64Data}
				placeholder="Paste Base64 encoded image data or data URI..."
				grow
			/>
		</div>

		<!-- Right: Image preview + file select -->
		<div class="flex min-h-0 flex-1 flex-col gap-3">
			<div class="flex shrink-0 items-center justify-between">
				<Label class="text-sm font-medium">Image {fileName ? `(${fileName})` : ''}</Label>
				<div class="flex gap-1">
					<Button variant="ghost" size="sm" class="h-7 gap-1.5 text-xs" onclick={handlePaste}>
						Paste
					</Button>
					<Button variant="ghost" size="sm" class="h-7 gap-1.5 text-xs" onclick={handleFileSelect}>
						<UploadIcon class="size-3.5" />
						Browse
					</Button>
				</div>
			</div>

			<!-- Drop zone / Preview -->
			<div
				class="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-muted/30"
				ondrop={handleDrop}
				ondragover={handleDragOver}
				role="button"
				tabindex="-1"
			>
				{#if imageUrl && !error}
					<img src={imageUrl} alt="Preview" class="max-h-full max-w-full object-contain p-2" />
				{:else}
					<div class="flex flex-col items-center gap-2 text-muted-foreground">
						<ImageIcon class="size-10 opacity-50" />
						<p class="text-sm">Drop an image or paste Base64 data</p>
					</div>
				{/if}
			</div>

			{#if error}
				<div class="shrink-0 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
					{error}
				</div>
			{/if}
		</div>
	</div>
</ToolPage>
