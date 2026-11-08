import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { betterAuth } from "better-auth/minimal"
import { sveltekitCookies } from "better-auth/svelte-kit"

import { db } from "#lib/server/db/index.ts"
import { sendEmail } from "#lib/server/email/send-email.ts"
import {
	existingAccountEmail,
	resetPasswordEmail,
	verificationEmail,
} from "#lib/server/email/templates.ts"
import { APP_URL, BETTER_AUTH_SECRET } from "$app/env/private"
import { getRequestEvent } from "$app/server"

export const auth = betterAuth({
	baseURL: APP_URL,
	secret: BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: "pg" }),
	emailVerification: {
		sendOnSignUp: true,
		sendOnSignIn: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: ({ user, url }) => {
			const message = verificationEmail(url)
			sendEmail({ to: user.email, ...message })
			return Promise.resolve()
		},
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: ({ user, url }) => {
			const message = resetPasswordEmail(url)
			sendEmail({ to: user.email, ...message })
			return Promise.resolve()
		},
		onExistingUserSignUp: ({ user }) => {
			const message = existingAccountEmail()
			sendEmail({ to: user.email, ...message })
			return Promise.resolve()
		},
	},
	plugins: [
		sveltekitCookies(getRequestEvent), // make sure this is the last plugin in the array
	],
})
