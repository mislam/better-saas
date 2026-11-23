<script lang="ts">
	import type { Snippet } from "svelte"

	let { title, children }: { title: string; children: Snippet } = $props()
</script>

<section
	class="mx-auto w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 shadow-sm"
>
	<h1 class="text-xl font-semibold tracking-tight text-neutral-950">{title}</h1>
	<div class="mt-6 flex flex-col gap-4">
		{@render children()}
	</div>
</section>
