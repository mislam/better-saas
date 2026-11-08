import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = (event) => {
	return {
		error: event.url.searchParams.get("error"),
		signedIn: Boolean(event.locals.user),
	}
}
