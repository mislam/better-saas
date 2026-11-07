#!/usr/bin/env bun
/**
 * Generates a Better Auth secret (64 base62 chars: 0-9, a-z, A-Z — no + / =).
 *
 * `bun auth:secret` — print to stdout.
 * `bun auth:secret --write` — set `BETTER_AUTH_SECRET` in `.env` when empty.
 */
import { randomBytes } from "node:crypto"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

/** 64 base62 chars; plenty of entropy for Better Auth (≥32 chars required). */
function generateBase62Secret(length = 64): string {
	const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	let secret = ""
	const bytes = randomBytes(length)
	for (let i = 0; i < length; i++) {
		secret += chars[bytes[i]! % 62]!
	}
	return secret
}

const shouldWrite = process.argv.includes("--write")
const envPath = join(process.cwd(), ".env")

if (!shouldWrite) {
	console.log(generateBase62Secret())
	process.exit(0)
}

if (!existsSync(envPath)) {
	console.error("No .env found. Run: cp .env.example .env")
	process.exit(1)
}

let content = readFileSync(envPath, "utf8")
const current = content.match(/^BETTER_AUTH_SECRET=(.*)$/m)?.[1]?.replace(/^["']|["']$/g, "") ?? ""

if (current) {
	console.log("BETTER_AUTH_SECRET already set.")
	process.exit(0)
}

const secret = generateBase62Secret()
const line = /^BETTER_AUTH_SECRET=.*$/m
content = line.test(content)
	? content.replace(line, `BETTER_AUTH_SECRET=${secret}`)
	: `${content.trimEnd()}\nBETTER_AUTH_SECRET=${secret}\n`

writeFileSync(envPath, content, "utf8")
console.log("Updated BETTER_AUTH_SECRET in .env (64 base62 chars).")
console.log(`Starts with: ${secret.slice(0, 10)}…`)
