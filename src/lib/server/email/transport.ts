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

export type DeliveryPlan =
	{ kind: "send"; transport: EmailTransport } | { kind: "log"; link?: string }

const messageLink = /https?:\/\/\S+/

/** Send when a transport is set. Otherwise keep the link for the server log. */
export function planDelivery(env: EmailTransportEnv, text: string): DeliveryPlan {
	try {
		return { kind: "send", transport: selectTransport(env) }
	} catch {
		return { kind: "log", link: text.match(messageLink)?.[0] }
	}
}
