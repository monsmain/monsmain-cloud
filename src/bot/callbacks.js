// Bot button handlers and upload confirmation.
import { generateMenu } from './helpers.js';
import { showFiles, showTrash } from './views.js';
import { CONFIG } from '../config.js';
import { ID_RE } from '../http.js';
import { I18N } from '../i18n/bot-messages.js';
import { purgeStorage } from '../lib/files.js';
import { checkUsageAlert } from '../lib/maintenance.js';
import { remoteToR2 } from '../lib/remote.js';
import { Links } from '../security/session.js';
import { Utils } from '../utils.js';

export async function handleCallback(B, cb) {
    const { tg, db, chatId, env, ctx } = B;
    const data = cb.data || '';
    const msgId = cb.message && cb.message.message_id;
    const T = I18N[B.lang];
    const ack = (text, alert = false) => tg.answerCallbackQuery(cb.id, text, alert);
    if (!msgId) return ack();

    // exact matches first
    if (data === 'noop') return ack();
    if (data === 'main_menu') { await ack(); return tg.editMessageText(chatId, msgId, T.main_menu, generateMenu(B.lang)); }
    if (data === 'my_chatid') { await ack(); return tg.sendMessage(chatId, T.chat_id_msg.replace('{id}', chatId)); }
    if (data === 'change_pass') { await ack(); return tg.sendMessage(chatId, T.pass_help); }
    if (data === 'my_files') { await ack(); return showFiles(B, T, msgId, 0); }
    if (data === 'trash') { await ack(); return showTrash(B, T, msgId, 0); }
    if (data === 'lang_fa' || data === 'lang_en') {
        const newLang = data === 'lang_fa' ? 'fa' : 'en'; await db.setUserLang(chatId, newLang);
        await ack(I18N[newLang].lang_changed, true);
        return tg.editMessageText(chatId, msgId, I18N[newLang].main_menu, generateMenu(newLang));
    }
    if (data === 'up_no') { await env.DB.delete(`pending_${chatId}`); await ack(); return tg.editMessageText(chatId, msgId, T.cancelled); }
    if (data === 'up_yes') return handleUploadConfirm(B, cb, msgId, T);

    const m = data.match(/^([a-z]+)_(.+)$/);
    if (!m) return ack();
    const [, action, arg] = m;

    switch (action) {
        case 'files': await ack(); return showFiles(B, T, msgId, parseInt(arg, 10) || 0);
        case 'trash': await ack(); return showTrash(B, T, msgId, parseInt(arg, 10) || 0);
        case 'get': {
            const f = ID_RE.test(arg) ? await db.findFile(chatId, arg) : null;
            if (!f) return ack(T.not_found, true);
            await ack();
            if (f.provider === 'tg' && f.tgFileId && (f.size || 0) <= CONFIG.maxTgSize) { const r = await tg.sendDocument(chatId, f.tgFileId); if (r.ok) return; }
            const secret = await env.DB.get('session_secret');
            return tg.sendMessage(chatId, `${T.temp_link}\n${await Links.create(secret, B.origin, f.id)}`);
        }
        case 'share': {
            const sid = ID_RE.test(arg) ? await db.shareFile(chatId, arg) : null;
            if (!sid) return ack(T.not_found, true);
            await ack(); await tg.sendMessage(chatId, `${T.shared}\n${B.origin}/s/${sid}`);
            return showFiles(B, T, msgId, 0);
        }
        case 'unshare': {
            if (ID_RE.test(arg)) await db.revokeShare(chatId, arg);
            await ack(T.unshared); return showFiles(B, T, msgId, 0);
        }
        case 'del': {
            if (ID_RE.test(arg)) await db.deleteFile(chatId, arg);
            await ack(T.deleted); return showFiles(B, T, msgId, 0);
        }
        case 'rf': case 'rfo': {
            if (ID_RE.test(arg)) { if (action === 'rf') await db.restoreFile(chatId, arg); else await db.restoreFolder(chatId, arg); }
            await ack(T.restored, true); return showTrash(B, T, msgId, 0);
        }
        case 'pf': case 'pfo': { // ask for confirmation before permanent deletion
            const fs = await db.getFS(chatId, { includeTrash: true });
            const item = (action === 'pf' ? fs.files : fs.folders).find(x => x.id === arg && x.deletedAt);
            if (!item) return ack(T.not_found, true);
            await ack();
            return tg.editMessageText(chatId, msgId, `${action === 'pf' ? T.confirm_purge : T.confirm_purge_folder}\n\n${action === 'pf' ? '📄' : '📁'} <b>${Utils.esc(item.name)}</b>`, {
                inline_keyboard: [[{ text: T.btn_purge_yes, callback_data: `${action}y_${arg}` }], [{ text: T.btn_cancel, callback_data: 'trash' }]]
            });
        }
        case 'pfy': case 'pfoy': {
            if (ID_RE.test(arg)) {
                if (action === 'pfy') { const removed = await db.purgeFile(chatId, arg); if (removed) await purgeStorage(B, [removed]); }
                else await purgeStorage(B, await db.purgeFolder(chatId, arg));
            }
            await ack(T.purged, true); return showTrash(B, T, msgId, 0);
        }
    }
    return ack();
}

async function handleUploadConfirm(B, cb, msgId, T) {
    const { tg, db, chatId, env, ctx } = B;
    const pendingStr = await env.DB.get(`pending_${chatId}`);
    if (!pendingStr) { await tg.answerCallbackQuery(cb.id); return; }
    const pending = JSON.parse(pendingStr);
    await env.DB.delete(`pending_${chatId}`);
    await tg.answerCallbackQuery(cb.id);

    if (pending.type === 'tg') {
        await tg.editMessageText(chatId, msgId, T.uploading);
        const info = await tg.getFile(pending.fileId);
        if (!info.ok) return tg.editMessageText(chatId, msgId, `❌ ${Utils.esc(info.description || 'getFile failed')}`);
        await db.addFile(chatId, { id: 'f_' + Utils.generateId(), name: pending.name, size: pending.size, url: `/download/${pending.fileId}/${info.result.file_path}`, date: Date.now(), folderId: null, provider: 'tg', tgFileId: pending.fileId, messageId: pending.msgId || null });
        return tg.editMessageText(chatId, msgId, T.upload_success, generateMenu(B.lang));
    }

    if (pending.type === 'url') {
        if (!env.BUCKET) return tg.editMessageText(chatId, msgId, T.err_r2);
        await tg.editMessageText(chatId, msgId, T.url_uploading);
        ctx.waitUntil((async () => {
            let lastUpdate = Date.now();
            try {
                const r = await remoteToR2(env, pending.url, {
                    maxBytes: CONFIG.botUrlMax,
                    onProgress: (done, total) => {
                        const now = Date.now(); if (now - lastUpdate < 3000) return; lastUpdate = now;
                        const pct = total ? Math.min(99, Math.round(done / total * 100)) : null;
                        const bar = pct === null ? '' : `\n\n${'🟩'.repeat(Math.round(pct / 10))}${'⬜'.repeat(10 - Math.round(pct / 10))} ${pct}%`;
                        tg.editMessageText(chatId, msgId, `${T.url_uploading}${bar}\n📥 ${Utils.formatBytes(done)}${total ? ' / ' + Utils.formatBytes(total) : ' ' + T.unknown_size}`).catch(() => {});
                    }
                });
                await db.addFile(chatId, { id: 'f_' + Utils.generateId(), name: r.name, size: r.size, url: `/r2/${r.key}`, date: Date.now(), folderId: null, provider: 'r2', r2Key: r.key });
                await tg.editMessageText(chatId, msgId, T.upload_success, generateMenu(B.lang));
                await checkUsageAlert(env, db, chatId, tg);
            } catch (e) {
                const code = String(e.message || e);
                const msg = code === 'IS_HTML' ? T.err_html : code === 'INVALID_URL' ? T.err_invalid_url : code === 'TOO_BIG' ? T.err_big_bot : `${T.err_fetch}: ${Utils.esc(code)}`;
                await tg.editMessageText(chatId, msgId, msg, generateMenu(B.lang));
            }
        })());
    }
}
