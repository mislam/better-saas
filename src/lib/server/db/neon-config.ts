import { neonConfig } from "@neondatabase/serverless"
import ws from "ws"

/** Hostname for local dev via Neon HTTP proxy — resolves to 127.0.0.1 via localtest.me */
export const LOCAL_DB_HOST = "db.localtest.me"

export function configureNeon(connectionString: string): void {
	const url = new URL(connectionString.replace(/^postgresql:/, "postgres:"))

	if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
		throw new Error(
			`DATABASE_URL must use ${LOCAL_DB_HOST} for local dev (Neon proxy). See README.`,
		)
	}

	if (url.hostname === LOCAL_DB_HOST) {
		neonConfig.fetchEndpoint = (host) => {
			const [protocol, port] = host === LOCAL_DB_HOST ? ["http", 4444] : ["https", 443]
			return `${protocol}://${host}:${port}/sql`
		}
		neonConfig.useSecureWebSocket = url.hostname !== LOCAL_DB_HOST
		neonConfig.wsProxy = (host) => (host === LOCAL_DB_HOST ? `${host}:4444/v2` : `${host}/v2`)
	}

	neonConfig.webSocketConstructor = ws
}
