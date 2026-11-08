export type EmailMessage = {
	subject: string
	text: string
	html: string
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
}

function linkMessage(subject: string, intro: string, url: string): EmailMessage {
	return {
		subject,
		text: `${intro}\n\n${url}\n`,
		html: `<p>${escapeHtml(intro)}</p><p><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></p>`,
	}
}

export function verificationEmail(url: string): EmailMessage {
	return linkMessage(
		"Verify your email",
		"Confirm this address to finish creating your account.",
		url,
	)
}

export function resetPasswordEmail(url: string): EmailMessage {
	return linkMessage(
		"Reset your password",
		"Use this link to choose a new password. If you did not ask for a reset, you can ignore this email.",
		url,
	)
}

export function existingAccountEmail(): EmailMessage {
	const text =
		"Someone tried to create an account with this email. If that was you, sign in instead. If not, you can ignore this email."
	return {
		subject: "Sign-up attempt",
		text: `${text}\n`,
		html: `<p>${text}</p>`,
	}
}
