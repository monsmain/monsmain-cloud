import { handleCallback } from './callbacks.js';
import { handleMessage } from './messages.js';
import { readJson } from '../http.js';
import { I18N } from '../i18n/bot-messages.js';
import { Database } from '../lib/database.js';
import { Telegram } from '../lib/telegram.js';
import { RateLimit } from '../security/rate-limit.js';
import { Utils } from '../utils.js';

export async function setupBotCommands(tg) {
    await Promise.allSettled([
        tg.setMyCommands([{ command: 'start', description: 'Start the bot and open the menu' }, { command: 'menu', description: 'Show the main menu' }]),
        tg.setMyCommands([{ command: 'start', description: 'شروع و باز کردن منوی اصلی' }, { command: 'menu', description: 'نمایش منوی اصلی' }], 'fa')
    ]);
}

export async function ensureWebhook(env, botToken, origin) {
    const tg = new Telegram(botToken), secret = Utils.randomToken(24);
    const res = await tg.setWebhook(`${origin}/hook`, secret);
    if (res.ok) { await env.DB.put('webhook_secret', secret); await setupBotCommands(tg); }
    return res;
}

export async function handleHook(request, env, ctx, url, S) {
    if (!S.botToken || !S.chatId || !S.webhookSecret) return new Response('OK');
    if (!Utils.timingSafeEqual(request.headers.get('X-Telegram-Bot-Api-Secret-Token') || '', S.webhookSecret)) return new Response('Forbidden', { status: 403 });
    const update = await readJson(request);
    const tg = new Telegram(S.botToken);
    const from = (update.callback_query && update.callback_query.from) || (update.message && update.message.from);
    if (!from) return new Response('OK');

    if (String(from.id) !== String(S.chatId)) {
        if (update.message && update.message.chat && update.message.chat.type === 'private') {
            const hit = await RateLimit.hit(env.DB, `stranger_${from.id}`, 3600);
            if (hit <= 1) await tg.sendMessage(from.id, I18N.en.private_bot + '\n' + I18N.fa.private_bot);
        }
        if (update.callback_query) await tg.answerCallbackQuery(update.callback_query.id);
        return new Response('OK');
    }
    if (update.message && update.message.chat && update.message.chat.type !== 'private') return new Response('OK');

    const db = new Database(env.DB);
    const B = { env, ctx, db, tg, chatId: String(S.chatId), origin: url.origin, botToken: S.botToken, lang: await db.getUserLang(String(S.chatId)) };
    try {
        if (update.callback_query) await handleCallback(B, update.callback_query);
        else if (update.message) await handleMessage(B, update.message);
    } catch (e) { console.error('hook error', e && e.stack || e); }
    return new Response('OK');
}
