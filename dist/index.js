#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const CLI_ARGS = process.argv.slice(2);
if (CLI_ARGS.includes("--config") || CLI_ARGS.includes("--setup") || CLI_ARGS.includes("-c") || CLI_ARGS.includes("--help")) {
    const currentDir = dirname(fileURLToPath(import.meta.url));
    const safeScriptPath = resolve(currentDir, "index.js").replace(/\\/g, "/");
    const safeNodePath = process.execPath.replace(/\\/g, "/");
    const detectedKey = process.env.BUGSNAP_API_KEY || "bugsnap_xxx";
    const hasSpaces = safeScriptPath.includes(" ");
    console.log("\n=======================================================");
    console.log("   BugSnap MCP - AI Client Safe Configurations         ");
    console.log("=======================================================\n");
    console.log("⭐ [METODE 1 - REKOMENDASI] Universal Zero-Path (Bebas Masalah Path):\n");
    console.log("1. Claude Code CLI:");
    console.log(`   claude mcp add --scope user -e BUGSNAP_API_KEY=${detectedKey} --transport stdio bugsnap -- npx -y github:akusaradigital/bugsnap-mcp\n`);
    console.log("2. Claude Desktop / Cursor / Windsurf JSON:");
    console.log(JSON.stringify({
        mcpServers: {
            bugsnap: {
                command: "npx",
                args: ["-y", "github:akusaradigital/bugsnap-mcp"],
                env: { BUGSNAP_API_KEY: detectedKey },
            },
        },
    }, null, 2));
    console.log("\n-------------------------------------------------------");
    console.log("🛠️ [METODE 2] Local Path (Path forward slash otomatis):\n");
    console.log(JSON.stringify({
        mcpServers: {
            bugsnap: {
                command: "node",
                args: [safeScriptPath],
                env: { BUGSNAP_API_KEY: detectedKey },
            },
        },
    }, null, 2));
    console.log("\n💡 [FALLBACK] Jika Claude Desktop error 'spawn node ENOENT' (Node tak terdeteksi di GUI PATH):");
    console.log(`   Ubah "command": "node" menjadi path absolut: "${safeNodePath}"\n`);
    if (hasSpaces) {
        console.log("⚠️ PERHATIAN PATH BERSPASI:");
        console.log(`   Folder proyek mengandung spasi ('${safeScriptPath}').`);
        console.log("   Jika menggunakan terminal CLI (bukan JSON), pastikan path dibungkus tanda kutip ganda.\n");
    }
    if (!process.env.BUGSNAP_API_KEY) {
        console.log("*Ganti 'bugsnap_xxx' dengan API Key kamu dari https://bugsnap.akusaraproject.my.id/settings*\n");
    }
    process.exit(0);
}
const API_KEY = process.env.BUGSNAP_API_KEY;
const API_BASE = (process.env.BUGSNAP_API_BASE || "https://bugsnap.akusaraproject.my.id").replace(/\/+$/, "");
if (!API_KEY || !API_KEY.startsWith("bugsnap_")) {
    console.error("[bugsnap-mcp] Missing or invalid BUGSNAP_API_KEY. Generate one at " +
        `${API_BASE}/settings (BugSnap API Keys) and pass it as the BUGSNAP_API_KEY environment variable.`);
    process.exit(1);
}
const STATUS_VALUES = ["open", "in-progress", "fixed", "closed"];
async function apiFetch(path) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
        const message = json && typeof json === "object" && "error" in json && typeof json.error === "string"
            ? json.error
            : `BugSnap API error (${res.status})`;
        throw new Error(message);
    }
    return json;
}
/** Accepts a bare capture UUID or a full share URL (https://bugsnap.../v/<uuid>). */
function extractCaptureId(input) {
    const match = input.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
    return match ? match[0] : input.trim();
}
function errorResult(message) {
    return { isError: true, content: [{ type: "text", text: message }] };
}
const server = new McpServer({ name: "bugsnap", version: "0.3.0" });
function formatCaptureDetailReport(cap) {
    const sections = [];
    const isVideo = cap.type === "video" || (!cap.screenshot_url && Boolean(cap.video_url));
    const isFullpage = cap.type === "fullpage" || (cap.window_size && /fullpage/i.test(cap.window_size));
    const hasDescription = Boolean(cap.description && cap.description.trim().length > 5);
    const hasConsoleErrors = cap.console_errors.length > 0;
    const hasNetworkErrors = cap.network_errors.length > 0;
    const hasComments = Boolean(cap.comments && cap.comments.length > 0);
    const hasTelemetryErrors = hasConsoleErrors || hasNetworkErrors;
    const isAmbiguous = !hasDescription && !hasTelemetryErrors && !hasComments;
    // 1. Header & Metadata
    sections.push(`# [BugSnap] ${cap.title}`, `**Type**: ${cap.type} | **Status**: ${cap.status || "open"} | **Category**: ${cap.tag || "bug"}`, `**Public Link**: ${API_BASE}/v/${cap.id}`);
    // 2. User Description & Reported Behavior
    const descText = cap.description && cap.description.trim()
        ? cap.description.trim()
        : "*(No written description provided by reporter)*";
    sections.push(`\n## 📝 User Description & Observed Behavior`, descText);
    // 2b. Ambiguity Guardrail (when report lacks description, logs, and comments)
    if (isAmbiguous) {
        sections.push(`\n## ⚠️ Ambiguity Guardrail: Missing Description & Telemetry`, `**CRITICAL DIRECTIVE FOR AI CODING AGENT**:`, `- The reporter did not provide a written problem description.`, `- Zero console runtime exceptions and zero HTTP 4xx/5xx network failures were recorded.`, `- No team discussion comments or coordinate pins are present.`, `\n**PAUSE AND CLARIFY FIRST**:`, `Inspect the attached screenshot carefully:`, `1. If you **DO** see explicit user markings (colored bounding box, arrow, or numbered pins ① ②), use those to locate the bug.`, `2. If the image **DOES NOT** have any clear annotations, boxes, or markings either:`, `   👉 **DO NOT GUESS OR ARBITRARILY MODIFY CODE.**`, `   👉 **You MUST stop and ask the user directly for clarification:**`, `   > *"Karena gambar yang kamu kirim tidak ada penjelasan detail maupun tanda pada gambar, bisa tolong jelaskan bagian mana yang bermasalah atau behavior apa yang diharapkan?"*`);
    }
    // 3. Team Comments & Pinned Annotations
    if (cap.comments && cap.comments.length > 0) {
        const commentLines = cap.comments.map((c) => {
            const pinInfo = c.pin_x !== null && c.pin_y !== null ? ` *(pinned at screen position X: ${c.pin_x}%, Y: ${c.pin_y}%)*` : "";
            const timeInfo = c.video_timestamp !== null ? ` *(at ${c.video_timestamp}s)*` : "";
            const resolvedInfo = c.resolved ? " [RESOLVED]" : "";
            return `- **${c.author}**${pinInfo}${timeInfo}${resolvedInfo}: ${c.body}`;
        });
        sections.push(`\n## 💬 Team Comments & Pinned Notes (${cap.comments.length})`, commentLines.join("\n"));
    }
    // 4. Runtime Environment
    sections.push(`\n## 🖥️ Runtime & Environment`, `- **Page URL**: ${cap.site_url || "Not specified"}`, `- **Platform**: ${cap.browser || "Unknown browser"} on ${cap.os || "Unknown OS"}`, `- **Viewport / Resolution**: ${cap.window_size || "Standard viewport"}`, `- **Captured At**: ${cap.created_at}${cap.duration ? ` (Duration: ${cap.duration}s)` : ""}${cap.folder_name ? ` · Folder: ${cap.folder_name}` : ""}`);
    // 5. Existing AI Summary (if pre-computed by BugSnap)
    if (cap.ai_summary) {
        sections.push(`\n## 💡 BugSnap Diagnostic Intelligence`, cap.ai_summary);
    }
    // 6. Console Exceptions & Stack Traces
    sections.push(`\n## 🔴 Console Errors (${cap.console_errors.length})`);
    if (cap.console_errors.length === 0) {
        sections.push("No console errors recorded during capture.");
    }
    else {
        for (const e of cap.console_errors) {
            sections.push(`- **[${e.level.toUpperCase()}]** ${e.message}${e.stack ? `\n  \`\`\`\n  ${e.stack.replace(/\n/g, "\n  ")}\n  \`\`\`` : ""}`);
        }
    }
    // 7. Network Failures
    sections.push(`\n## 🌐 Failed Network Requests (${cap.network_errors.length})`);
    if (cap.network_errors.length === 0) {
        sections.push("No network HTTP failures (4xx/5xx) recorded.");
    }
    else {
        for (const n of cap.network_errors) {
            sections.push(`- **${n.method}** \`${n.url}\` ➔ Status: **${n.status || "FAILED / TIMEOUT"}**`);
        }
    }
    // 8. User Action Steps (Reproduction Breadcrumbs)
    sections.push(`\n## 👣 User Actions Before Bug (${cap.user_steps.length})`);
    if (cap.user_steps.length === 0) {
        sections.push("No user action steps recorded.");
    }
    else {
        cap.user_steps.forEach((step, idx) => {
            sections.push(`${idx + 1}. ${step}`);
        });
    }
    // 9. Video Recording reference & AI Guardrail (if video)
    if (cap.video_url || isVideo) {
        sections.push(`\n## 🎥 Screen Recording (Video Capture)`, `- **Recording URL**: ${cap.video_url || `${API_BASE}/v/${cap.id}`}`, `- **Duration**: ${cap.duration ? `${cap.duration}s` : "Recorded session"}`, `\n### ⚠️ Critical Guardrail: AI Agents Cannot Watch Video`, `**IMPORTANT RESTRICTION FOR AI CODING AGENTS**:`, `- **AI models cannot view or decode video files over MCP.**`, `- **DO NOT** guess, imagine, or hallucinate visual screen changes, button animations, or video frames.`, `- **DO NOT** invent CSS layout issues or visual bugs that are not explicitly documented in the report.`, `- **DIAGNOSTIC SOURCE OF TRUTH**: Base your code fix strictly on deterministic telemetry:`, `  1. **User Description & Timestamped Comments**: Note what the user saw and any team pins (e.g. "at 14s").`, `  2. **User Reproduction Actions**: Chronological click and input actions leading up to the bug.`, `  3. **Console Exceptions**: Unhandled JavaScript runtime errors with call-site stack traces.`, `  4. **Network Failures**: Exact HTTP 4xx/5xx endpoint failures, methods, and status codes.`);
    }
    // 10. Multi-Modal Visual Inspection Directives (for screenshots)
    if (cap.screenshot_url) {
        sections.push(`\n## 📸 Visual Screenshot & Annotations`, `- **Status**: An annotated screenshot of this bug is attached below as an image block.`, `- **Visual Directives for AI Agents**:`, `  1. **User Bounding Boxes & Arrows**: Look for colored rectangles, circles, arrows, or text callouts identifying the exact broken element.`, `  2. **Numbered Step Pins (①, ②, ③)**: Look for circular step badges (1, 2, 3...) on the image. These indicate the user's sequential interaction flow. Follow them in numeric order (1 ➔ 2 ➔ 3) and correlate with "User Actions Before Bug".`);
        if (isFullpage) {
            sections.push(`  3. **Fullpage Capture Notice**: This is a full-page scroll capture. Vision LLMs rescale tall images which compresses small text. Scan along the vertical document scroll specifically for high-contrast colored boxes, arrows, or step badges. Correlate with the Page URL and Network/Console logs rather than trying to read compressed sub-pixel body copy.`);
        }
        else {
            sections.push(`  3. **Viewport Alignment**: Check the layout, typography, and component alignment against the reported viewport (${cap.window_size || "desktop"}).`);
        }
    }
    // 11. Actionable AI Agent Fix Blueprint
    const fixSteps = [
        `\n## 🎯 Actionable Fix Blueprint for AI Coding Agent`,
        `Follow these systematic steps to avoid making false assumptions or fixing the wrong component:`,
    ];
    if (isAmbiguous) {
        fixSteps.push(`1. **Clarification Gate (Mandatory)**: Check the attached screenshot. If there are NO user-drawn bounding boxes, arrows, or step badges, DO NOT guess or edit code. Prompt the user immediately: "Karena gambar yang kamu kirim tidak ada penjelasan detail maupun tanda pada gambar, bisa tolong jelaskan bagian mana yang bermasalah atau behavior apa yang diharapkan?"`);
    }
    else if (isVideo) {
        fixSteps.push(`1. **Correlate Intent from Telemetry (Video Mode)**: Because visual frames cannot be viewed by AI agents, rely strictly on the user's description ("${cap.description.slice(0, 100) || cap.title}") and page URL (\`${cap.site_url || "the active view"}\`). Do NOT hallucinate visual defects.`);
    }
    else {
        fixSteps.push(`1. **Correlate Visual & Text Intent**: Review the description ("${cap.description.slice(0, 100) || cap.title}") and verify the broken behavior against the attached screenshot, numbered step pins (① ② ③), and page URL (\`${cap.site_url || "the active view"}\`).`);
    }
    if (cap.network_errors.length > 0) {
        const topFailedUrl = cap.network_errors[0].url;
        fixSteps.push(`2. **Investigate Network Failure**: Search your codebase for the failed endpoint \`${topFailedUrl}\` to locate the API route handler, query hook, or data-fetching logic.`);
    }
    else if (cap.console_errors.length > 0) {
        const topError = cap.console_errors[0].message;
        fixSteps.push(`2. **Investigate Console Error**: Search your codebase for "${topError.slice(0, 80)}" or the top application file referenced in the stack trace.`);
    }
    else if (cap.user_steps.length > 0) {
        const lastAction = cap.user_steps[cap.user_steps.length - 1];
        fixSteps.push(`2. **Trace User Trigger**: Search for the component or event handler triggered by the user's final action ("${lastAction}").`);
    }
    else {
        if (isVideo) {
            fixSteps.push(`2. **Trace Workflow from URL & Description**: Search your codebase for route handlers or page components corresponding to \`${cap.site_url || "the reported page"}\`.`);
        }
        else {
            fixSteps.push(`2. **Locate Target Component**: Search your codebase for UI strings or element identifiers visible in the attached screenshot.`);
        }
    }
    fixSteps.push(`3. **Check Edge Cases**: Check for missing null/undefined guards, unhandled empty arrays, race conditions, or CSS viewport overflow.`, `4. **Verify Fix**: Ensure your code change addresses the root cause directly without regressing adjacent workflows.`);
    sections.push(fixSteps.join("\n"));
    return {
        markdown: sections.filter((s) => s !== "").join("\n"),
        isVideo,
    };
}
// ==========================================
// TOOLS
// ==========================================
server.registerTool("bugsnap_list_captures", {
    title: "List and search BugSnap bug reports",
    description: "List and search recent BugSnap bug reports (screenshots, recordings, and diagnostic telemetry) captured for your workspace. Filter by status or search by keyword (title, description, or URL). Use this to find a capture ID before inspecting it with bugsnap_get_capture.",
    inputSchema: {
        query: z.string().optional().describe("Optional search keyword to match against capture title, description, or site URL."),
        limit: z.number().int().min(1).max(25).optional().describe("Max captures to return (default 10, max 25)."),
        status: z.enum(STATUS_VALUES).optional().describe("Filter by triage status (open, in-progress, fixed, closed)."),
    },
}, async ({ query, limit, status }) => {
    try {
        const qs = new URLSearchParams();
        if (query)
            qs.set("query", query);
        if (limit)
            qs.set("limit", String(limit));
        if (status)
            qs.set("status", status);
        const { captures } = await apiFetch(`/api/public/v1/captures?${qs}`);
        if (captures.length === 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: query
                            ? `No BugSnap captures matched the search query "${query}".`
                            : "No BugSnap captures found for this workspace.",
                    },
                ],
            };
        }
        const lines = captures.map((c) => `- **${c.title}** (${c.type}${c.status ? ` · ${c.status}` : ""}${c.tag ? ` · ${c.tag}` : ""})\n` +
            `  id: ${c.id}\n` +
            `  url: ${API_BASE}/v/${c.id}\n` +
            `  site: ${c.site_url || "-"} · captured: ${c.created_at}`);
        return {
            content: [
                {
                    type: "text",
                    text: `${captures.length} BugSnap capture(s) found:\n\n${lines.join("\n\n")}\n\n*Call bugsnap_get_capture with an ID above to view the full bug report, annotated screenshot, and fix guidance.*`,
                },
            ],
        };
    }
    catch (err) {
        return errorResult(err instanceof Error ? err.message : "Failed to list BugSnap captures");
    }
});
server.registerTool("bugsnap_get_capture", {
    title: "Get BugSnap bug report, annotated screenshot & fix guidance",
    description: "Get complete, multimodal debugging context for a BugSnap bug report so you can diagnose and fix it with precision without guessing: (1) multi-modal annotated screenshot image (with user-drawn arrows, boxes, text callouts), (2) user's problem description & expected behavior, (3) team discussion comments with pinned coordinate locations, (4) console exceptions with full stack traces, (5) failed network API requests (4xx/5xx), (6) chronological user action steps prior to the defect, (7) runtime environment (URL, browser, OS, viewport dimensions), and (8) an actionable step-by-step fix blueprint tailored for AI coding agents. Accepts either a bare capture UUID or a full BugSnap share URL.",
    inputSchema: {
        id: z.string().describe("Capture ID (UUID) or full BugSnap share URL, e.g. https://bugsnap.akusaraproject.my.id/v/<id>"),
    },
}, async ({ id }) => {
    try {
        const captureId = extractCaptureId(id);
        const cap = await apiFetch(`/api/public/v1/captures/${encodeURIComponent(captureId)}`);
        const { markdown } = formatCaptureDetailReport(cap);
        const content = [
            { type: "text", text: markdown },
        ];
        // Download and attach screenshot if available
        if (cap.screenshot_url) {
            try {
                const imgRes = await fetch(cap.screenshot_url, {
                    headers: { Authorization: `Bearer ${API_KEY}` },
                });
                const contentLength = Number(imgRes.headers.get("content-length") || 0);
                // Allow up to 15MB for high-res fullpage screenshots
                if (imgRes.ok && (!contentLength || contentLength <= 15 * 1024 * 1024)) {
                    const buf = Buffer.from(await imgRes.arrayBuffer());
                    if (buf.byteLength > 0 && buf.byteLength <= 15 * 1024 * 1024) {
                        const rawType = (imgRes.headers.get("content-type") || "image/png").split(";")[0].trim().toLowerCase();
                        const validTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
                        const mimeType = validTypes.includes(rawType) ? rawType : "image/png";
                        content.push({
                            type: "image",
                            data: buf.toString("base64"),
                            mimeType,
                        });
                    }
                }
            }
            catch {
                // Screenshot fetch is best-effort - the text report and guidance still stand without it.
            }
        }
        return { content };
    }
    catch (err) {
        return errorResult(err instanceof Error ? err.message : "Failed to fetch BugSnap capture");
    }
});
// ==========================================
// RESOURCES
// ==========================================
// Static resource: list of recent captures
server.registerResource("Recent BugSnap Captures", "bugsnap://captures/recent", {
    description: "List of the most recent bug reports captured for your workspace in BugSnap.",
    mimeType: "text/markdown",
}, async (uri) => {
    try {
        const { captures } = await apiFetch("/api/public/v1/captures?limit=15");
        const lines = captures.map((c) => `- **[${c.title}](${API_BASE}/v/${c.id})** (${c.type}${c.status ? ` · ${c.status}` : ""})\n` +
            `  - Resource URI: \`bugsnap://captures/${c.id}\`\n` +
            `  - Target URL: ${c.site_url || "-"}\n` +
            `  - Created: ${c.created_at}`);
        return {
            contents: [
                {
                    uri: uri.href,
                    mimeType: "text/markdown",
                    text: `# Recent BugSnap Captures\n\n${lines.join("\n\n")}\n\n*Reference any capture in your AI client using its URI: \`bugsnap://captures/<id>\`.*`,
                },
            ],
        };
    }
    catch (err) {
        return {
            contents: [
                {
                    uri: uri.href,
                    mimeType: "text/markdown",
                    text: `Failed to fetch recent BugSnap captures: ${err instanceof Error ? err.message : "API error"}`,
                },
            ],
        };
    }
});
// Dynamic resource template: read specific capture details as a resource
server.registerResource("BugSnap Capture Detail", new ResourceTemplate("bugsnap://captures/{id}", {
    list: async () => {
        try {
            const { captures } = await apiFetch("/api/public/v1/captures?limit=25");
            return {
                resources: captures.map((c) => ({
                    uri: `bugsnap://captures/${c.id}`,
                    name: c.title,
                    description: `${c.type} · ${c.status || "open"} · ${c.site_url || "No site"}`,
                    mimeType: "text/markdown",
                })),
            };
        }
        catch {
            return { resources: [] };
        }
    },
}), {
    description: "Complete diagnostic bug report, telemetry logs, and fix blueprint for a specific BugSnap capture ID.",
    mimeType: "text/markdown",
}, async (uri, { id }) => {
    try {
        const captureId = extractCaptureId(String(id));
        const cap = await apiFetch(`/api/public/v1/captures/${encodeURIComponent(captureId)}`);
        const { markdown } = formatCaptureDetailReport(cap);
        return {
            contents: [
                {
                    uri: uri.href,
                    mimeType: "text/markdown",
                    text: markdown,
                },
            ],
        };
    }
    catch (err) {
        return {
            contents: [
                {
                    uri: uri.href,
                    mimeType: "text/markdown",
                    text: `Failed to fetch BugSnap capture: ${err instanceof Error ? err.message : "API error"}`,
                },
            ],
        };
    }
});
// ==========================================
// PROMPTS
// ==========================================
server.registerPrompt("bugsnap_fix_bug", {
    title: "Fix BugSnap Bug Report",
    description: "Step-by-step guided workflow for an AI agent to diagnose, fix, and verify a BugSnap bug report.",
    argsSchema: {
        id: z.string().describe("BugSnap capture ID (UUID) or share URL, e.g. https://bugsnap.akusaraproject.my.id/v/<id>"),
        repo_hint: z.string().optional().describe("Optional path or directory hint where the codebase files reside, e.g. src/components"),
    },
}, async ({ id, repo_hint }) => {
    const captureId = extractCaptureId(id);
    const hintClause = repo_hint ? ` Focus your initial file search in \`${repo_hint}\`.` : "";
    return {
        description: `Workflow to diagnose and resolve BugSnap bug report ${captureId}.`,
        messages: [
            {
                role: "user",
                content: {
                    type: "text",
                    text: `Please resolve the user-reported bug from BugSnap capture \`${captureId}\`.${hintClause}\n\n` +
                        `### Diagnostic Workflow:\n` +
                        `1. Call \`bugsnap_get_capture(id: "${captureId}")\` to inspect the report, annotated screenshot, console stack traces, network 4xx/5xx failures, and reproduction steps.\n` +
                        `2. Review the user's description and screenshot annotations. Follow any numbered step pins (①, ②, ③) in order.\n` +
                        `   - If the report has NO written description, NO console/network errors, and NO visual markings on the image, pause immediately and ask the user for clarification before modifying code: "Karena gambar yang kamu kirim tidak ada penjelasan detail maupun tanda pada gambar, bisa tolong jelaskan bagian mana yang bermasalah atau behavior apa yang diharapkan?"\n` +
                        `   - If the report is a video recording, strictly adhere to the video guardrail: do NOT guess visual layout; diagnose from network/console/step telemetry.\n` +
                        `3. Search the local repository for matching API routes, error messages from stack traces, or relevant UI components.\n` +
                        `4. Implement the minimal correct fix for the root cause without regressions.\n` +
                        `5. Run the repository's test or typecheck gate to verify that the fix is clean and working.`,
                },
            },
        ],
    };
});
server.registerPrompt("bugsnap_triage_open_bugs", {
    title: "Triage Open BugSnap Bugs",
    description: "Guided workflow to inspect, categorize, and prioritize all open bug reports in your workspace.",
    argsSchema: {
        query: z.string().optional().describe("Optional keyword search to filter bug reports, e.g. 'checkout' or 'login'"),
    },
}, async ({ query }) => {
    const searchClause = query ? ` matching "${query}"` : "";
    return {
        description: `Triage open BugSnap bug reports${searchClause}.`,
        messages: [
            {
                role: "user",
                content: {
                    type: "text",
                    text: `Please triage the open BugSnap bug reports${searchClause} for this workspace:\n\n` +
                        `1. Call \`bugsnap_list_captures\` with \`status: "open"\`${query ? ` and \`query: "${query}"\`` : ""}.\n` +
                        `2. For each relevant capture, review the title, site URL, and type.\n` +
                        `3. Group them by module/page, identify potential duplicates or recurring error patterns, and rank them by estimated severity.\n` +
                        `4. Provide a clear triage summary table with recommended fix orders and capture IDs.`,
                },
            },
        ],
    };
});
await server.connect(new StdioServerTransport());
