# AGENTS.md - BugSnap MCP Server Rules

> Quick reference for AI agents working on `bugsnap-mcp`.

1. **Package**: npm package `bugsnap-mcp` (stdio transport).
2. **Build Gate**: `npm run build` (`tsc`) must exit with code 0.
3. **Publish & Push**: Whenever changes or fixes are made to `bugsnap-mcp/`, run `npm run build` (`tsc`), bump version in `package.json`, publish to npm (`npm publish --access public`), and `git push` immediately.
4. **Auth & Security**: Read-scoped user API key only (`BUGSNAP_API_KEY`). Never hardcode or bundle private credentials.
5. **Tool Surface**: Read-only tools for capture data (`bugsnap_list_captures`, `bugsnap_get_capture`).
