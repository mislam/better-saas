/**
 * Confirms DATABASE_URL accepts a connection before Drizzle Kit runs.
 * Drizzle Kit's progress spinner exits 1 without printing a connection error.
 */
import { Client } from "pg"

const url = process.env.DATABASE_URL
if (!url) {
	console.error("DATABASE_URL is not set. Copy .env.example to .env and set it.")
	process.exit(1)
}

function describe(error: unknown): string {
	if (error instanceof AggregateError) {
		const nested = error.errors.map((item) => describe(item)).filter(Boolean)
		if (nested.length > 0) return nested.join("\n")
	}
	if (error instanceof Error && error.message) return error.message
	if (typeof error === "object" && error && "code" in error && typeof error.code === "string") {
		return error.code
	}
	return String(error)
}

const client = new Client({ connectionString: url })
try {
	await client.connect()
} catch (error) {
	const message = describe(error)
	console.error(`Cannot connect using DATABASE_URL:\n${message}`)
	console.error(
		"Postgres must be running, and the database named in that URL must already exist. The example URL uses role postgres, password postgres, and database main on localhost:5432. Optional Compose (`pnpm dev:up`) starts a server with those values.",
	)
	process.exit(1)
} finally {
	await client.end().catch(() => {})
}
