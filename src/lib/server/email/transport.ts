export type EmailTransport = "resend" | "smtp"

export type EmailTransportEnv = {
	resendApiKey?: string
	smtpHost?: string
}

export function selectTransport(env: EmailTransportEnv): EmailTransport {
	if (env.resendApiKey) return "resend"
	if (env.smtpHost) return "smtp"
	throw new Error("Email transport is not configured (set RESEND_API_KEY or SMTP_HOST)")
}
