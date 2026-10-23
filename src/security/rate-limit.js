export const RateLimit = {
    async count(kv, key) { return parseInt(await kv.get(`rl_${key}`) || '0', 10); },
    async hit(kv, key, windowSec) { const n = (await this.count(kv, key)) + 1; await kv.put(`rl_${key}`, String(n), { expirationTtl: Math.max(60, windowSec) }); return n; },
    async clear(kv, key) { await kv.delete(`rl_${key}`); }
};
