# CLAUDE.md - BugSnap MCP Server

> Rules for Claude Code and AI agents on `bugsnap-mcp` (GitHub: `akusaradigital/bugsnap-mcp`).
> Cross-repo rules (push/release, Graphify, verification gates, brand) live in `../CLAUDE.md` and `../BRAND.md`.

## Core Rules

- **Repository**: standalone GitHub repo at `https://github.com/akusaradigital/bugsnap-mcp` (`@modelcontextprotocol/sdk`, stdio transport).
- **Push policy, Graphify, verification gate, subagent delegation**: see `../CLAUDE.md` §1-4. This repo's gate: `npm run build` (tsc) must exit 0 - no test suite yet, say so explicitly rather than implying one passed.
- **Auth**: thin client against `https://bugsnap.akusaraproject.my.id` using a read-scoped `BUGSNAP_API_KEY=bugsnap_...` - never service-role keys or bundled secrets.
- **Tool surface**: read/query only - `bugsnap_list_captures`, `bugsnap_get_capture`, `bugsnap://...` resources, `bugsnap_fix_bug`/`bugsnap_triage_open_bugs` prompts. Never add delete, mutation, billing, or credential-management tools.
- **No dependency bloat**: keep dependencies minimal (`@modelcontextprotocol/sdk`, `zod`).
- **Focused validation**: `npm run build` + the smallest relevant tool/resource/prompt check for routine changes; full validation for release/commit work.
