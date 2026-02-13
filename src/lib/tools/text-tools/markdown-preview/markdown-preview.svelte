<script lang="ts">
	import ToolPage from '$lib/components/app/tool-page.svelte';
	import CodeEditor from '$lib/components/app/code-editor.svelte';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { marked } from 'marked';

	let input = $state(`# Markdown Preview

## Features

- **Bold** and *italic* text
- [Links](https://example.com)
- \`inline code\`

### Code Block

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

### Lists

1. First item
2. Second item
3. Third item

> This is a blockquote

---

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
`);

	let html = $derived(marked.parse(input) as string);
</script>

<ToolPage title="Markdown Preview" fillHeight>
	<Resizable.PaneGroup direction="horizontal" class="!h-0 min-h-0 flex-1">
		<Resizable.Pane defaultSize={50} minSize={20}>
			<CodeEditor label="Markdown" bind:value={input} lang="markdown" />
		</Resizable.Pane>
		<Resizable.Handle
			class="w-3 rounded bg-transparent transition-colors hover:bg-accent/50 data-[resize-handle-active]:bg-accent/50"
		/>
		<Resizable.Pane defaultSize={50} minSize={20}>
			<div class="flex h-full flex-col">
				<div class="shrink-0 pb-2">
					<span class="text-sm font-medium">Preview</span>
				</div>
				<div class="prose min-h-0 flex-1 overflow-auto rounded-md border border-border p-4">
					{@html html}
				</div>
			</div>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</ToolPage>

<style>
	:global(.prose h1) { font-size: 1.75em; font-weight: 700; margin: 0.5em 0; }
	:global(.prose h2) { font-size: 1.5em; font-weight: 600; margin: 0.5em 0; }
	:global(.prose h3) { font-size: 1.25em; font-weight: 600; margin: 0.5em 0; }
	:global(.prose p) { margin: 0.5em 0; }
	:global(.prose code) { background: var(--muted); padding: 0.15em 0.35em; border-radius: 0.25em; font-size: 0.9em; }
	:global(.prose pre) { background: var(--muted); padding: 1em; border-radius: 0.5em; overflow-x: auto; margin: 0.75em 0; }
	:global(.prose pre code) { background: none; padding: 0; }
	:global(.prose blockquote) { border-left: 3px solid var(--border); padding-left: 1em; margin: 0.75em 0; color: var(--muted-foreground); }
	:global(.prose ul) { list-style: disc; padding-left: 1.5em; margin: 0.5em 0; }
	:global(.prose ol) { list-style: decimal; padding-left: 1.5em; margin: 0.5em 0; }
	:global(.prose hr) { border: none; border-top: 1px solid var(--border); margin: 1em 0; }
	:global(.prose table) { width: 100%; border-collapse: collapse; margin: 0.75em 0; }
	:global(.prose th), :global(.prose td) { border: 1px solid var(--border); padding: 0.5em; text-align: left; }
	:global(.prose th) { background: var(--muted); font-weight: 600; }
	:global(.prose a) { color: var(--primary); text-decoration: underline; }
	:global(.prose strong) { font-weight: 700; }
	:global(.prose em) { font-style: italic; }
	:global(.prose img) { max-width: 100%; border-radius: 0.5em; }
</style>
