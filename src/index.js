// Worker entry point: request routing + scheduled cleanup.
import { handleHook } from './bot/webhook.js';
import { isCrossSiteWrite } from './http.js';
import { Database } from './lib/database.js';
import { runCleanup } from './lib/maintenance.js';
import { Telegram } from './lib/telegram.js';
import { PWA_ICONS, pwaResponse } from './pwa.js';
import { apiRoutes } from './routes/api.js';
import { authRoutes } from './routes/auth.js';
import { fileRoutes } from './routes/files.js';
import { Session } from './security/session.js';
import { Utils } from './utils.js';

async function handle(request, env, ctx) {
    const url = new URL(request.url); const method = request.method; const path = url.pathname;
    if (!env.DB) return new Response('KV namespace binding "DB" is missing. Re-run the installer.', { status: 500 });
    if ((method === 'GET' || method === 'HEAD') && (path === '/manifest.webmanifest' || path === '/sw.js' || PWA_ICONS[path])) return pwaResponse(path);

    const isFileRoute = /^\/(s|d|r2|download)\//.test(path); // file delivery only needs a few keys (fewer KV reads for streaming/seeking)
    const keys = isFileRoute ? ['tg_bot_token', 'tg_chat_id', 'session_secret'] : ['site_password_hash', 'tg_bot_token', 'tg_chat_id', 'session_secret', 'webhook_secret'];
    const vals = Object.fromEntries(await Promise.all(keys.map(async k => [k, await env.DB.get(k)])));
    const passHash = vals.site_password_hash, botToken = vals.tg_bot_token, chatId = vals.tg_chat_id, sessionSecret = vals.session_secret, webhookSecret = vals.webhook_secret;
    const S = { passHash, botToken, chatId, sessionSecret, webhookSecret };
    const setupToken = env.SETUP_TOKEN || null;
    const db = new Database(env.DB);
    const tg = botToken ? new Telegram(botToken) : null;
    const cookies = Utils.parseCookies(request.headers.get('Cookie'));
    const isAuth = await Session.verify(cookies[Session.COOKIE], sessionSecret);
    const ip = Utils.ip(request);

    // CSRF: state-changing requests must come from this site
    if (!['GET', 'HEAD', 'OPTIONS'].includes(method) && path !== '/hook' && isCrossSiteWrite(request, url)) return new Response('Forbidden', { status: 403 });

    // ---------- Telegram webhook ----------
    if (path === '/hook' && method === 'POST') return handleHook(request, env, ctx, url, S);

    const c = { request, env, ctx, url, method, path, passHash, botToken, chatId, sessionSecret, webhookSecret, setupToken, db, tg, isAuth, ip };
    return (await authRoutes(c)) || (await fileRoutes(c)) || (await apiRoutes(c)) || new Response('404 Not Found', { status: 404 });
}

export default {
    async scheduled(event, env, ctx) { ctx.waitUntil(runCleanup(env)); },
    async fetch(request, env, ctx) {
        try { return await handle(request, env, ctx); }
        catch (err) {
            console.error('Unhandled error:', err && err.stack || err);
            return new URL(request.url).pathname.startsWith('/api/') ? Utils.jsonResp({ error: 'SERVER_ERROR' }, 500) : new Response('Internal Server Error', { status: 500 });
        }
    }
};
