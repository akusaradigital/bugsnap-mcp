# bugsnap-mcp

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![MCP Standard](https://img.shields.io/badge/MCP-1.32.1-green.svg?style=flat-square)](https://modelcontextprotocol.io)
[![GitHub Repository](https://img.shields.io/badge/GitHub-akusaradigital%2Fbugsnap--mcp-181717.svg?style=flat-square&logo=github)](https://github.com/akusaradigital/bugsnap-mcp)

Official [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for **[BugSnap](https://bugsnap.akusaraproject.my.id)**.

Gives AI coding agents (**Claude Code**, **Claude Desktop**, **Cursor**, **Windsurf**, or any MCP-compatible client) direct multimodal access to your BugSnap bug reports:
- 📸 **High-resolution annotated screenshots** (transferred directly as base64 image blocks for vision LLMs).
- 🔢 **Sequential step pins (①, ②, ③)** (automatically guides agents through user interaction sequences).
- 📍 **User annotations & team comments** with exact spatial pixel coordinates (`pin_x`, `pin_y`).
- 👣 **Chronological user action steps** (clicks, inputs, and navigation breadcrumbs leading up to the bug).
- 🔴 **Console exceptions & stack traces** captured automatically from the browser DevTools.
- 🌐 **Failed network requests** (HTTP 4xx/5xx status codes, request methods, and endpoints).
- 🖥️ **Runtime environment** (URL, OS, browser, viewport dimensions).
- 🎯 **Actionable AI Fix Blueprint** (a structured diagnostic plan preventing coding agents from guessing or modifying the wrong component).
- ⚠️ **Smart Ambiguity Guardrail** (if a bug report has no written description and no visual markings, the agent pauses and asks the user directly instead of guessing).

Runs 100% locally over `stdio`. No server hosting required. The server exposes read/query tools, resources, and guided prompts only; it does not mutate captures, workspaces, or billing.

## Validation

For routine changes, run the smallest relevant checks first:

```bash
npm run build
```

Use complete validation for release/commit work or when explicitly requested. Never place API keys, service-role credentials, or authentication artifacts in the repository.

---

## 🚀 Quick Start (Installation & Setup)

### 1. Get Your BugSnap API Key
1. Open the [BugSnap Dashboard](https://bugsnap.akusaraproject.my.id).
2. Go to **Settings  BugSnap API Keys**.
3. Click **Generate API Key** and copy your key (starts with `bugsnap_...`).

---

### 2. Install & Build the MCP Server

You can install `bugsnap-mcp` locally on your machine in 2 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/akusaradigital/bugsnap-mcp.git

# 2. Enter the directory
cd bugsnap-mcp

# 3. Install dependencies and build
npm install
npm run build
```

Once built, the server binary is located at `dist/index.js` (e.g. `D:/Akusara/EXTENTION CHROME/bugsnap-mcp/dist/index.js` or `/path/to/bugsnap-mcp/dist/index.js`).

*(Optional: Run `npm link` inside `bugsnap-mcp` to make the `bugsnap-mcp` command available globally in your terminal).*

---

## ⚙️ Client Configurations

> 💡 **Bebas Error Path Windows**:
> - Gunakan **Opsi A (Universal GitHub)** di bawah ini -**100% tanpa path file** sehingga mustahil terkena error backslash Windows (`\`).
> - Jika menggunakan instalasi lokal (Opsi B), jalankan perintah `npm run config` di dalam folder `bugsnap-mcp` untuk mencetak JSON konfigurasi yang **sudah dinormalisasi otomatis menggunakan forward slash (`/`)**.

Pilih AI client yang kamu gunakan di bawah ini:

### ⚡ 1. Claude Code (CLI)

#### Opsi A: 1-Baris Langsung dari GitHub (Tanpa Perlu Clone)
```bash
claude mcp add --scope user -e BUGSNAP_API_KEY=bugsnap_xxx --transport stdio bugsnap -- npx -y github:akusaradigital/bugsnap-mcp
```

#### Opsi B: Menggunakan Path Lokal (Offline / Clone Sendiri)
```bash
claude mcp add --scope user -e BUGSNAP_API_KEY=bugsnap_xxx --transport stdio bugsnap -- node "D:/Akusara/EXTENTION CHROME/bugsnap-mcp/dist/index.js"
```
*(Untuk macOS/Linux, gunakan path Unix seperti `/Users/username/bugsnap-mcp/dist/index.js`).*

---

### 🖥️ 2. Claude Desktop

Buka file konfigurasi `claude_desktop_config.json`:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

#### Opsi A: Langsung via GitHub
```json
{
  "mcpServers": {
    "bugsnap": {
      "command": "npx",
      "args": ["-y", "github:akusaradigital/bugsnap-mcp"],
      "env": {
        "BUGSNAP_API_KEY": "bugsnap_xxx"
      }
    }
  }
}
```

#### Opsi B: Menggunakan Path Lokal
```json
{
  "mcpServers": {
    "bugsnap": {
      "command": "node",
      "args": ["D:/Akusara/EXTENTION CHROME/bugsnap-mcp/dist/index.js"],
      "env": {
        "BUGSNAP_API_KEY": "bugsnap_xxx"
      }
    }
  }
}
```
*Restart Claude Desktop setelah menyimpan file konfigurasi.*

---

### 🖱️ 3. Cursor IDE

Tambahkan ke `.cursor/mcp.json` di root workspace proyek kamu (atau di Cursor Settings  Features  MCP):

```json
{
  "mcpServers": {
    "bugsnap": {
      "command": "npx",
      "args": ["-y", "github:akusaradigital/bugsnap-mcp"],
      "env": {
        "BUGSNAP_API_KEY": "bugsnap_xxx"
      }
    }
  }
}
```
*(Atau gunakan `"command": "node"` dan `"args": ["D:/Akusara/EXTENTION CHROME/bugsnap-mcp/dist/index.js"]` jika menggunakan instalasi lokal).*
  }
}
```

---

### 🌊 4. Windsurf IDE

Tambahkan ke konfigurasi MCP Windsurf di `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "bugsnap": {
      "command": "node",
      "args": ["D:/Akusara/EXTENTION CHROME/bugsnap-mcp/dist/index.js"],
      "env": {
        "BUGSNAP_API_KEY": "bugsnap_xxx"
      }
    }
  }
}
```

---

### 🔌 5. VS Code (Cline / Roo Code)

Tambahkan ke pengaturan MCP settings (`cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "bugsnap": {
      "command": "node",
      "args": ["D:/Akusara/EXTENTION CHROME/bugsnap-mcp/dist/index.js"],
      "env": {
        "BUGSNAP_API_KEY": "bugsnap_xxx"
      },
      "disabled": false,
      "autoApprove": ["bugsnap_list_captures", "bugsnap_get_capture"]
    }
  }
}
```

---

## 💬 Cara Menggunakan Bersama AI Coding Agent

Setelah terhubung, agent kamu akan secara otomatis mengenali tools, resources, dan prompt BugSnap. Kamu cukup mengetik instruksi dalam bahasa sehari-hari:

### 1. Memperbaiki Bug Spesifik
> *"Tolong perbaiki bug dari link ini: https://bugsnap.akusaraproject.my.id/v/8cd0c35b-8683-43e7-940b-2fec6c4fd8ef"*  
> *"Inspect BugSnap capture 8cd0c35b-xxxx dan cari di repo kita kenapa terjadi error 500."*

### 2. Mencari & Triage Bug Terbuka
> *"Cari laporan bug di BugSnap yang berkaitan dengan 'checkout' atau 'payment'."*  
> *"List bug terbuka di workspace BugSnap kita dan urutkan berdasarkan prioritas."*

### 3. Menggunakan Resource Natively (Cursor & Claude Desktop)
Di Cursor atau klien yang mendukung Resource URI, kamu bisa langsung mengetik:
> *"Lihat resource `@bugsnap://captures/8cd0c35b-xxxx` dan buatkan unit test untuk mencegah bug ini terjadi lagi."*  
> *"Buka `@bugsnap://captures/recent` untuk melihat daftar bug terbaru."*

### 4. Menjalankan Guided Prompts
Kamu bisa menjalankan alur kerja bawaan:
- `/bugsnap_fix_bug` (dengan argumen ID capture)
- `/bugsnap_triage_open_bugs`

---

## 🛡️ Guardrails & Pencegahan Kesalahan Diagnosis AI

`bugsnap-mcp` dirancang khusus agar AI Agent tidak salah membaca atau berasumsi keliru:

### 1. 📸 Visual Screenshot & Anotasi
- Screenshot asli diunduh beresolusi penuh (hingga 15MB).
- AI dilatih untuk memeriksa **kotak berwarna**, **anak panah**, dan **nomor langkah (①, ②, ③)** secara berurutan sesuai aksi pengguna.
- Untuk screenshot **Full-Page** yang panjang ke bawah, AI diarahkan untuk memindai kontras visual dan mencocokkan data telemetri, alih-alih menebak dari teks yang terkompresi.

### 2. ⚠️ Ambiguity Guardrail (Deskripsi & Tanda Kosong)
Jika pengguna membuat laporan yang:
- Deskripsi tertulisnya kosong / tidak jelas, **DAN**
- Tidak ada console error maupun network 500, **DAN**
- Tidak ada coretan/tanda pada gambar,
Maka AI Agent **DILARANG mengubah kode sembarangan**. Agent diinstruksikan untuk berhenti dan bertanya langsung kepada pengguna:
> *"Karena gambar yang kamu kirim tidak ada penjelasan detail maupun tanda pada gambar, bisa tolong jelaskan bagian mana yang bermasalah atau behavior apa yang diharapkan?"*

### 3. 🎥 Video Captures (AI Video Guardrail)
Model LLM saat ini tidak dapat memutar/menonton video mentah. Jika capture berupa rekaman video, MCP menyuntikkan larangan berhalusinasi visual, dan langsung mengarahkan AI ke telemetri deterministik:
- Catatan tim bertimestamp (misal: *"di detik 14 tombol freeze"*).
- Breadcrumbs aksi klik & ketikan user.
- Unhandled JavaScript console errors dengan call stack.
- Endpoint network 4xx/5xx yang gagal.

---

## 🛠️ MCP Specification Reference

### Tools
| Tool | Parameter | Deskripsi |
|---|---|---|
| `bugsnap_list_captures` | `query` *(string)*, `limit` *(int 1-25)*, `status` *(open/in-progress/fixed/closed)* | Mencari dan menampilkan daftar laporan bug di workspace. |
| `bugsnap_get_capture` | `id` *(string: UUID atau share URL)* | Mengambil data diagnostik lengkap: gambar screenshot, anotasi, console error, network failure, user steps, dan fix blueprint. |

### Resources
| Resource URI | Tipe | Deskripsi |
|---|---|---|
| `bugsnap://captures/recent` | Dynamic Resource | Menampilkan 15 laporan bug terbaru di workspace. |
| `bugsnap://captures/{id}` | Resource Template | Meng-attach laporan bug dan telemetri langsung ke dalam chat context. |

### Prompts
| Prompt | Argumen | Deskripsi |
|---|---|---|
| `bugsnap_fix_bug` | `id` *(string)*, `repo_hint` *(string opsional)* | Alur kerja terpandu 5 langkah untuk mendiagnosa, memperbaiki, dan memverifikasi bug. |
| `bugsnap_triage_open_bugs` | `query` *(string opsional)* | Alur kerja terpandu untuk mengkategorikan dan memprioritaskan bug terbuka. |

---

## 🔧 Variabel Lingkungan (Environment Variables)

| Variabel | Wajib | Default | Deskripsi |
|---|---|---|---|
| `BUGSNAP_API_KEY` | **Ya** | -| API key workspace dari BugSnap Settings (`bugsnap_...`). |
| `BUGSNAP_API_BASE` | Tidak | `https://bugsnap.akusaraproject.my.id` | Base URL instance BugSnap. |

---

## 🧪 Menguji dengan MCP Inspector

Kamu bisa menguji server secara interaktif di browser menggunakan MCP Inspector:

```bash
BUGSNAP_API_KEY=bugsnap_xxx npx @modelcontextprotocol/inspector node dist/index.js
```

---

## 📄 Lisensi

[MIT](LICENSE) © BugSnap
