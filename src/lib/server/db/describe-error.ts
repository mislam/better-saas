/** Flattens AggregateError and cause chains. Query text and connection strings are omitted. */
export function describeError(error: unknown): string {
	const seen = new Set<unknown>()

	const visit = (value: unknown): string[] => {
		if (value == null || seen.has(value)) return []
		seen.add(value)
		if (value instanceof AggregateError) {
			const nested = value.errors.flatMap((item) => visit(item))
			if (nested.length > 0) return nested
			return value.message ? [value.message] : []
		}
		if (value instanceof Error) {
			const nested = visit(value.cause)
			if (value.message.startsWith("Failed query:") && nested.length > 0) return nested
			return value.message ? [value.message, ...nested] : nested
		}
		if (typeof value === "object" && "code" in value && typeof value.code === "string") {
			return [value.code]
		}
		return [String(value)]
	}

	return visit(error)
		.filter(Boolean)
		.join("\n")
		.replaceAll(/relation ("[^"]+") does not exist/gi, "table $1 does not exist")
}

const connectionFailure =
	/ECONNREFUSED|ENOTFOUND|EAI_AGAIN|ECONNRESET|ETIMEDOUT|password authentication failed|database ".+" does not exist|Connection terminated|connect ECONN/i

/** Hint for a Postgres connection or user failure. Undefined for other errors. */
export function databaseHint(error: unknown): string | undefined {
	const message = describeError(error)
	if (/role ".+" does not exist/i.test(message)) {
		return "The user in DATABASE_URL does not exist on this Postgres server. Use a user this server already has."
	}
	if (/table "[^"]+" does not exist/i.test(message)) {
		return "The database has no tables yet. Run `pnpm db:push`."
	}
	if (connectionFailure.test(message)) {
		return "Postgres must be running, and the database named in DATABASE_URL must already exist."
	}
	return undefined
}
