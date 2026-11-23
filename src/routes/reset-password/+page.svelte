<script lang="ts">
	import Panel from "#lib/panel.svelte"
	import { enhance } from "$app/forms"
	import { resolve } from "$app/paths"

	import type { PageProps } from "./$types"

	let { data, form }: PageProps = $props()
</script>

<svelte:head>
	<title>Reset password · Better SaaS</title>
</svelte:head>

<Panel title="Reset password">
	{#if data.error || !data.token}
		<p class="text-sm text-neutral-600">This link is invalid or expired.</p>
		<a href={resolve("/login")} class="text-sm font-medium text-neutral-950">Sign in</a>
	{:else}
		<form class="flex flex-col gap-4" method="post" use:enhance>
			<input type="hidden" name="token" value={data.token} />
			<label class="field">
				New password
				<input
					class="control"
					type="password"
					name="password"
					minlength="8"
					autocomplete="new-password"
					required
				/>
			</label>
			<button class="btn w-fit">Update password</button>
		</form>
		{#if form?.ok}
			<p class="text-sm text-neutral-600">{form.message}</p>
			<a href={resolve("/login")} class="text-sm font-medium text-neutral-950">Sign in</a>
		{:else if form?.message}
			<p class="text-sm text-red-600">{form.message}</p>
		{/if}
	{/if}
</Panel>
