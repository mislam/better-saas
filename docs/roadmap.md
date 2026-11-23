# Roadmap

> **M#** = engineering milestone. Shipped: [`CHANGELOG.md`](../CHANGELOG.md). Stack, layout, and database: [`engineering.md`](engineering.md).

**Tracking:** Open work lives in **Now** / **Upcoming** / **Later** below; **Shipped** lives in [`CHANGELOG.md`](../CHANGELOG.md) only. Other docs must not name the active milestone — link here or to the changelog instead.

One milestone per PR; do not ship work past **Now** while that milestone is open.

## Now

### Local setup without Bun or Docker

- [ ] pnpm install is the CI install, and npm install succeeds
- [ ] Default local connection is `pg` to localhost; Neon serverless stays for Neon hosts and the optional proxy
- [ ] Lint, typecheck, build, and unit tests pass with no Docker, no Mailpit, no Bun, and no browser
- [ ] README describes that path, and Compose is labeled optional

## Upcoming

1. An account can create an organization and see its members.
2. An organization owner can invite a member by email, using the existing mail sender.
3. A signed-in home replaces the auth demo as the place daily work happens.

## Later

_(none)_
