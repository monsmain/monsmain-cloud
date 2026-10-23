import { pickTgFile } from '../bot/helpers.js';
import { ensureWebhook } from '../bot/webhook.js';
import { CONFIG, VERSION } from '../config.js';
import { ID_RE, readJson } from '../http.js';
import { purgeStorage } from '../lib/files.js';
import { checkUsageAlert, maybeCleanup } from '../lib/maintenance.js';
import { guessType, mediaKind } from '../lib/mime.js';
import { deriveName, remoteToR2 } from '../lib/remote.js';
import { Storage } from '../lib/storage.js';
import { CHATID_RE, TOKEN_RE, Telegram, asciiDigits, stripInvisible } from '../lib/telegram.js';
import { Usage } from '../lib/usage.js';
import { isSafeRemoteUrl } from '../security/url-guard.js';
import { Utils, enc } from '../utils.js';

export async function apiRoutes(c) {
    const { request, env, ctx, url, method, path, passHash, botToken, chatId, sessionSecret, webhookSecret, setupToken, db, tg, isAuth, ip } = c;
    if (path.startsWith('/api/')) {
        if (!isAuth) return Utils.jsonResp({ error: 'UNAUTHORIZED' }, 401);
        const json = Utils.jsonResp;
        const B = { env, ctx, db, tg, chatId, botToken };

        if (method === 'GET' && path === '/api/config') return json({ botToken: Utils.maskToken(botToken), chatId, r2: !!env.BUCKET, version: VERSION, r2LimitGb: await Usage.limitGb(env.DB), trashDays: CONFIG.trashDays });
        if (method === 'POST' && path === '/api/config') {
            const body = await readJson(request);
            const newToken = stripInvisible(body.botToken), newChat = asciiDigits(stripInvisible(body.chatId));
            const changeToken = newToken && !newToken.includes('•') && newToken !== botToken;
            if (newChat && !CHATID_RE.test(newChat)) return json({ error: 'BAD_CHAT' }, 400);
            if (changeToken) {
                if (!TOKEN_RE.test(newToken)) return json({ error: 'BAD_TOKEN' }, 400);
                if (!(await new Telegram(newToken).getMe()).ok) return json({ error: 'BAD_TOKEN' }, 400);
                if (!(await ensureWebhook(env, newToken, url.origin)).ok) return json({ error: 'WEBHOOK_FAILED' }, 400);
                await env.DB.put('tg_bot_token', newToken);
            }
            if (newChat) await env.DB.put('tg_chat_id', newChat);
            if (body.r2LimitGb !== undefined && body.r2LimitGb !== '') { const g = Number(body.r2LimitGb); if (!(g >= 0 && g <= 100000)) return json({ error: 'BAD_REQUEST' }, 400); await env.DB.put('r2_limit_gb', String(g)); await env.DB.delete('usage_alert'); }
            return json({ success: true });
        }

        if (method === 'GET' && path === '/api/fs') return json(await db.getFS(chatId));
        if (method === 'GET' && path === '/api/trash') { await maybeCleanup(env); return json({ ...(await db.getFS(chatId, { onlyTrash: true })), retentionDays: CONFIG.trashDays }); }
        if (method === 'GET' && path === '/api/usage') return json(await Usage.compute(env, db, chatId, { fresh: url.searchParams.get('fresh') === '1' }));

        if (method === 'POST' && path === '/api/folders') {
            const name = Utils.cleanName((await readJson(request)).name, '');
            if (!name) return json({ error: 'BAD_NAME' }, 400);
            return json(await db.addFolder(chatId, name));
        }
        let m = path.match(/^\/api\/folders\/([A-Za-z0-9_]+)(?:\/(restore|purge))?$/);
        if (m) {
            if (method === 'DELETE' && !m[2]) return json({ success: await db.deleteFolder(chatId, m[1]) });
            if (method === 'POST' && m[2] === 'restore') return json({ success: await db.restoreFolder(chatId, m[1]) });
            if (method === 'DELETE' && m[2] === 'purge') { await purgeStorage(B, await db.purgeFolder(chatId, m[1])); return json({ success: true }); }
        }
        if (method === 'POST' && path === '/api/files/bulk') {
            const b = await readJson(request);
            const ids = Array.isArray(b.ids) ? b.ids.filter(x => typeof x === 'string' && ID_RE.test(x)).slice(0, 500) : [];
            if (!ids.length) return json({ error: 'BAD_REQUEST' }, 400);
            if (b.action === 'delete') return json({ success: true, count: await db.deleteFiles(chatId, ids) });
            if (b.action === 'move') return json({ success: true, count: await db.moveFiles(chatId, ids, String(b.folderId || 'root')) });
            return json({ error: 'BAD_REQUEST' }, 400);
        }
        m = path.match(/^\/api\/files\/([A-Za-z0-9_]+)(?:\/(move|restore|purge|share))?$/);
        if (m) {
            const id = m[1];
            if (method === 'DELETE' && !m[2]) return json({ success: await db.deleteFile(chatId, id) });
            if (method === 'PUT' && m[2] === 'move') return json({ success: await db.moveFile(chatId, id, String((await readJson(request)).folderId || 'root')) });
            if (method === 'POST' && m[2] === 'restore') return json({ success: await db.restoreFile(chatId, id) });
            if (method === 'DELETE' && m[2] === 'purge') { const removed = await db.purgeFile(chatId, id); if (removed) await purgeStorage(B, [removed]); return json({ success: !!removed }); }
            if (method === 'POST' && m[2] === 'share') { const sid = await db.shareFile(chatId, id); return json({ success: !!sid, url: sid ? `${url.origin}/s/${sid}` : null }); }
            if (method === 'DELETE' && m[2] === 'share') return json({ success: await db.revokeShare(chatId, id) });
        }

        if (method === 'POST' && path === '/api/check-url') {
            const { url: fileUrl } = await readJson(request);
            if (!isSafeRemoteUrl(fileUrl)) return json({ error: 'INVALID_URL' }, 400);
            try {
                let res = await fetch(fileUrl, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' }, redirect: 'follow' });
                if (!res.ok || res.status === 405) res = await fetch(fileUrl, { headers: { Range: 'bytes=0-0', 'User-Agent': 'Mozilla/5.0' }, redirect: 'follow' });
                if (res.body) res.body.cancel().catch(() => {});
                if (!res.ok) return json({ error: 'INVALID_URL' }, 400);
                if (res.url && !isSafeRemoteUrl(res.url)) return json({ error: 'INVALID_URL' }, 400);
                const type = res.headers.get('content-type') || '';
                if (type.includes('text/html')) return json({ error: 'IS_HTML' }, 400);
                const size = parseInt(res.headers.get('content-range')?.split('/')[1] || res.headers.get('content-length') || '0', 10) || 0;
                return json({ ok: true, name: deriveName(res, fileUrl), size, type });
            } catch { return json({ error: 'INVALID_URL' }, 400); }
        }

        if (method === 'POST' && path === '/api/upload-url') {
            if (!env.BUCKET) return json({ error: 'R2_NOT_CONFIGURED' }, 400);
            const { url: fileUrl, folderId } = await readJson(request);
            if (!isSafeRemoteUrl(fileUrl)) return json({ error: 'INVALID_URL' }, 400);
            const { readable, writable } = new TransformStream();
            const writer = writable.getWriter();
            const send = (o) => writer.write(enc.encode(JSON.stringify(o) + '\n')).catch(() => {});
            ctx.waitUntil((async () => {
                let last = 0;
                try {
                    const r = await remoteToR2(env, fileUrl, { maxBytes: CONFIG.maxR2Size, onProgress: (p, t) => { const now = Date.now(); if (now - last > 250) { last = now; send({ p, t }); } } });
                    await db.addFile(chatId, { id: 'f_' + Utils.generateId(), name: r.name, size: r.size, url: `/r2/${r.key}`, date: Date.now(), folderId: folderId === 'root' ? null : folderId, provider: 'r2', r2Key: r.key });
                    await send({ done: true });
                    ctx.waitUntil(checkUsageAlert(env, db, chatId, tg));
                } catch (e) {
                    const code = String(e.message || e); await send({ error: ['TOO_BIG', 'IS_HTML', 'INVALID_URL', 'FETCH_FAILED'].includes(code) ? code : 'UPLOAD_FAILED' });
                } finally { await writer.close().catch(() => {}); }
            })());
            return new Response(readable, { headers: { 'Content-Type': 'application/x-ndjson', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
        }

        if (path.startsWith('/api/r2/')) {
            if (!env.BUCKET) return json({ error: 'R2_NOT_CONFIGURED' }, 400);
            if (method === 'POST' && path === '/api/r2/create') {
                const b = await readJson(request);
                const name = Utils.cleanName(b.name, '');
                if (!name || !(b.size > 0) || b.size > CONFIG.maxR2Size) return json({ error: 'BAD_FILE' }, 400);
                const key = Storage.makeKey(name);
                const up = await env.BUCKET.createMultipartUpload(key, { httpMetadata: { contentType: guessType(name) !== 'application/octet-stream' ? guessType(name) : (String(b.type || '').slice(0, 100) || 'application/octet-stream') } });
                return json({ key, uploadId: up.uploadId });
            }
            if (method === 'PUT' && path === '/api/r2/part') {
                const key = url.searchParams.get('key'), uploadId = url.searchParams.get('uploadId'), n = parseInt(url.searchParams.get('n'), 10);
                if (!Storage.validKey(key) || !uploadId || !(n >= 1 && n <= 10000)) return json({ error: 'BAD_REQUEST' }, 400);
                const buf = await request.arrayBuffer();
                if (buf.byteLength === 0 || buf.byteLength > CONFIG.partSize) return json({ error: 'BAD_PART' }, 400);
                const part = await env.BUCKET.resumeMultipartUpload(key, uploadId).uploadPart(n, buf);
                return json({ partNumber: part.partNumber, etag: part.etag });
            }
            if (method === 'POST' && path === '/api/r2/complete') {
                const b = await readJson(request);
                if (!Storage.validKey(b.key) || !b.uploadId || !Array.isArray(b.parts) || !b.parts.length || b.parts.length > 10000) return json({ error: 'BAD_REQUEST' }, 400);
                const parts = b.parts.map(p => ({ partNumber: Number(p.partNumber), etag: String(p.etag) })).sort((x, y) => x.partNumber - y.partNumber);
                const obj = await env.BUCKET.resumeMultipartUpload(b.key, b.uploadId).complete(parts);
                const file = await db.addFile(chatId, { id: 'f_' + Utils.generateId(), name: Utils.cleanName(b.name), size: obj.size, url: `/r2/${b.key}`, date: Date.now(), folderId: b.folderId === 'root' ? null : String(b.folderId || ''), provider: 'r2', r2Key: b.key });
                ctx.waitUntil(checkUsageAlert(env, db, chatId, tg));
                return json({ success: true, id: file.id });
            }
            if (method === 'POST' && path === '/api/r2/abort') {
                const b = await readJson(request);
                if (Storage.validKey(b.key) && b.uploadId) await env.BUCKET.resumeMultipartUpload(b.key, b.uploadId).abort().catch(() => {});
                return json({ success: true });
            }
        }

        if (method === 'POST' && path === '/api/upload') {
            if (!tg || !chatId) return json({ error: 'TG_NOT_CONFIGURED' }, 400);
            if (parseInt(request.headers.get('content-length') || '0', 10) > CONFIG.maxTgSize + 1024 * 1024) return json({ error: 'TOO_BIG_TG' }, 413);
            const fd = await request.formData(); const file = fd.get('file'); const folderId = fd.get('folderId');
            if (!file || typeof file === 'string') return json({ error: 'BAD_FILE' }, 400);
            if (file.size > CONFIG.maxTgSize) return json({ error: 'TOO_BIG_TG' }, 413);
            const asMedia = fd.get('asMedia') !== '0';
            let kind = asMedia ? mediaKind(file.name, file.size) : 'document';
            let res = await tg.sendMedia(kind, chatId, file);
            if (!(res.ok && res.result && pickTgFile(res.result)) && kind !== 'document') { kind = 'document'; res = await tg.sendDocument(chatId, file); }
            const picked = res.ok && res.result ? pickTgFile(res.result) : null;
            if (!picked) return json({ error: 'UPLOAD_FAILED' }, 502);
            const info = await tg.getFile(picked.fileId);
            if (!info.ok) return json({ error: 'UPLOAD_FAILED' }, 502);
            const name = kind === 'photo' ? Utils.cleanName(file.name).replace(/\.[^.]+$/, '') + '.jpg' : file.name;
            await db.addFile(chatId, { id: 'f_' + Utils.generateId(), name, size: kind === 'photo' ? (picked.size || file.size) : file.size, url: `/download/${picked.fileId}/${info.result.file_path}`, date: Date.now(), folderId: folderId === 'root' ? null : String(folderId || ''), provider: 'tg', tgFileId: picked.fileId, mediaKind: kind, messageId: res.result.message_id });
            return json({ success: true, provider: 'tg', kind });
        }
        return json({ error: 'NOT_FOUND' }, 404);
    }
    return null;
}
