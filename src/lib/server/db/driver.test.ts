import { describe, expect, it } from "vitest"

import { usesNeonServerless } from "./driver.ts"

describe("usesNeonServerless", () => {
	it("uses node-postgres for localhost", () => {
		expect(usesNeonServerless("postgresql://postgres:postgres@localhost:5432/main")).toBe(false)
	})

	it("uses node-postgres for 127.0.0.1", () => {
		expect(usesNeonServerless("postgresql://postgres:postgres@127.0.0.1:5432/main")).toBe(false)
	})

	it("uses the Neon driver for a Neon host", () => {
		expect(
			usesNeonServerless("postgresql://user:pass@ep-example.us-east-1.aws.neon.tech/main"),
		).toBe(true)
	})

	it("uses the Neon driver for the optional local proxy", () => {
		expect(usesNeonServerless("postgresql://postgres:postgres@db.localtest.me:5432/main")).toBe(
			true,
		)
	})
})
