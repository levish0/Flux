<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import SettingsDialog from '$lib/components/settings-dialog.svelte';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { page } from '$app/stores';
	import { toolBySlug, categoryBySlug } from '$lib/tools/registry';

	let { children } = $props();

	let breadcrumbs = $derived.by(() => {
		const path = $page.url.pathname;

		if (path === '/') {
			return [{ label: 'All Tools', href: '/' }];
		}
		// /tools/[category]/[tool]
		const toolMatch = path.match(/^\/tools\/([^/]+)\/([^/]+)/);
		if (toolMatch) {
			const [, categorySlug, toolSlug] = toolMatch;
			const category = categoryBySlug.get(categorySlug as any);
			const tool = toolBySlug.get(toolSlug);
			const crumbs: { label: string; href?: string }[] = [];
			if (category) crumbs.push({ label: category.name, href: `/tools/${categorySlug}` });
			if (tool) crumbs.push({ label: tool.name });
			return crumbs;
		}

		// /tools/[category]
		const catMatch = path.match(/^\/tools\/([^/]+)\/?$/);
		if (catMatch) {
			const [, categorySlug] = catMatch;
			const category = categoryBySlug.get(categorySlug as any);
			if (category) return [{ label: category.name }];
		}

		return [];
	});
</script>

<ModeWatcher defaultMode="dark" />
<Toaster />
<SettingsDialog />

<Sidebar.Provider class="h-svh !min-h-0">
	<AppSidebar />
	<Sidebar.Inset>
		<header
			class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
		>
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ms-1" />
				<Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						{#each breadcrumbs as crumb, i (i)}
							{#if i > 0}
								<Breadcrumb.Separator class="hidden md:block" />
							{/if}
							<Breadcrumb.Item class="hidden md:block">
								{#if i === breadcrumbs.length - 1}
									<Breadcrumb.Page>{crumb.label}</Breadcrumb.Page>
								{:else}
									<Breadcrumb.Link href={crumb.href}>{crumb.label}</Breadcrumb.Link>
								{/if}
							</Breadcrumb.Item>
						{/each}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</header>
		<div class="min-h-0 flex-1 overflow-hidden">
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
