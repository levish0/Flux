<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import ToolTextarea from '$lib/components/app/tool-textarea.svelte';
	import * as FileDropZone from '$lib/components/ui/file-drop-zone/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
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

		if (trimmed.startsWith('data:image/')) {
			imageUrl = trimmed;
			return;
		}

		try {
			atob(trimmed.replace(/\s/g, ''));
			imageUrl = `data:image/png;base64,${trimmed.replace(/\s/g, '')}`;
		} catch {
			error = 'Invalid Base64 data';
			imageUrl = '';
		}
	});

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

	const onUpload: FileDropZone.FileDropZoneRootProps['onUpload'] = async (files) => {
		const file = files[0];
		if (file) encodeFile(file);
	};
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
		<div class="flex min-h-0 flex-1 flex-col gap-2">
			{#if imageUrl && !error}
				<div class="flex shrink-0 items-center justify-between">
					<Label class="text-sm font-medium">Image {fileName ? `(${fileName})` : ''}</Label>
				</div>
				<div class="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg border bg-muted/30">
					<img src={imageUrl} alt="Preview" class="max-h-full max-w-full object-contain p-2" />
				</div>
			{:else}
				<Label class="shrink-0 text-sm font-medium">Image</Label>
				<div class="min-h-0 flex-1">
					<FileDropZone.Root
						{onUpload}
						accept="image/*"
						maxFiles={1}
						fileCount={0}
					>
						<FileDropZone.Trigger class="block h-full" />
					</FileDropZone.Root>
				</div>
			{/if}

			{#if error}
				<div class="shrink-0 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
					{error}
				</div>
			{/if}
		</div>
	</div>
</ToolPage>
