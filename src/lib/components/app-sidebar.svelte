<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { page } from '$app/stores';
	import type { ComponentProps } from 'svelte';
	import {
		categories,
		toolsByCategory,
		searchTools,
		type ToolDefinition
	} from '$lib/tools/registry';

	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import HomeIcon from '@lucide/svelte/icons/house';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import { settingsDialog } from '$lib/stores/settings-dialog.svelte';
	import SearchIcon from '@lucide/svelte/icons/search';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import ArrowLeftRightIcon from '@lucide/svelte/icons/arrow-left-right';
	import LockKeyholeIcon from '@lucide/svelte/icons/lock-keyhole';
	import BracesIcon from '@lucide/svelte/icons/braces';
	import WandSparklesIcon from '@lucide/svelte/icons/wand-sparkles';
	import ImageIcon from '@lucide/svelte/icons/image';
	import TypeIcon from '@lucide/svelte/icons/type';
	import { toggleMode, mode } from 'mode-watcher';

	let currentMode = $derived(mode.current);

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();

	let searchQuery = $state('');

	const categoryIcons: Record<string, typeof HomeIcon> = {
		converters: ArrowLeftRightIcon,
		'encoders-decoders': LockKeyholeIcon,
		formatters: BracesIcon,
		generators: WandSparklesIcon,
		'graphic-tools': ImageIcon,
		'text-tools': TypeIcon
	};

	let filteredCategories = $derived.by(() => {
		if (!searchQuery.trim()) {
			return categories.map((cat) => ({
				...cat,
				tools: toolsByCategory.get(cat.slug) ?? []
			}));
		}
		const matched = searchTools(searchQuery);
		return categories
			.map((cat) => ({
				...cat,
				tools: matched.filter((t) => t.category === cat.slug)
			}))
			.filter((cat) => cat.tools.length > 0);
	});

	function isToolActive(tool: ToolDefinition): boolean {
		const currentPath = $page.url.pathname;
		return currentPath === `/tools/${tool.category}/${tool.slug}`;
	}
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg" tooltipContent="FLUX">
					{#snippet child({ props })}
						<a href="/" {...props}>
							<span class="truncate text-lg font-bold">FLUX</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
		<div class="group-data-[collapsible=icon]:hidden">
			<div class="relative">
				<SearchIcon
					class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
				/>
				<Sidebar.Input placeholder="Search tools..." class="pl-8" bind:value={searchQuery} />
			</div>
		</div>
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Tools</Sidebar.GroupLabel>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton tooltipContent="All Tools" isActive={$page.url.pathname === '/'}>
						{#snippet child({ props })}
							<a href="/" {...props}>
								<HomeIcon />
								<span>All Tools</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>

				{#each filteredCategories as cat (cat.slug)}
					<Collapsible.Root
						open={searchQuery.trim().length > 0 || undefined}
						class="group/collapsible"
					>
						{#snippet child({ props })}
							<Sidebar.MenuItem {...props}>
								<Collapsible.Trigger>
									{#snippet child({ props })}
										<Sidebar.MenuButton {...props} tooltipContent={cat.name}>
											{@const Icon = categoryIcons[cat.slug]}
											{#if Icon}
												<Icon />
											{/if}
											<span>{cat.name}</span>
											<ChevronRightIcon
												class="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
											/>
										</Sidebar.MenuButton>
									{/snippet}
								</Collapsible.Trigger>
								<Collapsible.Content>
									<Sidebar.MenuSub>
										{#each cat.tools as tool (tool.slug)}
											{@const ToolIcon = tool.icon}
											<Sidebar.MenuSubItem>
												<Sidebar.MenuSubButton isActive={isToolActive(tool)}>
													{#snippet child({ props })}
														<a
															href="/tools/{tool.category}/{tool.slug}"
															{...props}
															class:opacity-50={!tool.implemented}
														>
															<ToolIcon class="size-4" />
															<span>{tool.name}</span>
														</a>
													{/snippet}
												</Sidebar.MenuSubButton>
											</Sidebar.MenuSubItem>
										{/each}
									</Sidebar.MenuSub>
								</Collapsible.Content>
							</Sidebar.MenuItem>
						{/snippet}
					</Collapsible.Root>
				{/each}
			</Sidebar.Menu>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton tooltipContent="Toggle Theme" onclick={toggleMode}>
					{#if currentMode === 'dark'}
						<SunIcon />
					{:else}
						<MoonIcon />
					{/if}
					<span>Toggle Theme</span>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton tooltipContent="Settings" onclick={() => (settingsDialog.open = true)}>
					<SettingsIcon />
					<span>Settings</span>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>

	<Sidebar.Rail />
</Sidebar.Root>
