# CLAUDE.md - BugSnap MCP Server

> Rules for Claude Code and AI agents on `bugsnap-mcp` (GitHub: `akusaradigital/bugsnap-mcp`).

## 1. Core Rules

- **Repository**: Standalone GitHub repository at `https://github.com/akusaradigital/bugsnap-mcp` (`@modelcontextprotocol/sdk`, stdio transport).
- **Push Policy**: Push only when the user explicitly instructs `git push`. Run `npm run build` (`tsc`) before pushing.
- **Build Gate**: `npm run build` (`tsc`) must exit 0 before considering any change done.
- **Auth**: Server is a thin client against the BugSnap API (`https://bugsnap.akusaraproject.my.id`) using a read-scoped user API key (`BUGSNAP_API_KEY=bugsnap_...`). Never use service role keys or bundle secrets.
- **Tool Surface**: Expose only read/query tools (`bugsnap_list_captures`, `bugsnap_get_capture`), resources (`bugsnap://...`), and prompts (`bugsnap_fix_bug`, `bugsnap_triage_open_bugs`). Never add tools that delete, mutate workspace state, or touch billing.
- **No dependencies bloat**: Keep dependencies minimal (`@modelcontextprotocol/sdk`, `zod`).
