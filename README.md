<div align="center">

# ☁️ monsmain-cloud

**Your own private cloud drive — running on *your* Cloudflare account, controlled from a web panel and a Telegram bot.**

[![Version](https://img.shields.io/badge/version-1.0.0-f97316?style=flat-square)](#)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![Telegram](https://img.shields.io/badge/Telegram-Bot-26A5E4?style=flat-square&logo=telegram&logoColor=white)](https://core.telegram.org/bots)
[![PWA](https://img.shields.io/badge/PWA-installable-0a0a0a?style=flat-square)](#install-it-as-an-app-pwa)
[![UI](https://img.shields.io/badge/UI-English%20%7C%20%D9%81%D8%A7%D8%B1%D8%B3%DB%8C-0a0a0a?style=flat-square)](#)

<div align="center">
    <p>
        <a href="README.fa.md">
            <small>فارسی</small>
            <img src='https://github.com/monsmain/ighack/blob/main/images/Flag-iran.png' alt='persian' style='width: 20px;height: 15px;border-radius: 3px;' />
        </a>
        | <img src='https://github.com/monsmain/ighack/blob/main/images/flag-en.png' alt='English' style='width: 20px;height: 15px;border-radius: 3px;' />
        <small>English</small> </p> 
</div>

### 🚀 [Open the installer and get your own panel](https://installer-cloud.monsmain.workers.dev)

</div>

<!--
Add screenshots to a docs/ folder and uncomment:
<p align="center"><img src="docs/panel-dark.png" width="46%"> <img src="docs/panel-light.png" width="46%"></p>
-->

---

## Why monsmain-cloud?

- **One-click install.** Open the installer link, paste one token, done. No terminal, no `wrangler`, no copy-pasting keys.
- **You own everything.** Files, database and settings live in *your* Cloudflare account. The installer never stores your token.
- **Two storage engines.** Telegram for small files and Cloudflare R2 for big ones.
- **Panel + bot.** Manage files from the browser or straight from Telegram.
- **Made for phones and desktops.** Responsive UI, bottom tab bar on mobile, installable as an app.

## Features

| | |
| --- | --- |
| 🗂️ **Drive** | Folders, search, drag & drop, move, image previews, multi-select move / delete |
| ☁️ **Storage engines** | **Telegram** (≤ 20 MB per file) shown as real photos / videos / music, or as files · **Cloudflare R2** (≤ 10 GB per file, multipart upload) |
| 🔗 **Share links** | Public link per file, revoke any time. Bot download links are signed and expire after 1 hour |
| 🗑️ **Trash** | Delete → trash → restore, or permanently delete after a confirmation. **Auto-purged after 30 days** |
| 📊 **R2 usage** | Real usage read from the bucket, configurable limit (default 10 GB = free tier), warnings at 80 % / 95 % in the panel **and** in Telegram |
| 🌐 **Remote upload** | Paste a direct URL — the Worker streams it into R2 (nothing passes through your device) |
| 🤖 **Telegram bot** | `/start`, `/menu`, upload by sending a file or a link, list / share / delete, trash with confirmation, `/setpass` |
| 📱 **PWA** | Install on Android / desktop with one tap, iOS via *Add to Home Screen* |
| 🎨 **UI** | English & Persian (RTL), light & dark, orange × black / white brand |
| 🔐 **Security** | See [Security](#security) |

## How it works

```text
 Browser / PWA ───┐
                  ├──►  Worker (this repo)  ──►  KV        file index + settings
 Telegram bot ────┘            │
                               ├──►  R2        large files (up to 10 GB each)
                               └──►  Telegram  small files (up to 20 MB each)
```

1. The **installer** (link above) uses a Cloudflare API token that you create with one click. It creates a KV database and, optionally, an R2 bucket in **your** account and uploads this panel as a Worker.
2. You open your new panel and enter your Telegram **bot token**, **chat ID** and a password.
3. The panel keeps a small index of your files in KV. The files themselves go to Telegram (≤ 20 MB) or R2 (≤ 10 GB).
4. The Telegram bot talks to the same Worker through a webhook, so you can manage everything from the chat too.

---

## Quick start

> You only need a Cloudflare account and a Telegram account.

### 1 · Prepare Telegram (2 minutes)

1. Open **[@BotFather](https://t.me/BotFather)** → `/newbot` → copy the **bot token** (`123456789:AA…`).
2. Open **[@userinfobot](https://t.me/userinfobot)** → copy your numeric **chat ID**.
3. Open your new bot and press **Start** (a bot can't message you before that).

### 2 · Install the panel

1. Open the installer: **<https://installer-cloud.monsmain.workers.dev>**
2. Press **Create the token for me** — Cloudflare opens with every permission already selected.
3. Press **Continue to summary → Create Token**, copy the token and paste it into the installer.
4. Pick a name (default `monsmain-cloud`), keep **R2** ticked if it is enabled on your account, press **Install**.
5. When it finishes, press **Open my panel**. The link contains your one-time setup key — keep it private until you finish step 3.
6. Delete the API token from Cloudflare (**My Profile → API Tokens**); the installer no longer needs it.

### 3 · Finish the setup on your panel

Enter the bot token, your chat ID and a password (≥ 8 characters). The panel checks the token, sends you a confirmation message in Telegram, connects the webhook and creates the bot's `/` command menu. You're in 🎉

> **R2 note:** R2 must be enabled once in your Cloudflare dashboard (Cloudflare may ask for a payment method; the free tier includes 10 GB). Without R2 the panel still works with the Telegram engine, and you can run the installer again later to add it.

---

## Using the panel

| Tab | What you can do |
| --- | --- |
| **Upload** | Pick an engine, drop a file or paste a direct URL. For Telegram you can choose *Send as media* (Telegram recompresses photos — turn it off to keep originals). With R2 you see live usage and get a warning before going over your limit. |
| **My Drive** | Create folders, search, open / preview, **Share** (copy link, stop sharing), **Move**, delete. Press **Select** to move or delete many files at once. Small images show thumbnails. |
| **Trash** | Restore or **delete forever** (asks for confirmation). Each item shows how many days are left before the automatic purge. |
| **Settings** (gear) | Change the bot token, chat ID and the R2 limit (GB, `0` = no warnings). Shows the panel version and R2 status. |

**Forgot the password?** Press *Recover Password* on the login page, choose a new one and enter the 6-digit code the bot sends you (valid 10 minutes). Or send `/setpass new_password` to the bot.

### Install it as an app (PWA)

- **Android / Chrome / Edge:** press **Install app** in the top bar (or use the browser's install prompt).
- **iPhone / iPad:** Safari → **Share → Add to Home Screen**.

## Using the bot

| Do this | Result |
| --- | --- |
| `/start` or `/menu` | Main menu (files, trash, password help, chat ID, language) |
| Send a file (≤ 20 MB) | Asks for confirmation, then saves it |
| Send a direct link | Downloads it into R2 (up to 200 MB through the bot — use the panel for bigger files) |
| **My files** | 5 per page: open (sends the file or a 1-hour link), 🔗 share / 🚫 unshare, 🗑️ delete |
| **Trash** | ♻️ restore, ❌ delete forever (confirmation required) |
| `/setpass new_password` | Changes the panel password, signs out all sessions, deletes your message |

The bot answers **only the admin** (the chat ID you entered); everybody else gets a "private bot" notice.

## Update · Uninstall

- **Update:** open the installer again and use the **same name** — files and settings are kept.
- **Uninstall:** delete the Worker, the KV namespace `<name>-kv`, the R2 bucket `<name>-files` (empty it first), open `https://api.telegram.org/bot<TOKEN>/deleteWebhook`, and delete the API token.

---

## Security

- Signed, `HttpOnly`, `Secure`, `SameSite=Lax` session cookies; sessions are invalidated when the password changes
- PBKDF2-SHA256 password hashing with a random salt; login, recovery and setup are rate-limited
- CSRF protection via `Sec-Fetch-Site` / `Origin`
- Single-admin Telegram bot: webhook `secret_token` **and** chat-ID check
- One-time setup key (`SETUP_TOKEN`) so nobody else can claim a fresh panel
- Remote-URL uploads block local / private addresses (SSRF guard)
- File names are escaped in the UI; HTML / SVG / JS files are always served as attachments with a sandbox CSP and `nosniff`
- Private files need a login; share links are unguessable UUIDs and stop working when you revoke them or move the file to the trash
- The installer never stores or logs your Cloudflare token

## Limits to know

- **Single admin** — one owner per panel.
- **Telegram engine:** 20 MB per file (Bot API limit). Telegram recompresses photos when sent as media.
- **R2 engine:** 10 GB per file in the UI. Usage listing is accurate up to ~50 000 objects (marked *partial* beyond that).
- The file index is one JSON document in KV (25 MB cap) — plenty for personal use, not for millions of files.
- The panel UI loads Tailwind and the Vazirmatn font from public CDNs; if they are blocked in your network the page may look unstyled.
- Image "thumbnails" are the original files (≤ 4 MB) loaded lazily and cached for 24 h — real resizing would need Cloudflare Images.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| *Telegram rejected this bot token* | Copy the whole token from BotFather; the page shows Telegram's own reason in parentheses |
| *The bot cannot message this chat* | Open the bot and press **Start**, then try again; check the chat ID |
| *R2 could not be enabled* | Enable R2 in the Cloudflare dashboard, then run the installer again with the same name |
| 404 right after install | Cloudflare needs up to a minute to publish — wait and refresh |
| *Forbidden* on a form | Update to the latest version (run the installer again) |
| Bot silent after an update | Open the panel once — it re-registers the webhook |

---
