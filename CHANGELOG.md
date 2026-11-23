# Changelog

**M#** = engineering milestone ([`docs/roadmap.md`](docs/roadmap.md), [`docs/engineering.md`](docs/engineering.md)).

## Shipped

### M1 — Local setup without Bun or Docker

- pnpm install is the CI install, and npm install succeeds
- Default local connection is `pg` to localhost; Neon serverless stays for Neon hosts and the optional proxy
- Lint, typecheck, build, and unit tests pass with no Docker, no Mailpit, no Bun, and no browser
- README describes that path, and Compose is labeled optional
