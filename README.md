# SvelteKit SaaS starter

SvelteKit app with TypeScript, Tailwind, Drizzle (Neon), Better Auth, and the Vercel adapter. Local Postgres runs in Docker behind the Neon proxy, so dev uses the same driver as production.

Tooling is Bun-first with lint, format, hooks, and CI.

## Docs

| Doc                                          | Use                                                        |
| -------------------------------------------- | ---------------------------------------------------------- |
| [`docs/engineering.md`](docs/engineering.md) | Stack, layout, database contract                           |
| [`docs/roadmap.md`](docs/roadmap.md)         | Active [Now](docs/roadmap.md#now), **Upcoming**, **Later** |
| [`CHANGELOG.md`](CHANGELOG.md)               | Shipped milestones                                         |
| [`AGENTS.md`](AGENTS.md)                     | Cursor / coding agent instructions                         |

## Requirements

- [Bun](https://bun.sh) 1.4+ (see `packageManager` in [`package.json`](package.json))
- [Docker](https://www.docker.com/) for local Postgres and the Neon proxy

## Setup

```sh
bun install
cp .env.example .env
bun auth:secret --write
bunx playwright install chromium
bun dev:up
bun db:push
```

`bun dev` starts the Vite dev server. `bun dev:up` starts Postgres and the Neon proxy; `bun dev:down` stops them.

## Database

How the app and Drizzle Kit connect: [`docs/engineering.md` — Database](docs/engineering.md#database).

Local `DATABASE_URL` must use host `db.localtest.me` (see [`.env.example`](.env.example)). If you work offline or wildcard `*.localtest.me` does not resolve, add:

```
127.0.0.1 db.localtest.me
```

```sh
bun db:push       # apply schema
bun db:generate   # generate migrations
bun db:migrate    # run migrations
bun db:studio     # Drizzle Studio (uses devDependency `pg`, not the proxy)
bun auth:schema   # after changing `src/lib/server/auth.ts`; then `db:push` again
```

## Commands

| Task                     | Command           |
| ------------------------ | ----------------- |
| Dev server               | `bun dev`         |
| Dev + open browser       | `bun dev --open`  |
| Production build         | `bun run build`   |
| Preview production build | `bun preview`     |
| Typecheck                | `bun check`       |
| Lint + format check      | `bun lint`        |
| Lint + format (fix)      | `bun lint:fix`    |
| Format                   | `bun run format`  |
| Tests (Vitest)           | `bun run test`    |
| Apply schema             | `bun db:push`     |
| Regenerate auth schema   | `bun auth:schema` |
| Local DB (Docker)        | `bun dev:up`      |
| Stop local DB            | `bun dev:down`    |

`bun check` is typecheck only (`svelte-check`). Use `bun run test` — `bun test` is Bun’s runner, not Vitest.

## Git hooks

[Husky](https://github.com/typicode/husky):

- **pre-commit:** `lint-staged`, then `bun check` ([`.husky/pre-commit`](.husky/pre-commit))
- **pre-push:** `bun lint`, `bun check`, `bun run build`, `bun run test` ([`.husky/pre-push`](.husky/pre-push))
- **commit-msg:** `commitlint` (Conventional Commits) ([`.husky/commit-msg`](.husky/commit-msg))

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs `bun lint`, `bun check`, `bun run build`, and `bun run test` on push to `main` and on pull requests. CI installs Playwright Chromium before the tests.

## AI-assisted development

Advisory reviews in Cursor only — say **review staged** or **review branch** (see [`.cursor/rules/`](.cursor/rules/)). Hooks and CI remain the blocking gates. Details: [`AGENTS.md`](AGENTS.md).

## Scaffold

Generated with the Svelte CLI (`sv`). Add-ons and flags: `bunx sv create --help`, or `bunx sv add …` ([CLI](https://github.com/sveltejs/cli)).
