import { describe, expect, it } from "vitest"

import { databaseHint, describeError } from "./describe-error.ts"

describe("describeError", () => {
	it("uses nested connection errors when the outer message is empty", () => {
		const error = new AggregateError(
			[Object.assign(new Error("connect ECONNREFUSED 127.0.0.1:5432"), { code: "ECONNREFUSED" })],
			"",
		)
		expect(describeError(error)).toBe("connect ECONNREFUSED 127.0.0.1:5432")
		expect(databaseHint(error)).toMatch(/Postgres must be running/)
	})

	it("drops the query text and reports a missing user", () => {
		const error = new Error('Failed query: select "email" from "user"\nparams: test@test.com', {
			cause: new Error('role "postgres" does not exist'),
		})
		expect(describeError(error)).toBe('role "postgres" does not exist')
		expect(databaseHint(error)).toMatch(/user in DATABASE_URL/)
	})

	it("calls a missing table a table and points at db:push", () => {
		const error = new Error('Failed query: select "email" from "user"\nparams: test@test.com', {
			cause: new Error('relation "user" does not exist'),
		})
		expect(describeError(error)).toBe('table "user" does not exist')
		expect(databaseHint(error)).toMatch(/pnpm db:push/)
	})

	it("leaves other failures without a database hint", () => {
		expect(databaseHint(new Error("Failed to create user"))).toBeUndefined()
	})
})
