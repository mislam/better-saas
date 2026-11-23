<script lang="ts">
	import "./layout.css"

	import favicon from "#lib/assets/favicon.svg"
	import { resolve } from "$app/paths"

	import type { LayoutProps } from "./$types"

	let { children, data }: LayoutProps = $props()
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-neutral-50 text-neutral-900">
	<header class="border-b border-neutral-200 bg-white">
		<div class="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
			<a href={resolve("/")} class="text-sm font-semibold tracking-tight">Better SaaS</a>
			{#if data.user}
				<a href={resolve("/account")} class="text-sm text-neutral-600 hover:text-neutral-950">
					{data.user.name}
				</a>
			{:else}
				<a
					href={resolve("/login")}
					class="text-sm font-medium text-neutral-950 hover:text-neutral-600"
				>
					Sign in
				</a>
			{/if}
		</div>
	</header>
	<main class="mx-auto max-w-5xl px-6 py-16">
		{@render children()}
	</main>
</div>
