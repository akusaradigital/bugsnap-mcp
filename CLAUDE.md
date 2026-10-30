# CLAUDE.md - BugSnap MCP Server

> Rules for Claude Code and AI agents on `bugsnap-mcp` (npm package: `bugsnap-mcp`).

## 1. Core Rules

- **Package**: Published to npm registry as `bugsnap-mcp` (`@modelcontextprotocol/sdk`, stdio transport).
- **Publish & Git Push Policy**: Whenever changes or fixes are made to `bugsnap-mcp/`, run `npm run build` (`tsc`), bump version in `package.json`, publish to npm (`npm publish --access public`), and `git push` immediately per user instruction.
- **Build Gate**: `npm run build` (`tsc`) must exit 0 before considering any change done.
- **Auth**: Server is a thin client against the BugSnap API (`https://bugsnap.akusaraproject.my.id`) using a read-scoped user API key (`BUGSNAP_API_KEY=bugsnap_...`). Never use service role keys or bundle secrets.
- **Tool Surface**: Expose only read/query tools (`bugsnap_list_captures`, `bugsnap_get_capture`). Never add tools that delete, mutate workspace state, or touch billing.
- **No dependencies bloat**: Keep dependencies minimal (`@modelcontextprotocol/sdk`, `zod`).
