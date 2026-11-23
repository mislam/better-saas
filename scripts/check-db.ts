/**
 * Confirms DATABASE_URL accepts a connection before Drizzle Kit runs.
 * Drizzle Kit's progress spinner exits 1 without printing a connection error.
 */
import { Client } from "pg"

import { databaseHint, describeError } from "../src/lib/server/db/describe-error.ts"

const url = process.env.DATABASE_URL
if (!url) {
	console.error("DATABASE_URL is not set. Copy .env.example to .env and set it.")
	process.exit(1)
}

const client = new Client({ connectionString: url })
try {
	await client.connect()
} catch (error) {
	const message = describeError(error)
	console.error(`Cannot connect using DATABASE_URL:\n${message}`)
	const hint = databaseHint(error)
	if (hint) console.error(hint)
	process.exit(1)
} finally {
	await client.end().catch(() => {})
}
