export const readJson = async (request) => { try { return await request.json(); } catch { return {}; } };

export const ID_RE = /^[A-Za-z0-9_]{3,40}$/;

export function isCrossSiteWrite(request, url) {
    const site = request.headers.get('Sec-Fetch-Site');
    if (site) return !(site === 'same-origin' || site === 'none');
    const origin = request.headers.get('Origin');
    return !!origin && origin !== 'null' && origin !== url.origin;
}
