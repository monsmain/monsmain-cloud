import { contentDisposition, guessType, isActiveContent } from './mime.js';
import { Telegram } from './telegram.js';

export async function purgeStorage(B, files) {
    await Promise.allSettled((files || []).map(async (f) => {
        if (f.provider === 'r2' && B.env.BUCKET && f.r2Key) await B.env.BUCKET.delete(f.r2Key);
        else if (f.provider === 'tg' && f.messageId && B.tg) await B.tg.deleteMessage(B.chatId, f.messageId);
    }));
}

export async function serveFile(request, env, botToken, file, { download = false, isPublic = false } = {}) {
    const range = request.headers.get('Range');
    let body, status = 200;
    const headers = new Headers();
    let type = '';

    if (file.provider === 'r2') {
        if (!env.BUCKET || !file.r2Key) return new Response('Not found', { status: 404 });
        let obj;
        try { obj = await env.BUCKET.get(file.r2Key, range ? { range: request.headers } : undefined); } catch { obj = await env.BUCKET.get(file.r2Key); }
        if (!obj) return new Response('Not found', { status: 404 });
        obj.writeHttpMetadata(headers);
        headers.set('etag', obj.httpEtag);
        type = headers.get('content-type') || '';
        if (range && obj.range) {
            const r = obj.range, size = obj.size; let start, len;
            if (r.suffix !== undefined) { len = Math.min(r.suffix, size); start = size - len; } else { start = r.offset ?? 0; len = r.length ?? (size - start); }
            headers.set('Content-Range', `bytes ${start}-${start + len - 1}/${size}`); headers.set('Content-Length', String(len)); status = 206;
        } else headers.set('Content-Length', String(obj.size));
        body = obj.body;
    } else if (file.provider === 'tg') {
        if (!botToken) return new Response('Telegram not configured', { status: 500 });
        const tgId = file.tgFileId || ((file.url || '').match(/\/download\/([^/]+)/) || [])[1];
        const info = tgId ? await new Telegram(botToken).getFile(tgId) : null;
        if (!info || !info.ok) return new Response('Not found', { status: 404 });
        const up = await fetch(`https://api.telegram.org/file/bot${botToken}/${info.result.file_path}`, { headers: range ? { Range: range } : {} });
        if (!up.ok && up.status !== 206) return new Response('Upstream error', { status: 502 });
        status = up.status; body = up.body;
        ['content-length', 'content-range', 'content-type'].forEach(h => { const v = up.headers.get(h); if (v) headers.set(h, v); });
        type = headers.get('content-type') || '';
    } else return new Response('Not found', { status: 404 });

    if (!type || type.startsWith('application/octet-stream')) type = guessType(file.name);
    headers.set('Content-Type', type);
    headers.set('Accept-Ranges', 'bytes');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'no-referrer');
    headers.set('Cache-Control', isPublic ? 'no-store' : 'private, max-age=86400');
    const active = isActiveContent(type, file.name);
    headers.set('Content-Disposition', contentDisposition(file.name, download || active));
    if (active) headers.set('Content-Security-Policy', "sandbox; default-src 'none'");
    return new Response(body, { status, headers });
}
