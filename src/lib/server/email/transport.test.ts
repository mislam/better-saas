import { describe, expect, it } from "vitest"

import { selectTransport } from "./transport.ts"

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
