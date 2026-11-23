/** Hostname for local dev via the Neon proxy. Resolves to 127.0.0.1 through localtest.me. */
export const LOCAL_DB_HOST = "db.localtest.me"

/** Neon production hosts and the optional local proxy keep the serverless driver. */
export function usesNeonServerless(connectionString: string): boolean {
	const url = new URL(connectionString.replace(/^postgresql:/, "postgres:"))
	return url.hostname === LOCAL_DB_HOST || url.hostname.endsWith(".neon.tech")
}
