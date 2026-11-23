import { neonConfig } from "@neondatabase/serverless"
import ws from "ws"

import { LOCAL_DB_HOST } from "./driver.ts"

export function configureNeon(connectionString: string): void {
	const url = new URL(connectionString.replace(/^postgresql:/, "postgres:"))

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
