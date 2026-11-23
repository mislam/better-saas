import { fail, redirect } from "@sveltejs/kit"
import { APIError } from "better-auth/api"

import { auth } from "#lib/server/auth.ts"
import { databaseHint, describeError } from "#lib/server/db/describe-error.ts"

import type { Actions, PageServerLoad } from "./$types"

const verifiedPath = "/verify-email?verified=1"
const resetPath = "/reset-password"

const checkEmail = "Check your email for a verification link."
const resetSent = "If an account exists for that email, we sent a reset link."
const verifyFirst = "Verify your email before signing in. We sent another link."

export const load: PageServerLoad = (event) => {
	if (event.locals.user) {
		return redirect(302, "/account")
	}
	return {}
}

function actionError(error: unknown, fallback: string) {
	const detail = describeError(error)
	const hint = databaseHint(error)
	console.error(detail || fallback)
	if (hint) console.error(hint)

	if (error instanceof APIError) {
		if (error.statusCode === 403) return fail(403, { message: verifyFirst })
		return fail(error.statusCode, { message: error.message || fallback })
	}
	if (hint) return fail(500, { message: `${detail} ${hint}` })
	return fail(500, { message: detail || fallback })
}

export const actions: Actions = {
	signInEmail: async (event) => {
		const formData = await event.request.formData()
		const email = formData.get("email")?.toString() ?? ""
		const password = formData.get("password")?.toString() ?? ""

		try {
			await auth.api.signInEmail({
				body: {
					email,
					password,
					callbackURL: verifiedPath,
				},
			})
		} catch (error) {
			return actionError(error, "Signin failed")
		}

		return redirect(302, "/account")
	},
	signUpEmail: async (event) => {
		const formData = await event.request.formData()
		const email = formData.get("email")?.toString() ?? ""
		const password = formData.get("password")?.toString() ?? ""
		const name = formData.get("name")?.toString() ?? ""

		try {
			await auth.api.signUpEmail({
				body: {
					email,
					password,
					name,
					callbackURL: verifiedPath,
				},
			})
		} catch (error) {
			return actionError(error, "Registration failed")
		}

		return { ok: true, message: checkEmail }
	},
	requestPasswordReset: async (event) => {
		const formData = await event.request.formData()
		const email = formData.get("email")?.toString() ?? ""

		try {
			await auth.api.requestPasswordReset({
				body: {
					email,
					redirectTo: resetPath,
				},
			})
		} catch (error) {
			return actionError(error, "Could not send a reset link")
		}

		return { ok: true, message: resetSent }
	},
}
