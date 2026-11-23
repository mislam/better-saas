import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = (event) => {
	return {
		error: event.url.searchParams.get("error"),
		verified: event.url.searchParams.get("verified") === "1",
		signedIn: Boolean(event.locals.user),
	}
}
