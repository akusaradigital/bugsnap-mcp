# AGENTS.md - BugSnap MCP Server (non-Claude engines)

> `CLAUDE.md` (same directory) and `../CLAUDE.md` are canonical. This is a short pointer for engines that don't read those files.

1. Standalone repo `akusaradigital/bugsnap-mcp` (stdio transport). Push/release policy, Graphify: see `../CLAUDE.md`.
2. Gate: `npm run build` (tsc) must exit 0 - no test suite yet.
3. Auth: read-scoped `BUGSNAP_API_KEY` only. Tool surface is read/query only - never delete, mutate, or touch billing.

Brand/logo rules: `../BRAND.md`.
