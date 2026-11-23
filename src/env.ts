import { defineEnvVars } from "@sveltejs/kit/env"

export const variables = defineEnvVars({
	DATABASE_URL: {
		description:
			"PostgreSQL connection URL. Local default is Postgres 16+ on localhost. A host ending in .neon.tech, or db.localtest.me, uses the Neon serverless driver. Any other host uses node-postgres.",
		schema: (value) => {
			if (!value) throw new Error("DATABASE_URL is not set")
			if (!/^postgres(ql)?:\/\//.test(value)) {
				throw new Error("DATABASE_URL must be a PostgreSQL connection URL")
			}
			return value
		},
	},
	APP_URL: {
		description:
			"The app's public base URL. Must match the browser origin (Better Auth cookies / CSRF), e.g. `http://localhost:5173`.",
		schema: (value) => {
			if (!value) throw new Error("APP_URL is not set")
			try {
				new URL(value)
			} catch {
				throw new Error("APP_URL must be a valid URL")
			}
			return value
		},
	},
	BETTER_AUTH_SECRET: {
		description:
			"Secret for Better Auth encryption and signing. At least 32 characters. Run `pnpm auth:secret --write` for a 64-character value. See [Better Auth installation](https://www.better-auth.com/docs/installation).",
		schema: (value) => {
			if (!value) throw new Error("BETTER_AUTH_SECRET is not set")
			if (value.length < 32) {
				throw new Error(
					"BETTER_AUTH_SECRET must be at least 32 characters (run: pnpm auth:secret --write)",
				)
			}
			return value
		},
	},
	EMAIL_FROM: {
		description:
			"From address for outbound mail. In production this must be on a domain verified in Resend.",
		schema: (value) => {
			if (!value) throw new Error("EMAIL_FROM is not set")
			return value
		},
	},
	RESEND_API_KEY: {
		description:
			"Resend API key. When set, mail is sent through Resend. Leave empty when mail is not configured.",
		schema: (value) => value || undefined,
	},
	SMTP_HOST: {
		description:
			"SMTP host. Leave empty when mail is not configured. Optional Mailpit is localhost. Leave unset in production when RESEND_API_KEY is set.",
		schema: (value) => value || undefined,
	},
	SMTP_PORT: {
		description:
			"SMTP port. Mailpit uses 1025. Defaults to 1025 when SMTP_HOST is set and this is empty.",
		schema: (value) => {
			if (!value) return undefined
			const port = Number(value)
			if (!Number.isInteger(port) || port < 1 || port > 65535) {
				throw new Error("SMTP_PORT must be an integer from 1 to 65535")
			}
			return port
		},
	},
})
