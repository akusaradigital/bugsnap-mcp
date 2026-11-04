# CLAUDE.md - BugSnap MCP Server

> Rules for Claude Code and AI agents on `bugsnap-mcp` (GitHub: `akusaradigital/bugsnap-mcp`).

## 1. Core Rules

- **Repository**: Standalone GitHub repository at `https://github.com/akusaradigital/bugsnap-mcp` (`@modelcontextprotocol/sdk`, stdio transport).
- **Push Policy**: Push only when the user explicitly instructs `git push`. When the user instructs `git push` to `main` (or "push ke main"), `bugsnap-mcp` is pushed together with `bugsnap-dashboard` and `bugsnap-extension` to `origin main`. Run `npm run build` (`tsc`) so `dist/` is compiled and tracked before pushing.
- **Changelog Generation on Release (MANDATORY on git push to main)**: Whenever the user explicitly instructs `git push` to `main`, ALWAYS generate and update release entries in `CHANGELOG.md` across all 3 projects (`[bugsnap-dashboard]`, `[bugsnap-extension]`, `[bugsnap-mcp]`) documenting changes with date (`### YYYY-MM-DD (vX.Y.Z)`) and tags (`feat`, `fix`, `perf`, `docs`, `chore`). This feeds the Super Admin Changelog viewer.
- **Build Gate**: `npm run build` (`tsc`) must exit 0 before considering any change done.
- **Auth**: Server is a thin client against the BugSnap API (`https://bugsnap.akusaraproject.my.id`) using a read-scoped user API key (`BUGSNAP_API_KEY=bugsnap_...`). Never use service role keys or bundle secrets.
- **Tool Surface**: Expose only read/query tools (`bugsnap_list_captures`, `bugsnap_get_capture`), resources (`bugsnap://...`), and prompts (`bugsnap_fix_bug`, `bugsnap_triage_open_bugs`). Never add tools that delete, mutate workspace state, or touch billing.
- **Graphify MANDATORY**: Read `../graphify-out/GRAPH_REPORT.md` before exploring code. Use latest graph data only (`graphify-out/graph.json` or latest date snapshot); all old historical snapshots in `../graphify-out/<old-date>/` are purged on update.
- **No dependencies bloat**: Keep dependencies minimal (`@modelcontextprotocol/sdk`, `zod`).

## 2. Brand Asset & Visual Identity Enforcement

**Goal**: Ensure all image generation, visual design, illustrations, marketing content, banners, posters, thumbnails, social media assets, and other visual deliverables strictly adhere to the brand identity.

### 1. Mandatory Brand Colors
- Use official brand colors specified in brand assets as the primary reference whenever generating images.
- All colors used must strictly adhere to the official brand color palette.
- Do not alter, replace color hex codes, or introduce arbitrary new colors inconsistent with the brand identity.
- Accent colors are permitted only when genuinely required for secondary elements and must remain harmonious with the brand identity.
- Never use gradients unless explicitly permitted by brand guidelines.

### 2. Logo Integrity — Strict Rule
- Use the original logo from brand assets as the single source of truth.
- The logo must be preserved 100% identical to its source file.
- Modifying the logo shape, proportions, structure, color, typography, composition, or details is strictly forbidden.
- Recreating, redrawing, modifying, stylizing, or reinterpreting the logo using AI is strictly forbidden.
- Do not add effects, gradients, drop shadows, outlines, glows, or decorative elements to the logo.
- Do not crop, stretch, skew, or distort the logo.
- Ensure the logo is always clearly visible, proportional, with sufficient clear space.
- If image generation cannot render the logo accurately, composite or overlay the original high-resolution logo onto the final generated image.

### 3. Image Generation Requirements
Whenever creating visual assets for any requirement:
- Use brand assets as the primary visual reference.
- Consistently apply brand colors across backgrounds, objects, graphic elements, typography, and accents.
- Preserve the brand's visual character and identity.
- Ensure designs appear professional, clean, modern, and aligned with brand guidelines.
- Never generate generic designs that ignore brand identity.
- Never use colors or visual trademarks belonging to other brands.

### 4. Brand Asset Priority
The strict hierarchy of visual references:
1. Original brand logo.
2. Official brand color palette.
3. Official typography.
4. Existing brand guidelines.
5. Existing approved visual assets.

Never make assumptions or invent a new visual identity when official references are provided.

### 5. Mandatory Rules for AI Agents
- These rules apply to all AI agents, subagents, image generation tools, design tools, and automation workflows.
- Every agent must review and adhere to brand rules prior to executing any visual task.
- Ensure `AGENTS.md` and `CLAUDE.md` maintain synchronized rules.
- Never delete or override existing instructions in either file.
- Integrate these rules as part of permanent project instructions.

### 6. Final Quality Check
Before completing any visual task, verify:
- [ ] Colors match the official brand palette.
- [ ] Logo uses the original file without modifications.
- [ ] No distortion or proportional warping of the logo.
- [ ] No visual elements conflict with brand identity.
- [ ] Final output is consistent with approved brand visual assets.

**NON-NEGOTIABLE:** Brand consistency is mandatory. No image generation or visual design task may disregard brand identity. The logo must never be altered under any circumstance.

