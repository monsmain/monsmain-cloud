// Content types, safe Content-Disposition and Telegram media kinds.
import { Telegram } from './telegram.js';

// ---------- Content types ----------
const MIME = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', avif: 'image/avif', bmp: 'image/bmp', ico: 'image/x-icon',
    svg: 'image/svg+xml', mp4: 'video/mp4', m4v: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime', mkv: 'video/x-matroska',
    mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg', m4a: 'audio/mp4', flac: 'audio/flac', aac: 'audio/aac', opus: 'audio/ogg',
    pdf: 'application/pdf', txt: 'text/plain; charset=utf-8', csv: 'text/csv; charset=utf-8', json: 'application/json', zip: 'application/zip',
    html: 'text/html', htm: 'text/html', xml: 'application/xml', js: 'text/javascript', css: 'text/css'
};

const ACTIVE_EXT = new Set(['html', 'htm', 'xhtml', 'svg', 'xml', 'js', 'mjs']);

export const guessType = (name) => MIME[(String(name).split('.').pop() || '').toLowerCase()] || 'application/octet-stream';

export const isActiveContent = (type, name) => /^(text\/html|application\/xhtml|image\/svg|text\/xml|application\/xml|text\/javascript|application\/javascript)/i.test(type || '') || ACTIVE_EXT.has((String(name).split('.').pop() || '').toLowerCase());

export function contentDisposition(name, attachment) {
    const ascii = String(name).replace(/[^\x20-\x7e]/g, '_').replace(/["\\;]/g, '') || 'file';
    const star = encodeURIComponent(name).replace(/['()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
    return `${attachment ? 'attachment' : 'inline'}; filename="${ascii}"; filename*=UTF-8''${star}`;
}

// ---------- Telegram media kinds ----------
export const mediaKind = (name, size) => {
    const ext = (String(name).split('.').pop() || '').toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return size <= 10 * 1024 * 1024 ? 'photo' : 'document'; // sendPhoto limit is 10MB
    if (ext === 'gif') return 'animation';
    if (['mp4', 'mov', 'm4v'].includes(ext)) return 'video';
    if (['mp3', 'm4a'].includes(ext)) return 'audio';
    return 'document';
};
