import { waitUntil } from "@vercel/functions"
import nodemailer from "nodemailer"
import { Resend } from "resend"

import { EMAIL_FROM, RESEND_API_KEY, SMTP_HOST, SMTP_PORT } from "$app/env/private"

import { selectTransport } from "./transport.ts"

export type SendEmailParams = {
	to: string
	subject: string
	html: string
	text: string
}

const DEFAULT_SMTP_PORT = 1025

async function deliver(params: SendEmailParams): Promise<void> {
	const resendApiKey = RESEND_API_KEY
	const smtpHost = SMTP_HOST
	const transport = selectTransport({ resendApiKey, smtpHost })

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
