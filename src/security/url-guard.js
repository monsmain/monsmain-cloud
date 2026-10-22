// SSRF guard for remote-URL uploads.

// ---------- Remote URL safety (basic SSRF guard) ----------
export function isSafeRemoteUrl(raw) {
    let u; try { u = new URL(raw); } catch { return false; }
    if (!['http:', 'https:'].includes(u.protocol)) return false;
    const h = u.hostname.toLowerCase();
    if (h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local') || h.endsWith('.internal')) return false;
    if (h.startsWith('[')) { const v6 = h.slice(1, -1); if (v6 === '::1' || v6 === '::' || /^f[cd]/.test(v6) || v6.startsWith('fe80') || v6.startsWith('::ffff:')) return false; }
    const m = h.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
    if (m) { const [a, b] = [Number(m[1]), Number(m[2])]; if (a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a >= 224) return false; }
    return true;
}
