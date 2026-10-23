import { ID_RE } from '../http.js';
import { serveFile } from '../lib/files.js';
import { Links } from '../security/session.js';

export async function fileRoutes(c) {
    const { request, env, ctx, url, method, path, passHash, botToken, chatId, sessionSecret, webhookSecret, setupToken, db, tg, isAuth, ip } = c;
    if ((method === 'GET' || method === 'HEAD') && /^\/(s|d|r2|download)\//.test(path)) {
        const finish = (r) => method === 'HEAD' ? (r.body && r.body.cancel().catch(() => {}), new Response(null, { status: r.status, headers: r.headers })) : r;
        const seg = path.split('/');
        const download = url.searchParams.has('dl');
        if (seg[1] === 's') {
            if (!/^[0-9a-f-]{36}$/.test(seg[2] || '')) return new Response('Not found', { status: 404 });
            const meta = await db.resolveShare(seg[2]);
            const file = meta && await db.findFile(meta.chatId, meta.fileId);
            if (!file || file.shareId !== seg[2]) return new Response('Not found', { status: 404 });
            return finish(await serveFile(request, env, botToken, file, { download, isPublic: true }));
        }
        if (seg[1] === 'd') {
            const file = ID_RE.test(seg[2] || '') && chatId ? await db.findFile(chatId, seg[2]) : null;
            if (!file || !(await Links.verify(sessionSecret, seg[2], url.searchParams.get('e'), url.searchParams.get('s')))) return new Response('Not found', { status: 404 });
            return finish(await serveFile(request, env, botToken, file, { download: true, isPublic: true }));
        }
        if (!isAuth) return new Response('Unauthorized', { status: 401 });
        let file = null;
        if (seg[1] === 'r2') { const key = decodeURIComponent(seg[2] || ''); file = await db.findFileBy(chatId, f => f.r2Key === key); }
        else { const id = decodeURIComponent(seg[2] || ''); file = await db.findFileBy(chatId, f => f.tgFileId === id || (f.url || '').includes('/download/' + id)); }
        if (!file) return new Response('Not found', { status: 404 });
        return finish(await serveFile(request, env, botToken, file, { download }));
    }
    return null;
}
