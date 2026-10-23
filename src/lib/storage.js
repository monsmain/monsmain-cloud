import { CONFIG } from '../config.js';
import { Utils } from '../utils.js';

export const Storage = {
    makeKey: (name) => `r2_${Date.now()}_${Utils.generateId().slice(0, 6)}_${Utils.safeKeyName(name)}`,
    validKey: (key) => /^r2_\d{10,}_[a-f0-9]{6}_[A-Za-z0-9._-]{1,80}$/.test(String(key)),

    async putStream(bucket, key, stream, { contentType, onProgress, maxBytes } = {}) {
        const httpMetadata = { contentType: contentType || 'application/octet-stream' };
        const reader = stream.getReader();
        let buf = new Uint8Array(CONFIG.partSize), len = 0, total = 0, upload = null, partNo = 0;
        const parts = [];
        const flushPart = async () => {
            if (!upload) upload = await bucket.createMultipartUpload(key, { httpMetadata });
            parts.push(await upload.uploadPart(++partNo, buf.slice(0, len)));
            len = 0;
        };
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                total += value.byteLength;
                if (maxBytes && total > maxBytes) throw new Error('TOO_BIG');
                let off = 0;
                while (off < value.byteLength) {
                    const n = Math.min(buf.length - len, value.byteLength - off);
                    buf.set(value.subarray(off, off + n), len); len += n; off += n;
                    if (len === buf.length) await flushPart();
                }
                if (onProgress) onProgress(total);
            }
            if (!upload) await bucket.put(key, buf.slice(0, len), { httpMetadata });
            else { if (len > 0) await flushPart(); await upload.complete(parts); }
            return total;
        } catch (e) {
            try { if (upload) await upload.abort(); } catch {}
            try { reader.cancel(); } catch {}
            throw e;
        }
    }
};
