import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"

import { DATABASE_URL } from "$app/env/private"

import { configureNeon } from "./neon-config"
import * as schema from "./schema"

if (!DATABASE_URL) throw new Error("DATABASE_URL is not set")

configureNeon(DATABASE_URL)

// Same Neon serverless stack in dev (Docker proxy) and production; Pool enables db.transaction().
const pool = new Pool({ connectionString: DATABASE_URL })

export const db = drizzle(pool, { schema })
