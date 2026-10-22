// Bot text / file / link message handler.
import { generateMenu, pickTgFile } from './helpers.js';
import { CONFIG } from '../config.js';
import { I18N } from '../i18n/bot-messages.js';
import { Password } from '../security/password.js';
import { isSafeRemoteUrl } from '../security/url-guard.js';
import { Utils } from '../utils.js';

export async function handleMessage(B, msg) {
    const { tg, db, chatId, env } = B;
    const T = I18N[B.lang];
    const text = (msg.text || '').trim();

    if (/^\/menu(@\w+)?$/.test(text)) return tg.sendMessage(chatId, T.main_menu, generateMenu(B.lang));
    if (/^\/start(@\w+)?(\s|$)/.test(text)) {
        const rawLang = await env.DB.get(`lang_${chatId}`);
        if (!rawLang) return tg.sendMessage(chatId, '🌐 Please choose your language / زبان را انتخاب کنید:', { inline_keyboard: [[{ text: 'فارسی', callback_data: 'lang_fa' }, { text: 'English', callback_data: 'lang_en' }]] });
        return tg.sendMessage(chatId, `${T.welcome}\n\n${T.main_menu}`, generateMenu(B.lang));
    }

    if (/^\/setpass(\s|$)/.test(text)) {
        const newPass = text.slice(8).trim();
        tg.deleteMessage(chatId, msg.message_id).catch(() => {}); // remove the plain-text password from the chat
        if (newPass.length < CONFIG.minPassword) return tg.sendMessage(chatId, T.pass_short);
        await env.DB.put('site_password_hash', await Password.hash(newPass));
        await env.DB.put('session_secret', Utils.randomToken()); // signs out every web session
        return tg.sendMessage(chatId, T.pass_changed);
    }

    const picked = pickTgFile(msg);
    let pending = null, label = '';
    if (picked) {
        if (picked.size > CONFIG.maxTgSize) return tg.sendMessage(chatId, T.err_size_20);
        pending = { type: 'tg', fileId: picked.fileId, name: Utils.cleanName(picked.name), size: picked.size, msgId: msg.message_id };
        label = `${pending.name} (${Utils.formatBytes(pending.size)})`;
    } else if (/^https?:\/\/\S+$/i.test(text)) {
        if (!isSafeRemoteUrl(text)) return tg.sendMessage(chatId, T.err_invalid_url);
        pending = { type: 'url', url: text };
        label = text;
    }

    if (pending) {
        await env.DB.put(`pending_${chatId}`, JSON.stringify(pending), { expirationTtl: 600 });
        return tg.sendMessage(chatId, `${T.confirm_upload}\n\n📦 ${Utils.esc(label)}`, { inline_keyboard: [[{ text: T.btn_yes, callback_data: 'up_yes' }, { text: T.btn_no, callback_data: 'up_no' }]] });
    }
    return tg.sendMessage(chatId, T.main_menu, generateMenu(B.lang));
}
