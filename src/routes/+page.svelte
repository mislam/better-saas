<script lang="ts">
	import { resolve } from "$app/paths"

	import type { PageProps } from "./$types"

	let { data }: PageProps = $props()
</script>

<svelte:head>
	<title>Better SaaS</title>
</svelte:head>

<div class="mx-auto max-w-lg">
	<p class="text-sm font-medium text-neutral-500">Better SaaS</p>
	<h1 class="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">Your account</h1>
	{#if data.user}
		<p class="mt-3 text-neutral-600">You are signed in.</p>
		<div class="mt-8">
			<a href={resolve("/account")} class="btn">Continue</a>
		</div>
	{:else}
		<p class="mt-3 text-neutral-600">Sign in to continue, or create an account with your email.</p>
		<div class="mt-8">
			<a href={resolve("/login")} class="btn">Sign in</a>
		</div>
	{/if}
</div>
