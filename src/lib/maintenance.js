import { CONFIG } from '../config.js';
import { I18N } from '../i18n/bot-messages.js';
import { Database } from './database.js';
import { purgeStorage } from './files.js';
import { Telegram } from './telegram.js';
import { Usage } from './usage.js';

export async function runCleanup(env) {
    const [chatId, botToken] = await Promise.all([env.DB.get('tg_chat_id'), env.DB.get('tg_bot_token')]);
    if (!chatId) return 0;
    const db = new Database(env.DB), removed = await db.purgeExpired(chatId, CONFIG.trashDays * 86400000);
    await purgeStorage({ env, db, chatId, tg: botToken ? new Telegram(botToken) : null }, removed);
    return removed.length;
}

export async function maybeCleanup(env) {
    const last = parseInt(await env.DB.get('cleanup_at') || '0', 10);
    if (Date.now() - last < CONFIG.cleanupEverySec * 1000) return 0;
    await env.DB.put('cleanup_at', String(Date.now()));
    return runCleanup(env);
}

export async function checkUsageAlert(env, db, chatId, tg) {
    try {
        if (!env.BUCKET || !tg) return;
        const limitGb = await Usage.limitGb(env.DB); if (!limitGb) return;
        const fs = await db.getFS(chatId, { includeTrash: true });
        const bytes = fs.files.filter(f => f.provider === 'r2').reduce((a, f) => a + (f.size || 0), 0);
        const pct = bytes / (limitGb * 1e9) * 100, level = Usage.level(pct), prev = parseInt(await env.DB.get('usage_alert') || '0', 10);
        if (level !== prev) await env.DB.put('usage_alert', String(level));
        if (level > prev) {
            const T = I18N[await db.getUserLang(chatId)];
            const text = (level >= 95 ? T.usage_crit : T.usage_warn).replace('{pct}', pct.toFixed(1)).replace('{used}', (bytes / 1e9).toFixed(2)).replace('{limit}', String(limitGb));
            await tg.sendMessage(chatId, text);
        }
    } catch (e) { console.error('usage alert failed', e && e.message); }
}
