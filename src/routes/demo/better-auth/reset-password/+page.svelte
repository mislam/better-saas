<script lang="ts">
	import { enhance } from "$app/forms"
	import { resolve } from "$app/paths"

	import type { ActionData, PageData } from "./$types"

	let { data, form }: { data: PageData; form: ActionData } = $props()
</script>

<h1>Reset password</h1>
{#if data.error || !data.token}
	<p>This link is invalid or expired.</p>
	<p><a href={resolve("/demo/better-auth/login")}>Sign in</a></p>
{:else}
	<form method="post" use:enhance>
		<input type="hidden" name="token" value={data.token} />
		<label>
			Password
			<input
				type="password"
				name="password"
				minlength="8"
				class="mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</label>
		<button class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
			Update password
		</button>
	</form>
	{#if form?.ok}
		<p>{form.message}</p>
		<p><a href={resolve("/demo/better-auth/login")}>Sign in</a></p>
	{:else if form?.message}
		<p class="text-red-500">{form.message}</p>
	{/if}
{/if}
