import { Pool as NeonPool } from "@neondatabase/serverless"
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless"
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres"
import { Pool as PgPool } from "pg"

import { DATABASE_URL } from "$app/env/private"

import { usesNeonServerless } from "./driver.ts"
import { configureNeon } from "./neon-config.ts"
import * as schema from "./schema.ts"

if (!DATABASE_URL) throw new Error("DATABASE_URL is not set")

function createDb(connectionString: string) {
	if (usesNeonServerless(connectionString)) {
		configureNeon(connectionString)
		const pool = new NeonPool({ connectionString })
		return drizzleNeon(pool, { schema })
	}

	const pool = new PgPool({ connectionString })
	return drizzlePg(pool, { schema })
}

// Neon hosts and the optional local proxy use the serverless Pool so db.transaction() works.
// Every other Postgres URL, including localhost, uses node-postgres.
export const db = createDb(DATABASE_URL)
