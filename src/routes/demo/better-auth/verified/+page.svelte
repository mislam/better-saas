<script lang="ts">
	import { resolve } from "$app/paths"

	import type { PageData } from "./$types"

	let { data }: { data: PageData } = $props()
</script>

<h1>Email verification</h1>
{#if data.error}
	<p>This link is invalid or expired.</p>
	<p><a href={resolve("/demo/better-auth/login")}>Sign in</a></p>
{:else}
	<p>Your email is verified.</p>
	{#if data.signedIn}
		<p><a href={resolve("/demo/better-auth")}>Continue</a></p>
	{:else}
		<p><a href={resolve("/demo/better-auth/login")}>Sign in</a></p>
	{/if}
{/if}
