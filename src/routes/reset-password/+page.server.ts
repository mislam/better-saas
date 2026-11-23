import { fail } from "@sveltejs/kit"
import { APIError } from "better-auth/api"

import { auth } from "#lib/server/auth.ts"
import { databaseHint, describeError } from "#lib/server/db/describe-error.ts"

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
			const detail = describeError(error)
			const hint = databaseHint(error)
			console.error(detail || "Reset failed")
			if (hint) console.error(hint)
			if (error instanceof APIError) {
				return fail(error.statusCode, { message: error.message || "Reset failed" })
			}
			if (hint) return fail(500, { message: `${detail} ${hint}` })
			return fail(500, { message: detail || "Reset failed" })
		}

		return { ok: true, message: "Password updated. You can sign in." }
	},
}
