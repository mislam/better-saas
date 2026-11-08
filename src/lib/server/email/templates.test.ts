import { describe, expect, it } from "vitest"

import { existingAccountEmail, resetPasswordEmail, verificationEmail } from "./templates.ts"

const url = `https://app.example/verify?token=a&b=1`

describe("email templates", () => {
	it("puts the verification link in text and escaped html", () => {
		const message = verificationEmail(url)
		expect(message.subject).toBe("Verify your email")
		expect(message.text).toContain(url)
		expect(message.html).toContain("https://app.example/verify?token=a&amp;b=1")
		expect(message.html).not.toContain("token=a&b=1")
	})

	it("puts the reset link in text and html", () => {
		const message = resetPasswordEmail("https://app.example/reset")
		expect(message.subject).toBe("Reset your password")
		expect(message.text).toContain("https://app.example/reset")
		expect(message.html).toContain('href="https://app.example/reset"')
	})

	it("warns the existing account without a link", () => {
		const message = existingAccountEmail()
		expect(message.subject).toBe("Sign-up attempt")
		expect(message.text).toContain("sign in instead")
		expect(message.html).not.toContain("href=")
	})
})
