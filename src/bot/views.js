import { PAGE_SIZE, generateMenu, trunc } from './helpers.js';
import { Telegram } from '../lib/telegram.js';

function filesView(fs, T, page) {
    const pages = Math.max(1, Math.ceil(fs.files.length / PAGE_SIZE));
    page = Math.min(Math.max(0, page), pages - 1);
    const kb = fs.files.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map(f => [
        { text: '📄 ' + trunc(f.name, 18), callback_data: `get_${f.id}` },
        f.shareId ? { text: '🚫', callback_data: `unshare_${f.id}` } : { text: '🔗', callback_data: `share_${f.id}` },
        { text: '🗑️', callback_data: `del_${f.id}` }
    ]);
    if (pages > 1) {
        const nav = [];
        if (page > 0) nav.push({ text: '⬅️', callback_data: `files_${page - 1}` });
        nav.push({ text: `${page + 1}/${pages}`, callback_data: 'noop' });
        if (page < pages - 1) nav.push({ text: '➡️', callback_data: `files_${page + 1}` });
        kb.push(nav);
    }
    kb.push([{ text: '🔙', callback_data: 'main_menu' }]);
    return { text: T.file_list, markup: { inline_keyboard: kb } };
}

function trashView(trash, T, page) {
    const items = [...trash.folders.map(f => ({ kind: 'fo', f })), ...trash.files.map(f => ({ kind: 'f', f }))];
    const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    page = Math.min(Math.max(0, page), pages - 1);
    const kb = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map(({ kind, f }) => [
        { text: (kind === 'fo' ? '📁 ' : '📄 ') + trunc(f.name, 18), callback_data: 'noop' },
        { text: '♻️', callback_data: `r${kind}_${f.id}` },
        { text: '❌', callback_data: `p${kind}_${f.id}` }
    ]);
    if (pages > 1) {
        const nav = [];
        if (page > 0) nav.push({ text: '⬅️', callback_data: `trash_${page - 1}` });
        nav.push({ text: `${page + 1}/${pages}`, callback_data: 'noop' });
        if (page < pages - 1) nav.push({ text: '➡️', callback_data: `trash_${page + 1}` });
        kb.push(nav);
    }
    kb.push([{ text: '🔙', callback_data: 'main_menu' }]);
    return { text: T.trash_list, markup: { inline_keyboard: kb } };
}

export async function showFiles(B, T, msgId, page = 0) {
    const fs = await B.db.getFS(B.chatId);
    if (fs.files.length === 0) return B.tg.editMessageText(B.chatId, msgId, T.no_files, generateMenu(B.lang));
    const v = filesView(fs, T, page);
    return B.tg.editMessageText(B.chatId, msgId, v.text, v.markup);
}

export async function showTrash(B, T, msgId, page = 0) {
    const trash = await B.db.getFS(B.chatId, { onlyTrash: true });
    if (trash.files.length === 0 && trash.folders.length === 0) return B.tg.editMessageText(B.chatId, msgId, T.trash_empty, generateMenu(B.lang));
    const v = trashView(trash, T, page);
    return B.tg.editMessageText(B.chatId, msgId, v.text, v.markup);
}
