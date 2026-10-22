// Telegram Bot API client and input sanitizers.

// ---------- Telegram ----------
export class Telegram {
    constructor(token) { this.token = token; this.apiUrl = `https://api.telegram.org/bot${token}`; }
    async req(method, payload = {}) {
        const keys = Object.keys(payload).filter(k => payload[k] !== undefined && payload[k] !== null);
        try {
            let res;
            if (!keys.length) res = await fetch(`${this.apiUrl}/${method}`); // e.g. getMe: plain GET (an empty multipart body is not reliable)
            else { const fd = new FormData(); keys.forEach(k => fd.append(k, payload[k])); res = await fetch(`${this.apiUrl}/${method}`, { method: 'POST', body: fd }); }
            const data = await res.json();
            return data && typeof data === 'object' ? data : { ok: false, description: 'Bad response from Telegram' };
        } catch (e) { return { ok: false, description: String(e.message || e) }; }
    }
    getMe() { return this.req('getMe'); }
    setWebhook(url, secret) { return this.req('setWebhook', { url, secret_token: secret, allowed_updates: JSON.stringify(['message', 'callback_query']), drop_pending_updates: 'true' }); }
    sendMessage(chat_id, text, reply_markup = null) { const p = { chat_id, text, parse_mode: 'HTML', link_preview_options: JSON.stringify({ is_disabled: true }) }; if (reply_markup) p.reply_markup = JSON.stringify(reply_markup); return this.req('sendMessage', p); }
    editMessageText(chat_id, message_id, text, reply_markup = null) { const p = { chat_id, message_id, text, parse_mode: 'HTML', link_preview_options: JSON.stringify({ is_disabled: true }) }; if (reply_markup) p.reply_markup = JSON.stringify(reply_markup); return this.req('editMessageText', p); }
    answerCallbackQuery(callback_query_id, text = null, show_alert = false) { const p = { callback_query_id }; if (text) { p.text = text; p.show_alert = show_alert ? 'true' : 'false'; } return this.req('answerCallbackQuery', p); }
    sendDocument(chat_id, document) { return this.req('sendDocument', { chat_id, document }); }
    // Sends as photo / video / audio / animation so Telegram shows real media instead of a file
    sendMedia(kind, chat_id, file) {
        const method = { photo: 'sendPhoto', video: 'sendVideo', audio: 'sendAudio', animation: 'sendAnimation' }[kind];
        if (!method) return this.sendDocument(chat_id, file);
        const p = { chat_id, [kind]: file }; if (kind === 'video') p.supports_streaming = 'true';
        return this.req(method, p);
    }
    deleteMessage(chat_id, message_id) { return this.req('deleteMessage', { chat_id, message_id }); }
    setMyCommands(commands, language_code) { const p = { commands: JSON.stringify(commands) }; if (language_code) p.language_code = language_code; return this.req('setMyCommands', p); }
    getFile(file_id) { return this.req('getFile', { file_id }); }
}

export const TOKEN_RE = /^\d{6,14}:[A-Za-z0-9_-]{30,60}$/;

export const CHATID_RE = /^-?\d{5,15}$/;

// Pasted values often carry invisible direction marks (copying from RTL chats) and Persian/Arabic digits get typed on fa keyboards
export const stripInvisible = (s) => String(s ?? '').replace(/[\s\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/g, '');

export const asciiDigits = (s) => String(s ?? '').replace(/[\u06f0-\u06f9]/g, c => String(c.charCodeAt(0) - 0x06f0)).replace(/[\u0660-\u0669]/g, c => String(c.charCodeAt(0) - 0x0660)).replace(/[\u2212\u2013\u2014]/g, '-');
