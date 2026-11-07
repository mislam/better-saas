import { defineEnvVars } from "@sveltejs/kit/env"

export const variables = defineEnvVars({
	DATABASE_URL: { description: "The database connection string." },
	APP_URL: {
		description: "The app's public base URL, e.g. `http://localhost:5173`.",
	},
	BETTER_AUTH_SECRET: {
		description:
			"Secret used to sign tokens. For production use 32 characters generated with high entropy. See [Better Auth installation](https://www.better-auth.com/docs/installation).",
	},
})
