# AGENTS.md - BugSnap MCP Server Rules

> Quick reference for AI agents working on `bugsnap-mcp`.

1. **Repository**: Standalone GitHub repository `akusaradigital/bugsnap-mcp` (stdio transport).
2. **Build Gate**: `npm run build` (`tsc`) must exit with code 0.
3. **Push Policy**: When the user instructs `git push` to `main`, `bugsnap-mcp` is pushed together with `bugsnap-dashboard` and `bugsnap-extension` to `origin main`. Run `npm run build` (`tsc`) so `dist/` is compiled and tracked before pushing.
4. **Auth & Security**: Read-scoped user API key only (`BUGSNAP_API_KEY`). Never hardcode or bundle private credentials.
5. **Tool Surface**: Read-only tools (`bugsnap_list_captures`, `bugsnap_get_capture`), resources (`bugsnap://...`), and prompts.
