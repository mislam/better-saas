import { describe, expect, it } from "vitest"

import { planDelivery, selectTransport } from "./transport.ts"

describe("selectTransport", () => {
	it("uses Resend when an API key is set", () => {
		expect(selectTransport({ resendApiKey: "re_test", smtpHost: "localhost" })).toBe("resend")
	})

	it("uses SMTP when only a host is set", () => {
		expect(selectTransport({ smtpHost: "localhost" })).toBe("smtp")
	})

	it("throws when neither transport is configured", () => {
		expect(() => selectTransport({})).toThrow(
			"Email transport is not configured (set RESEND_API_KEY or SMTP_HOST)",
		)
	})
})

describe("planDelivery", () => {
	it("sends when a transport is configured", () => {
		expect(planDelivery({ smtpHost: "localhost" }, "http://localhost:5173/verify")).toEqual({
			kind: "send",
			transport: "smtp",
		})
	})

	it("returns the link when mail is not configured", () => {
		const text = "Confirm this address.\n\nhttp://localhost:5173/api/auth/verify-email?token=abc\n"
		expect(planDelivery({}, text)).toEqual({
			kind: "log",
			link: "http://localhost:5173/api/auth/verify-email?token=abc",
		})
	})

	it("returns no link when the message has none", () => {
		expect(planDelivery({}, "Someone tried to create an account.")).toEqual({ kind: "log" })
	})
})
