// Bot menu, paging and Telegram file picking.
import { I18N } from '../i18n/bot-messages.js';

// =====================================================================
//  Helpers used by the worker
// =====================================================================
export const PAGE_SIZE = 5;

export const trunc = (s, n) => { s = String(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; };

export function generateMenu(lang) {
    const T = I18N[lang];
    return { inline_keyboard: [
        [{ text: T.btn_files, callback_data: 'my_files' }],
        [{ text: T.btn_trash, callback_data: 'trash' }],
        [{ text: T.btn_pass, callback_data: 'change_pass' }, { text: T.btn_chatid, callback_data: 'my_chatid' }],
        [{ text: T.btn_lang, callback_data: lang === 'fa' ? 'lang_en' : 'lang_fa' }]
    ] };
}

export function pickTgFile(msg) {
    if (msg.document) return { fileId: msg.document.file_id, name: msg.document.file_name || `document_${msg.document.file_unique_id}`, size: msg.document.file_size || 0 };
    if (msg.video) return { fileId: msg.video.file_id, name: msg.video.file_name || `video_${msg.video.file_unique_id}.mp4`, size: msg.video.file_size || 0 };
    if (msg.audio) return { fileId: msg.audio.file_id, name: msg.audio.file_name || `${msg.audio.title || 'audio'}_${msg.audio.file_unique_id}.mp3`, size: msg.audio.file_size || 0 };
    if (msg.voice) return { fileId: msg.voice.file_id, name: `voice_${msg.voice.file_unique_id}.ogg`, size: msg.voice.file_size || 0 };
    if (msg.video_note) return { fileId: msg.video_note.file_id, name: `video_note_${msg.video_note.file_unique_id}.mp4`, size: msg.video_note.file_size || 0 };
    if (msg.animation) return { fileId: msg.animation.file_id, name: msg.animation.file_name || `animation_${msg.animation.file_unique_id}.mp4`, size: msg.animation.file_size || 0 };
    if (msg.photo && msg.photo.length) { const p = msg.photo[msg.photo.length - 1]; return { fileId: p.file_id, name: `photo_${p.file_unique_id}.jpg`, size: p.file_size || 0 }; }
    return null;
}
