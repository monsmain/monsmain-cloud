// Signed session cookies and signed temporary download links.
import { CONFIG } from '../config.js';
import { Utils, dec, enc } from '../utils.js';

// ---------- Signed sessions (HMAC) ----------
export const Session = {
    COOKIE: 'pc_sid',
    async hmac(secret, data) {
        const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
        return Utils.b64urlEncode(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
    },
    async create(secret) {
        const payload = Utils.b64urlEncode(enc.encode(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + CONFIG.sessionTtl })));
        return `${payload}.${await this.hmac(secret, payload)}`;
    },
    async verify(token, secret) {
        if (!token || !secret) return false;
        const [payload, sig] = token.split('.');
        if (!payload || !sig) return false;
        if (!Utils.timingSafeEqual(await this.hmac(secret, payload), sig)) return false;
        try { return JSON.parse(dec.decode(Utils.b64urlDecode(payload))).exp > Date.now() / 1000; } catch { return false; }
    },
    cookie: (value) => `${Session.COOKIE}=${value}; Path=/; Max-Age=${CONFIG.sessionTtl}; HttpOnly; Secure; SameSite=Lax`,
    clearCookie: () => `${Session.COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`
};

// ---------- Signed temporary download links (used by the bot) ----------
export const Links = {
    async sign(secret, fileId, exp) { return Session.hmac(secret, `dl.${fileId}.${exp}`); },
    async create(secret, origin, fileId) {
        const exp = Math.floor(Date.now() / 1000) + CONFIG.signedLinkTtl;
        return `${origin}/d/${fileId}?e=${exp}&s=${await this.sign(secret, fileId, exp)}`;
    },
    async verify(secret, fileId, exp, sig) {
        if (!secret || !exp || !sig || Number(exp) < Date.now() / 1000) return false;
        return Utils.timingSafeEqual(await this.sign(secret, fileId, exp), sig);
    }
};
