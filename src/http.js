// Tiny HTTP helpers shared by the routes and the bot.

export const readJson = async (request) => { try { return await request.json(); } catch { return {}; } };

export const ID_RE = /^[A-Za-z0-9_]{3,40}$/;

// =====================================================================
//  Web panel
// =====================================================================
// Browsers send "Origin: null" for same-origin form posts when the page has "Referrer-Policy: no-referrer",
// so Sec-Fetch-Site (sent by all modern browsers) is the primary signal; Origin is the fallback for older ones.
export function isCrossSiteWrite(request, url) {
    const site = request.headers.get('Sec-Fetch-Site');
    if (site) return !(site === 'same-origin' || site === 'none');
    const origin = request.headers.get('Origin');
    return !!origin && origin !== 'null' && origin !== url.origin;
}
