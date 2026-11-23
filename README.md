# Better SaaS

SvelteKit app with TypeScript, Tailwind, Drizzle, Better Auth, and the Vercel adapter. Local development uses node-postgres against Postgres 16 or newer. A Neon host, and the optional local Neon proxy, keep the Neon serverless driver. Outbound mail goes through [Resend](https://resend.com/) in production. [Mailpit](https://mailpit.axllent.org/) is an optional local inbox.

Tooling is pnpm with lint, format, hooks, and CI. `npm install` also works. Bun is not required.

## Docs

| Doc                                          | Use                                                        |
| -------------------------------------------- | ---------------------------------------------------------- |
| [`docs/engineering.md`](docs/engineering.md) | Stack, layout, database contract                           |
| [`docs/roadmap.md`](docs/roadmap.md)         | Active [Now](docs/roadmap.md#now), **Upcoming**, **Later** |
| [`CHANGELOG.md`](CHANGELOG.md)               | Shipped milestones                                         |
| [`AGENTS.md`](AGENTS.md)                     | Cursor / coding agent instructions                         |

## Requirements

- [Node.js](https://nodejs.org/) 22+
- [pnpm](https://pnpm.io/) 10 (npm 10 also installs)
- PostgreSQL 16+ for local development, or any hosted Postgres URL

## Setup

```sh
pnpm install
cp .env.example .env
pnpm auth:secret --write
```

`pnpm dev` starts the Vite dev server. `pnpm db:push` needs a Postgres server that is already accepting `DATABASE_URL`. The example URL is user `postgres`, password `postgres`, database `main`, on `localhost:5432`. Create that database first. Optional Compose (`pnpm dev:up`) starts a server with those values. A Postgres you run yourself has to match the URL, or change the URL to match the server. If the connection fails, `pnpm db:push` prints the database error.

`npm install` completes as well. CI and the lockfile use pnpm, so commit, push, and GitHub Actions need pnpm on the machine.

## Auth

Sign in at `/login`. A signed-in account is at `/account`. Sign-up does not create a session — open the verification link, then sign in. Password reset follows the same pattern (request a link, then set a new password on the reset page). Social providers are configured separately in [`src/lib/server/auth.ts`](src/lib/server/auth.ts). Details: [`docs/engineering.md` — Auth](docs/engineering.md#auth).

## Email

Leave `RESEND_API_KEY` and `SMTP_HOST` empty when you are not sending mail. Sign-up and password reset still require the link. With neither value set, that link is printed in the dev server log.

Production sends through Resend. Set `RESEND_API_KEY` and an `EMAIL_FROM` address on a domain verified in Resend. Leave `SMTP_HOST` unset there. If both are set, Resend is used.

Mailpit is an optional Compose service for reading local mail. It is not part of install or the test run. If you start it, set `SMTP_HOST=localhost` and `SMTP_PORT=1025`. The web UI is [http://localhost:8025](http://localhost:8025). Those ports are also used by other local projects. Names and comments: [`.env.example`](.env.example).

## Database

How the app and Drizzle Kit connect: [`docs/engineering.md` — Database](docs/engineering.md#database).

The default `DATABASE_URL` is `localhost`. Postgres 16 or newer is enough, and it has to be running before `pnpm db:push`. Create the database named in that URL first.

A host ending in `.neon.tech` uses the Neon serverless driver, including a Neon connection string in production. The optional Compose stack (Postgres, the Neon proxy, and Mailpit) uses `db.localtest.me` for that same driver locally. Setup does not require Compose.

```sh
pnpm db:push       # apply schema
pnpm db:generate   # generate migrations
pnpm db:migrate    # run migrations
pnpm db:studio     # Drizzle Studio
pnpm auth:schema   # after changing `src/lib/server/auth.ts`; then `db:push` again
```

## Optional Compose

[`compose.yaml`](compose.yaml) can start Postgres, the Neon proxy, and Mailpit for anyone who wants them. The required setup never runs it.

```sh
pnpm dev:up     # start the optional containers
pnpm dev:down   # stop them
```

For the Neon driver locally, point `DATABASE_URL` at `db.localtest.me` as commented in [`.env.example`](.env.example). If that name does not resolve, add `127.0.0.1 db.localtest.me` to your hosts file.

## Commands

| Task                      | Command            |
| ------------------------- | ------------------ |
| Dev server                | `pnpm dev`         |
| Dev + open browser        | `pnpm dev --open`  |
| Production build          | `pnpm run build`   |
| Preview production build  | `pnpm preview`     |
| Typecheck                 | `pnpm check`       |
| Lint + format check       | `pnpm lint`        |
| Lint + format (fix)       | `pnpm lint:fix`    |
| Format                    | `pnpm run format`  |
| Tests (Vitest)            | `pnpm test`        |
| Apply schema              | `pnpm db:push`     |
| Regenerate auth schema    | `pnpm auth:schema` |
| Start optional containers | `pnpm dev:up`      |
| Stop optional containers  | `pnpm dev:down`    |

`pnpm check` is typecheck only (`svelte-check`). `pnpm test` runs Vitest in Node. It does not need Postgres, Mailpit, or a browser.

## Git hooks

[Husky](https://github.com/typicode/husky) installs from the `prepare` script. Hooks call pnpm:

- **pre-commit:** `lint-staged`, then `pnpm check` ([`.husky/pre-commit`](.husky/pre-commit))
- **pre-push:** `pnpm lint`, `pnpm check`, `pnpm run build`, `pnpm test` ([`.husky/pre-push`](.husky/pre-push))
- **commit-msg:** `commitlint` (Conventional Commits) ([`.husky/commit-msg`](.husky/commit-msg))

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs `pnpm lint`, `pnpm check`, `pnpm run build`, and `pnpm test` on push to `main` and on pull requests.

## AI-assisted development

Advisory reviews in Cursor only — say **review staged** or **review branch** (see [`.cursor/rules/`](.cursor/rules/)). Hooks and CI remain the blocking gates. Details: [`AGENTS.md`](AGENTS.md).
