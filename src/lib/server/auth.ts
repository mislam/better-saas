import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { betterAuth } from "better-auth/minimal"
import { sveltekitCookies } from "better-auth/svelte-kit"

import { db } from "#lib/server/db/index.ts"
import { APP_URL, BETTER_AUTH_SECRET } from "$app/env/private"
import { getRequestEvent } from "$app/server"

export const auth = betterAuth({
	baseURL: APP_URL,
	secret: BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: "pg" }),
	emailAndPassword: { enabled: true },
	plugins: [
		sveltekitCookies(getRequestEvent), // make sure this is the last plugin in the array
	],
})
