import { ICON_192, ICON_512, ICON_MASKABLE } from './assets/icons.generated.js';

export const PWA_ICONS = { '/icons/192.png': ICON_192, '/icons/512.png': ICON_512, '/icons/maskable.png': ICON_MASKABLE };

const MANIFEST = JSON.stringify({
    name: 'monsmain-cloud', short_name: 'monsmain', description: 'Personal cloud drive on Cloudflare', id: '/', start_url: '/', scope: '/', display: 'standalone',
    background_color: '#0a0a0a', theme_color: '#0a0a0a',
    icons: [{ src: '/icons/192.png', sizes: '192x192', type: 'image/png', purpose: 'any' }, { src: '/icons/512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }, { src: '/icons/maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }]
});

const SW_JS = `self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
const OFFLINE = '<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>monsmain-cloud</title><body style="margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,sans-serif;background:#0a0a0a;color:#fafafa;text-align:center"><div><div style="font-size:42px">☁️</div><h2>Offline · آفلاین</h2><p style="color:#a3a3a3">Check your connection and try again.<br>اتصال اینترنت را بررسی کنید.</p><button onclick="location.reload()" style="background:#f97316;color:#0a0a0a;border:0;border-radius:12px;padding:12px 22px;font-weight:700;font-size:15px">Retry · تلاش مجدد</button></div>';
self.addEventListener('fetch', (e) => { if (e.request.mode === 'navigate') e.respondWith(fetch(e.request).catch(() => new Response(OFFLINE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }))); });`;

export const PWA_TAGS = '<link rel="manifest" href="/manifest.webmanifest"><link rel="apple-touch-icon" href="/icons/192.png"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="monsmain-cloud"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">';

export const PWA_REGISTER = "if('serviceWorker' in navigator) window.addEventListener('load', function(){ navigator.serviceWorker.register('/sw.js').catch(function(){}); });";

const b64ToBytes = (b64) => { const s = atob(b64); const o = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) o[i] = s.charCodeAt(i); return o; };

export function pwaResponse(path) {
    const h = { 'X-Content-Type-Options': 'nosniff' };
    if (path === '/manifest.webmanifest') return new Response(MANIFEST, { headers: { ...h, 'Content-Type': 'application/manifest+json', 'Cache-Control': 'public, max-age=3600' } });
    if (path === '/sw.js') return new Response(SW_JS, { headers: { ...h, 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-cache', 'Service-Worker-Allowed': '/' } });
    if (PWA_ICONS[path]) return new Response(b64ToBytes(PWA_ICONS[path]), { headers: { ...h, 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=604800' } });
    return null;
}
