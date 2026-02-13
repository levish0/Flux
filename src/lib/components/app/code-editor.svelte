<script lang="ts">
	import { onMount } from 'svelte';
	import {
		EditorView,
		keymap,
		lineNumbers,
		highlightActiveLine,
		highlightActiveLineGutter
	} from '@codemirror/view';
	import { EditorState, type Extension } from '@codemirror/state';
	import { defaultKeymap, historyKeymap } from '@codemirror/commands';
	import { history } from '@codemirror/commands';
	import { json } from '@codemirror/lang-json';
	import { oneDark } from '@codemirror/theme-one-dark';
	import {
		syntaxHighlighting,
		defaultHighlightStyle,
		bracketMatching,
		foldGutter
	} from '@codemirror/language';
	import { mode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import { UseClipboard } from '$lib/hooks/use-clipboard.svelte';
	import { toast } from 'svelte-sonner';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import CheckIcon from '@lucide/svelte/icons/check';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import ClipboardPasteIcon from '@lucide/svelte/icons/clipboard-paste';

	let {
		label,
		value = $bindable(''),
		readonly = false,
		lang = 'json'
	}: {
		label: string;
		value?: string;
		readonly?: boolean;
		lang?: 'json' | 'plain';
	} = $props();

	let container: HTMLDivElement;
	let view: EditorView | undefined;
	let updating = false;

	const clipboard = new UseClipboard();

	const baseTheme = EditorView.theme({
		'&': {
			height: '100%',
			fontSize: '13px'
		},
		'.cm-scroller': {
			fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
			overflow: 'auto'
		},
		'.cm-gutters': {
			border: 'none'
		}
	});

	const lightTheme = EditorView.theme({
		'&': {
			backgroundColor: 'var(--background)',
			color: 'var(--foreground)'
		},
		'.cm-gutters': {
			backgroundColor: 'var(--muted)',
			color: 'var(--muted-foreground)'
		},
		'.cm-activeLineGutter': {
			backgroundColor: 'var(--accent)'
		},
		'.cm-activeLine': {
			backgroundColor: 'oklch(0 0 0 / 4%)'
		},
		'.cm-cursor': {
			borderLeftColor: 'var(--foreground)'
		},
		'&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
			backgroundColor: 'oklch(0.488 0.243 264.376 / 20%)'
		}
	});

	function getLangExtension(): Extension[] {
		if (lang === 'json') return [json()];
		return [];
	}

	function buildExtensions(isDark: boolean): Extension[] {
		const extensions: Extension[] = [
			baseTheme,
			lineNumbers(),
			highlightActiveLineGutter(),
			highlightActiveLine(),
			bracketMatching(),
			foldGutter(),
			history(),
			keymap.of([...defaultKeymap, ...historyKeymap]),
			syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
			...getLangExtension(),
			EditorView.updateListener.of((update) => {
				if (update.docChanged && !updating) {
					updating = true;
					value = update.state.doc.toString();
					updating = false;
				}
			})
		];

		if (isDark) {
			extensions.push(oneDark);
		} else {
			extensions.push(lightTheme);
		}

		if (readonly) {
			extensions.push(EditorState.readOnly.of(true));
			extensions.push(EditorView.editable.of(false));
		}

		return extensions;
	}

	onMount(() => {
		const isDark = mode.current === 'dark';
		view = new EditorView({
			state: EditorState.create({
				doc: value,
				extensions: buildExtensions(isDark)
			}),
			parent: container
		});

		return () => {
			view?.destroy();
		};
	});

	// Sync external value changes into editor
	$effect(() => {
		const currentValue = value;
		if (view && !updating) {
			const editorValue = view.state.doc.toString();
			if (currentValue !== editorValue) {
				updating = true;
				view.dispatch({
					changes: { from: 0, to: view.state.doc.length, insert: currentValue }
				});
				updating = false;
			}
		}
	});

	// Rebuild editor when theme changes
	$effect(() => {
		const isDark = mode.current === 'dark';
		if (view) {
			const currentDoc = view.state.doc.toString();
			view.setState(
				EditorState.create({
					doc: currentDoc,
					extensions: buildExtensions(isDark)
				})
			);
		}
	});

	async function handlePaste() {
		try {
			const text = await navigator.clipboard.readText();
			value = text;
		} catch {
			// fallback: user denied clipboard
		}
	}
</script>

<div class="flex h-full flex-col">
	<div class="flex shrink-0 items-center justify-between pb-2">
		<span class="text-sm font-medium">{label}</span>
		<div class="flex items-center gap-1">
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
	<div
		bind:this={container}
		class="min-h-0 flex-1 overflow-hidden rounded-md border border-border"
	></div>
</div>
