<script lang="ts">
	import Panel from "#lib/panel.svelte"
	import { resolve } from "$app/paths"

	import type { PageProps } from "./$types"

	let { data }: PageProps = $props()
</script>

<svelte:head>
	<title>Email verification · Better SaaS</title>
</svelte:head>

<Panel title="Email verification">
	{#if data.error}
		<p class="text-sm text-neutral-600">This link is invalid or expired.</p>
		<a href={resolve("/login")} class="text-sm font-medium text-neutral-950">Sign in</a>
	{:else if data.verified}
		<p class="text-sm text-neutral-600">Your email is verified.</p>
		{#if data.signedIn}
			<a href={resolve("/account")} class="btn w-fit">Continue</a>
		{:else}
			<a href={resolve("/login")} class="btn w-fit">Sign in</a>
		{/if}
	{:else}
		<p class="text-sm text-neutral-600">Open the verification link in your email.</p>
		<a href={resolve("/login")} class="text-sm font-medium text-neutral-950">Sign in</a>
	{/if}
</Panel>
