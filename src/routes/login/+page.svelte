<script lang="ts">
	import Panel from "#lib/panel.svelte"
	import { enhance } from "$app/forms"

	import type { PageProps } from "./$types"

	let { form }: PageProps = $props()
</script>

<svelte:head>
	<title>Sign in · Better SaaS</title>
</svelte:head>

<Panel title="Sign in">
	<form class="flex flex-col gap-4" method="post" action="?/signInEmail" use:enhance>
		<label class="field">
			Email
			<input class="control" type="email" name="email" autocomplete="email" required />
		</label>
		<label class="field">
			Password
			<input
				class="control"
				type="password"
				name="password"
				autocomplete="current-password"
				required
			/>
		</label>
		<label class="field">
			Name
			<input class="control" name="name" autocomplete="name" />
			<span class="font-normal text-neutral-500">Only used when you create an account.</span>
		</label>
		<div class="flex gap-2">
			<button class="btn">Sign in</button>
			<button class="btn-quiet" formaction="?/signUpEmail">Create account</button>
		</div>
	</form>
	<form
		class="flex flex-col gap-4 border-t border-neutral-200 pt-4"
		method="post"
		action="?/requestPasswordReset"
		use:enhance
	>
		<label class="field">
			Reset password
			<input class="control" type="email" name="email" autocomplete="email" required />
		</label>
		<button class="btn-quiet w-fit">Send reset link</button>
	</form>
	{#if form?.ok}
		<p class="text-sm text-neutral-600">{form.message}</p>
	{:else if form?.message}
		<p class="text-sm text-red-600">{form.message}</p>
	{/if}
</Panel>
