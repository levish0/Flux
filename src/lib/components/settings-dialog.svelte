<script lang="ts">
	import { cn } from "$lib/utils";
	import { fade, scale } from "svelte/transition";
	import { setMode, userPrefersMode } from "mode-watcher";
	import * as Card from "$lib/components/ui/card/index.js";
	import { settingsDialog } from "$lib/stores/settings-dialog.svelte";
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import MonitorIcon from "@lucide/svelte/icons/monitor";
	import PaletteIcon from "@lucide/svelte/icons/palette";
	import InfoIcon from "@lucide/svelte/icons/info";
	import XIcon from "@lucide/svelte/icons/x";

	const categories = [
		{ id: "appearance", label: "Appearance", icon: PaletteIcon },
		{ id: "about", label: "About", icon: InfoIcon },
	];

	let activeCategory = $state("appearance");

	let selectedMode = $derived(userPrefersMode.current ?? "system");

	const themes = [
		{ value: "light" as const, label: "Light", icon: SunIcon },
		{ value: "dark" as const, label: "Dark", icon: MoonIcon },
		{ value: "system" as const, label: "System", icon: MonitorIcon },
	];

	function close() {
		settingsDialog.open = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape" && settingsDialog.open) {
			e.preventDefault();
			close();
		}
	}

	$effect(() => {
		if (settingsDialog.open) {
			activeCategory = "appearance";
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if settingsDialog.open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
		onclick={close}
		onkeydown={(e) => e.key === "Enter" && close()}
		role="button"
		tabindex="-1"
		aria-label="Close settings"
	></div>

	<!-- Dialog -->
	<div
		class="bg-background fixed inset-4 z-50 mx-auto flex max-h-[calc(100vh-2rem)] overflow-hidden rounded-xl border shadow-2xl lg:inset-12 lg:max-h-[calc(100vh-6rem)] lg:max-w-7xl"
		transition:scale={{ duration: 150, start: 0.95, opacity: 0 }}
		role="dialog"
		aria-modal="true"
		aria-label="Settings"
		tabindex="-1"
	>
		<!-- Sidebar -->
		<aside class="bg-muted/30 flex w-56 shrink-0 flex-col border-r">
			<div class="flex h-14 items-center border-b px-4">
				<h2 class="text-lg font-semibold">Settings</h2>
			</div>
			<nav class="flex-1 overflow-y-auto p-2">
				<ul class="space-y-1">
					{#each categories as cat (cat.id)}
						{@const Icon = cat.icon}
						<li>
							<button
								type="button"
								onclick={() => (activeCategory = cat.id)}
								class={cn(
									"flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
									activeCategory === cat.id
										? "bg-primary/10 text-primary"
										: "text-muted-foreground hover:bg-muted"
								)}
							>
								<Icon class="size-4" />
								{cat.label}
							</button>
						</li>
					{/each}
				</ul>
			</nav>
		</aside>

		<!-- Main Content -->
		<main class="flex flex-1 flex-col overflow-hidden">
			<div class="flex h-14 items-center justify-between border-b pr-2 pl-6">
				<h3 class="text-lg font-semibold">
					{categories.find((c) => c.id === activeCategory)?.label}
				</h3>
				<button
					type="button"
					onclick={close}
					class="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors"
					aria-label="Close settings"
				>
					<XIcon class="size-5" />
				</button>
			</div>

			<div class="flex-1 overflow-y-auto p-6">
				{#if activeCategory === "appearance"}
					<div class="mx-auto max-w-2xl space-y-6">
						<section class="space-y-3">
							<h4 class="text-base font-semibold">Theme</h4>
							<Card.Root>
								<Card.Content class="py-4">
									<div class="space-y-3">
										<p class="text-sm text-muted-foreground">Choose how FLUX looks to you.</p>
										<div class="grid grid-cols-3 gap-3">
											{#each themes as theme (theme.value)}
												{@const Icon = theme.icon}
												<button
													type="button"
													onclick={() => setMode(theme.value)}
													class={cn(
														"flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors",
														selectedMode === theme.value
															? "border-primary bg-primary/5"
															: "border-transparent bg-muted/50 hover:bg-muted"
													)}
												>
													<Icon
														class={cn(
															"size-6",
															selectedMode === theme.value
																? "text-primary"
																: "text-muted-foreground"
														)}
													/>
													<span
														class={cn(
															"text-sm font-medium",
															selectedMode === theme.value
																? "text-primary"
																: "text-muted-foreground"
														)}
													>
														{theme.label}
													</span>
												</button>
											{/each}
										</div>
									</div>
								</Card.Content>
								<Card.Footer class="border-t px-6 py-3">
									<span class="text-sm text-muted-foreground"
										>Theme preference is stored locally.</span
									>
								</Card.Footer>
							</Card.Root>
						</section>
					</div>
				{:else if activeCategory === "about"}
					<div class="flex h-full items-end justify-end">
						<div class="space-y-1">
							<p class="text-lg font-bold">FLUX</p>
							<div class="text-sm text-muted-foreground space-y-0.5">
								<p>v0.1.0</p>
								<p>by Levi Laine</p>
								<p>MIT License</p>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</main>
	</div>
{/if}
