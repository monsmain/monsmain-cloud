// Password hashing (PBKDF2-SHA256 with a random salt).
import { CONFIG } from '../config.js';
import { Utils, enc } from '../utils.js';

// ---------- Password hashing (PBKDF2, salted) ----------
export const Password = {
    async derive(password, salt, iterations) {
        const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
        return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256));
    },
    async hash(password) {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const bits = await this.derive(password, salt, CONFIG.pbkdf2Iter);
        return `pbkdf2$${CONFIG.pbkdf2Iter}$${Utils.b64urlEncode(salt)}$${Utils.b64urlEncode(bits)}`;
    },
    async legacyHash(password) { // SHA-256 hex (panels created before v2)
        const buf = await crypto.subtle.digest('SHA-256', enc.encode(password));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    },
    async verify(password, stored) {
        if (!stored) return false;
        if (stored.startsWith('pbkdf2$')) {
            const [, iter, salt, hash] = stored.split('$');
            const bits = await this.derive(password, Utils.b64urlDecode(salt), parseInt(iter, 10));
            return Utils.timingSafeEqual(Utils.b64urlEncode(bits), hash);
        }
        return Utils.timingSafeEqual(await this.legacyHash(password), stored);
    },
    needsUpgrade: (stored) => !stored.startsWith('pbkdf2$')
};
