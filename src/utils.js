// Small helpers: encoding, tokens, names, cookies, JSON / HTML responses.

export const enc = new TextEncoder();

export const dec = new TextDecoder();

export const Utils = {
    generateId: () => crypto.randomUUID().replace(/-/g, '').slice(0, 12),
    randomToken: (bytes = 32) => Utils.b64urlEncode(crypto.getRandomValues(new Uint8Array(bytes))),
    generateCode: () => { const n = crypto.getRandomValues(new Uint32Array(1))[0] % 900000; return String(100000 + n); },
    b64urlEncode: (buf) => {
        const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
        let s = ''; for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
        return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    },
    b64urlDecode: (str) => {
        const s = atob(str.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - str.length % 4) % 4));
        const out = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i); return out;
    },
    timingSafeEqual: (a, b) => {
        const x = enc.encode(String(a ?? '')), y = enc.encode(String(b ?? ''));
        let diff = x.length ^ y.length;
        const n = Math.max(x.length, y.length);
        for (let i = 0; i < n; i++) diff |= (x[i] || 0) ^ (y[i] || 0);
        return diff === 0;
    },
    formatBytes: (bytes) => {
        if (!bytes) return '0 MB';
        const k = 1024; const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), 3);
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    esc: (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    cleanName: (s, fallback = 'file') => {
        let n = String(s ?? '').replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, '').replace(/[\\/]/g, '_').trim();
        if (n.length > 150) { const dot = n.lastIndexOf('.'); const ext = dot > 0 && n.length - dot <= 12 ? n.slice(dot) : ''; n = n.slice(0, 150 - ext.length) + ext; }
        return n || fallback;
    },
    safeKeyName: (name) => {
        const n = String(name).replace(/[^a-zA-Z0-9.-]/g, '_').replace(/_+/g, '_');
        return n.length > 60 ? n.slice(-60) : n || 'file';
    },
    maskToken: (t) => t ? t.slice(0, 6) + '••••••••••' + t.slice(-4) : '',
    ip: (request) => request.headers.get('CF-Connecting-IP') || 'unknown',
    securityHeaders: () => ({ 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin', 'Cache-Control': 'no-store' }),
    jsonResp: (data, status = 200, extra = {}) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...Utils.securityHeaders(), ...extra } }),
    htmlResp: (html, status = 200, extra = {}) => new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=UTF-8', 'X-Frame-Options': 'DENY', 'Content-Security-Policy': "frame-ancestors 'none'", ...Utils.securityHeaders(), ...extra } }),
    redirect: (location, cookie) => { const h = new Headers({ Location: location, ...Utils.securityHeaders() }); if (cookie) h.append('Set-Cookie', cookie); return new Response(null, { status: 302, headers: h }); },
    parseCookies: (header) => { const out = {}; (header || '').split(';').forEach(p => { const i = p.indexOf('='); if (i > 0) out[p.slice(0, i).trim()] = p.slice(i + 1).trim(); }); return out; }
};
