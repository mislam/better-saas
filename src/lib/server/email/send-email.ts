import { waitUntil } from "@vercel/functions"
import nodemailer from "nodemailer"
import { Resend } from "resend"

import { EMAIL_FROM, RESEND_API_KEY, SMTP_HOST, SMTP_PORT } from "$app/env/private"

import { planDelivery } from "./transport.ts"

export type SendEmailParams = {
	to: string
	subject: string
	html: string
	text: string
}

const DEFAULT_SMTP_PORT = 1025

function logUnconfigured(link: string | undefined): void {
	console.info(
		link
			? `Email transport is not configured. Open this link:\n${link}`
			: "Email transport is not configured (set RESEND_API_KEY or SMTP_HOST).",
	)
}

async function deliver(params: SendEmailParams): Promise<void> {
	const resendApiKey = RESEND_API_KEY
	const smtpHost = SMTP_HOST
	const plan = planDelivery({ resendApiKey, smtpHost }, params.text)
	if (plan.kind === "log") {
		logUnconfigured(plan.link)
		return
	}
	const transport = plan.transport

	if (transport === "resend") {
		if (!resendApiKey) throw new Error("RESEND_API_KEY is not set")
		const resend = new Resend(resendApiKey)
		const { error } = await resend.emails.send({
			from: EMAIL_FROM,
			to: params.to,
			subject: params.subject,
			html: params.html,
			text: params.text,
		})
		if (error) throw new Error(error.message)
		return
	}

	if (!smtpHost) throw new Error("SMTP_HOST is not set")
	const port = SMTP_PORT ?? DEFAULT_SMTP_PORT
	const smtp = nodemailer.createTransport({
		host: smtpHost,
		port,
		secure: port === 465,
	})
	await smtp.sendMail({
		from: EMAIL_FROM,
		to: params.to,
		subject: params.subject,
		html: params.html,
		text: params.text,
	})
}

export function sendEmail(params: SendEmailParams): void {
	const pending = deliver(params).catch((error: unknown) => {
		console.error("Failed to send email", error)
	})
	try {
		waitUntil(pending)
	} catch {
		// Vite dev has no Vercel request context. Node still finishes the send.
	}
}
