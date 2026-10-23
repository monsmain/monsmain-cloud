import { CONFIG } from '../config.js';

export const Usage = {
    async limitGb(kv) { const v = await kv.get('r2_limit_gb'); const n = v === null ? CONFIG.r2LimitGbDefault : parseFloat(v); return Number.isFinite(n) && n >= 0 ? n : CONFIG.r2LimitGbDefault; },
    async listBucket(bucket) {
        let cursor, bytes = 0, objects = 0, pages = 0;
        do { const r = await bucket.list({ limit: 1000, cursor }); for (const o of r.objects) { bytes += o.size; objects++; } cursor = r.truncated ? r.cursor : undefined; } while (cursor && ++pages < 50);
        return { bytes, objects, partial: !!cursor };
    },
    async compute(env, db, chatId, { fresh = false } = {}) {
        const fs = await db.getFS(chatId, { includeTrash: true });
        const sum = (arr) => arr.reduce((a, f) => a + (f.size || 0), 0);
        const r2f = fs.files.filter(f => f.provider === 'r2'), tgf = fs.files.filter(f => f.provider === 'tg');
        const limitGb = await this.limitGb(env.DB);
        const out = { r2: { enabled: !!env.BUCKET, bytes: sum(r2f), objects: r2f.length, source: 'records', at: Date.now(), limitGb, trashBytes: sum(r2f.filter(f => f.deletedAt)) }, tg: { bytes: sum(tgf), count: tgf.length } };
        if (env.BUCKET) {
            let cached = null; try { cached = JSON.parse(await env.DB.get('r2_usage') || 'null'); } catch {}
            if (!fresh && cached && Date.now() - cached.at < CONFIG.usageCacheSec * 1000) Object.assign(out.r2, { bytes: cached.bytes, objects: cached.objects, source: 'bucket', at: cached.at });
            else { try { const u = await this.listBucket(env.BUCKET); Object.assign(out.r2, { bytes: u.bytes, objects: u.objects, source: 'bucket', partial: u.partial }); await env.DB.put('r2_usage', JSON.stringify({ bytes: u.bytes, objects: u.objects, at: out.r2.at })); } catch (e) { console.error('usage list failed', e && e.message); } }
        }
        out.r2.percent = limitGb > 0 ? Math.round(out.r2.bytes / (limitGb * 1e9) * 1000) / 10 : null;
        return out;
    },
    level: (pct) => pct === null ? 0 : [...CONFIG.usageAlertLevels].reverse().find(l => pct >= l) || 0
};
