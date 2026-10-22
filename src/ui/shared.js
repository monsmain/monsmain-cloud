// Theme bootstrap, favicon and icons shared by the pages.

// ---------- Shared UI bits (design tokens: shadcn/ui neutral for English, VibeFarsi graphite for Persian) ----------
export const FAVICON_TAGS = `<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23f97316'/%3E%3Cpath transform='translate(6 6) scale(.83)' d='M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z' fill='%230a0a0a'/%3E%3C/svg%3E"><meta name="theme-color" media="(prefers-color-scheme: light)" content="#fafafa"><meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a0a0a">`;

export const THEME_BOOT = "(function(){var d=document.documentElement,t=localStorage.getItem('theme'),l=localStorage.getItem('lang')||((navigator.language||'').toLowerCase().indexOf('fa')===0?'fa':'en');d.setAttribute('data-theme',(t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light');d.lang=l;d.dir=l==='fa'?'rtl':'ltr';})();";

export const ICON_SUN = '<svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';

export const ICON_MOON = '<svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';

export const ICON_CLOUD = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>';
