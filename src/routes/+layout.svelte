<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	let { children } = $props();
</script>

<ModeWatcher defaultMode="dark" />
<Toaster />
<div class=" min-h-screen max-w-screen">
	<main>
		{@render children()}
	</main>
</div>
