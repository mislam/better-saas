# Agent instructions

Humans: [`README.md`](README.md) (setup, commands, hooks, CI). This file is for **Cursor / coding agents** only.

What this repo is: [`README.md`](README.md). Follow that. Keep work scoped to [**Now**](docs/roadmap.md#now) unless the user asks for more.

## Working context

- **Active work:** [`docs/roadmap.md#now`](docs/roadmap.md#now) — one milestone at a time unless the user asks otherwise
- **Upcoming / Later:** [`docs/roadmap.md`](docs/roadmap.md)
- **Shipped milestones:** [`CHANGELOG.md`](CHANGELOG.md)
- **Stack, layout, database:** [`docs/engineering.md`](docs/engineering.md)
- **File and folder names:** lowercase; kebab-case for multi-word paths — [`.cursor/rules/conventions.mdc`](.cursor/rules/conventions.mdc) ([Paths and file names](.cursor/rules/conventions.mdc#paths-and-file-names))

## Agent policy

- **Git:** **read-only always** for agents — no `git add`, `git restore`, `git commit`, etc. unless the user explicitly requests that command in the current message. Staging is manual. Details: [`.cursor/rules/conventions.mdc`](.cursor/rules/conventions.mdc)
- **Secrets:** never read `.env` unless asked; prefer `.env.example`
- **Tests:** `pnpm test` (Vitest, Node). It does not need Postgres, Mailpit, or a browser
- **Blocking gates:** pre-commit (`lint-staged` + `pnpm check`), pre-push (`pnpm lint`, `pnpm check`, `pnpm run build`, `pnpm test`), commitlint, CI `lint` + `check` + `build` + `test` — [README](README.md) ([Commands](README.md#commands), [Git hooks](README.md#git-hooks), [CI](README.md#ci))

`pnpm check` is typecheck only. Lint and format are `pnpm lint` / `pnpm lint:fix`. Hooks and CI call pnpm.

## Reviews (advisory — not a git hook)

| Trigger                | Rule                                                                 |
| ---------------------- | -------------------------------------------------------------------- |
| **Review staged**      | [`.cursor/rules/review-staged.mdc`](.cursor/rules/review-staged.mdc) |
| **Review branch** / PR | [`.cursor/rules/review-pr.mdc`](.cursor/rules/review-pr.mdc)         |
| **Ship milestone**     | [`.cursor/rules/changelog.mdc`](.cursor/rules/changelog.mdc)         |

Natural language is enough. A fully checked [**Now**](docs/roadmap.md#now) ships via [`.cursor/rules/changelog.mdc`](.cursor/rules/changelog.mdc) in the same turn.

## Svelte

### Svelte MCP

Config: [`.cursor/mcp.json`](.cursor/mcp.json).

When editing Svelte or SvelteKit:

1. **list-sections** — discover docs (use first).
2. **get-documentation** — fetch relevant sections.
3. **svelte-autofixer** — run on Svelte before finishing; repeat until clean.
4. **playground-link** — only after the user confirms; never for code committed to this repo.

Skills: [`.cursor/skills/`](.cursor/skills/) (`svelte-core-bestpractices`, `svelte-code-writer`). Prefer the **svelte-file-editor** subagent for component work when available.
