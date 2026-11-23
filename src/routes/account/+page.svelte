<script lang="ts">
	import Panel from "#lib/panel.svelte"
	import { enhance } from "$app/forms"

	import type { PageProps } from "./$types"

	let { data }: PageProps = $props()
</script>

<svelte:head>
	<title>Account · Better SaaS</title>
</svelte:head>

<Panel title="Hello, {data.user.name}">
	<p class="text-sm text-neutral-600">You are signed in.</p>
	<form method="post" action="?/signOut" use:enhance>
		<button class="btn">Sign out</button>
	</form>
</Panel>
