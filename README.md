# README

SvelteKit app with TypeScript, Tailwind, Drizzle (Neon), Better Auth, and the Vercel adapter. Package manager: **Bun**.

## Requirements

- [Bun](https://bun.sh) 1.4+ (see `packageManager` in `package.json`)

## Setup

```sh
bun install
cp .env.example .env
bunx playwright install chromium
```

The Playwright step downloads Chromium once for Vitest’s browser project (component tests).

Edit `.env` with `DATABASE_URL`, `ORIGIN`, and `BETTER_AUTH_SECRET`.

## Git hooks

[Husky](https://github.com/typicode/husky):

- **pre-commit:** `lint-staged`, then `bun check`
- **pre-push:** `lint` → `check` → `build` → `test` (see [`.husky/pre-push`](.husky/pre-push))
- **commit-msg:** `commitlint` (conventional commits)

## CI

[GitHub Actions](https://github.com/features/actions):

- **workflow:** `bun install --frozen-lockfile` → `lint` → `check` → `build` → Playwright → `test` (see [`.github/workflows/ci.yml`](.github/workflows/ci.yml))

## Commands

| Task                     | Command          |
| ------------------------ | ---------------- |
| Dev server               | `bun dev`        |
| Dev + open browser       | `bun dev --open` |
| Production build         | `bun run build`  |
| Preview production build | `bun preview`    |
| Typecheck                | `bun check`      |
| Lint                     | `bun lint`       |
| Lint + format (fix)      | `bun lint:fix`   |
| Tests                    | `bun run test`   |
| Drizzle push             | `bun db:push`    |

## Scaffold reference

This matches how this repo was generated (see `bunx sv create --help` for add-on syntax).

```sh
bunx sv@1.3.0 create --template minimal --types ts \
  --add prettier eslint \
    'vitest="usages:unit,component"' tailwindcss="plugins:none" \
    sveltekit-adapter="adapter:vercel" \
    drizzle="database:postgresql+client:neon" \
    better-auth="demo:password" \
    'ai-tools="ide:cursor+tools:mcp,svelte-code-writer,svelte-core-bestpractices,svelte-file-editor+mcpSetup:remote+optInSkills:none"' \
  --install bun .
```

More: [`sv` CLI](https://github.com/sveltejs/cli) (`bunx sv add …`).
