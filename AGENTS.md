# AGENTS.md - BugSnap MCP Server Rules

> Quick reference for AI agents working on `bugsnap-mcp`.

1. **Repository**: Standalone GitHub repository `akusaradigital/bugsnap-mcp` (stdio transport).
2. **Build Gate**: `npm run build` (`tsc`) must exit with code 0.
3. **Push Policy**: Run `npm run build` (`tsc`) before pushing to GitHub per user instruction.
4. **Auth & Security**: Read-scoped user API key only (`BUGSNAP_API_KEY`). Never hardcode or bundle private credentials.
5. **Tool Surface**: Read-only tools (`bugsnap_list_captures`, `bugsnap_get_capture`), resources (`bugsnap://...`), and prompts.
