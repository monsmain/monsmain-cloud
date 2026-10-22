// Remote URL downloads streamed into R2.
import { guessType } from './mime.js';
import { Storage } from './storage.js';
import { isSafeRemoteUrl } from '../security/url-guard.js';
import { Utils } from '../utils.js';

export function deriveName(res, fileUrl) {
    const cd = res.headers.get('content-disposition') || '';
    let name = null, m = cd.match(/filename\*=(?:UTF-8'')?([^;]+)/i);
    if (m) { try { name = decodeURIComponent(m[1].trim().replace(/^"|"$/g, '')); } catch {} }
    if (!name) { m = cd.match(/filename="?([^";]+)"?/i); if (m) name = m[1]; }
    if (!name) { try { name = decodeURIComponent(new URL(fileUrl).pathname.split('/').pop() || ''); } catch {} }
    name = Utils.cleanName(name, 'remote_file.bin');
    return name.includes('.') ? name : name + '.bin';
}

// Streams a remote file into R2 (no reliance on content-length, bounded memory)
export async function remoteToR2(env, fileUrl, { maxBytes, onProgress } = {}) {
    if (!isSafeRemoteUrl(fileUrl)) throw new Error('INVALID_URL');
    const res = await fetch(fileUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, redirect: 'follow' });
    if (!res.ok || !res.body) throw new Error('FETCH_FAILED');
    if (res.url && !isSafeRemoteUrl(res.url)) { res.body.cancel(); throw new Error('INVALID_URL'); }
    const ct = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (ct === 'text/html') { res.body.cancel(); throw new Error('IS_HTML'); }
    const total = parseInt(res.headers.get('content-length') || '0', 10);
    if (maxBytes && total > maxBytes) { res.body.cancel(); throw new Error('TOO_BIG'); }
    const name = deriveName(res, fileUrl);
    const key = Storage.makeKey(name);
    const contentType = ct && ct !== 'application/octet-stream' ? ct : guessType(name);
    const size = await Storage.putStream(env.BUCKET, key, res.body, { contentType, maxBytes, onProgress: (n) => onProgress && onProgress(n, total) });
    return { name, size, key, total };
}
