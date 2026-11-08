import { fail } from "@sveltejs/kit"
import { APIError } from "better-auth/api"

import { auth } from "#lib/server/auth.ts"

import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = (event) => {
	return {
		token: event.url.searchParams.get("token"),
		error: event.url.searchParams.get("error"),
	}
}

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData()
		const token = formData.get("token")?.toString() ?? ""
		const newPassword = formData.get("password")?.toString() ?? ""

		try {
			await auth.api.resetPassword({
				body: { newPassword, token },
			})
		} catch (error) {
			if (error instanceof APIError) {
				return fail(error.statusCode, { message: error.message || "Reset failed" })
			}
			return fail(500, { message: "Unexpected error" })
		}

		return { ok: true, message: "Password updated. You can sign in." }
	},
}
