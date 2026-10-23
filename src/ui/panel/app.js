        const DICT = {
            en: { select_storage: 'Storage Engine', theme_sys: 'System', theme_light: 'Light', theme_dark: 'Dark', logout: 'Logout', tab_upload: 'Upload', tab_history: 'Workspace', drop_title: 'Select or Drop File', uploading: 'Uploading...', resuming: 'Retrying...', loading: 'Loading workspace...', empty: 'No files found here.', copy: 'Copy link', delete: 'Delete', copied: 'Copied to clipboard', deleted: 'File deleted', uploaded: 'Upload complete', root_dir: 'Home', new_folder: 'Folder', prompt_folder: 'Folder name:', err_net: 'Connection error! Retrying...', err_fail: 'Upload failed completely.', err_tg: 'Telegram Bot is not configured!', err_r2: 'Cloudflare R2 is not enabled for this panel!', err_size_tg: 'File exceeds the 20MB Telegram limit!', err_size_r2: 'File exceeds 10GB limit!', moved: 'File moved', storage_used: 'Usage', stat_img: 'Images', stat_vid: 'Videos', stat_aud: 'Audio', stat_doc: 'Docs', storage_tg: 'Telegram', storage_r2: 'Cloudflare R2', config_title: 'API Settings', config_sub: 'Secure Telegram Credentials', config_token: 'Bot Token', config_chatid: 'Admin Chat ID', config_save: 'Save Changes', saved: 'Settings saved & Webhook applied', url_placeholder: 'https://example.com/file.mp4', upload_url_btn: 'Remote Upload', err_html: 'Webpage links are not supported! Please use a direct file link.', tab_trash: 'Trash', trash_empty: 'Trash is empty.', share: 'Share', unshare: 'Unshare', restore: 'Restore', purge: 'Delete forever', confirm_purge: 'Permanently delete this file? This cannot be undone.', confirm_purge_folder: 'Permanently delete this folder and its contents?', shared_toast: 'Share link copied', unshared_toast: 'Share revoked', trashed_toast: 'Moved to trash', folder: 'Folder', err_session: 'Session expired. Please sign in again.', err_r2_not_configured: 'R2 storage is not enabled for this panel. Enable R2 in your Cloudflare dashboard and run the installer again.', err_tg_not_configured: 'Telegram bot is not configured!', err_bad_token: 'Telegram rejected this bot token.', err_bad_chat: 'Admin Chat ID must be a number.', err_webhook_failed: 'Could not connect the bot webhook.', err_too_big: 'File is too large.', err_too_big_tg: 'File exceeds the 20MB Telegram limit!', err_is_html: 'This link is a web page, not a direct file link.', err_invalid_url: 'Invalid or unreachable link.', err_fetch_failed: 'Could not download from that link.', err_upload_failed: 'Upload failed.', err_bad_name: 'Invalid name.', err_bad_file: 'Invalid file.', err_bad_request: 'Invalid request.', err_bad_part: 'Invalid upload part.', err_empty_file: 'Empty files cannot be uploaded.', err_server_error: 'Server error. Please try again.', err_not_found: 'Not found.', token_hint: 'Leave unchanged to keep the current token', purged: 'Permanently deleted', err_unauthorized: 'Session expired. Please sign in again.', items: 'items', search_ph: 'Search files…', no_results: 'No matching files', empty_cta: 'Upload a file', move: 'Move', move_title: 'Move to…', unshare_t: 'Stop sharing', shared_tag: 'Shared', engine_tg: 'Telegram', engine_r2: 'Cloudflare R2', tg_limit: 'Up to 20 MB per file', r2_limit: 'Up to 10 GB per file', install_app: 'Install app', pwa_hint: 'On iPhone: Share → Add to Home Screen to install', media_opt: 'Send as media in Telegram', media_hint: 'Photos, videos and music appear as real media instead of files. Telegram recompresses photos — turn this off to keep originals.', usage_title: 'R2 storage', usage_refresh: 'Refresh', usage_live: 'live from the bucket', usage_est: 'estimated from files', usage_in_trash: 'in trash', usage_warn: 'You are close to your R2 limit. Delete files or empty the trash soon.', usage_crit: 'R2 is almost full! Free some space before uploading more.', usage_over_confirm: 'This upload will go over your R2 limit. Continue anyway?', cfg_r2limit: 'R2 storage limit in GB (0 = no warnings)', select: 'Select', select_all: 'All', selected: 'selected', bulk_delete_confirm: 'Move {n} files to the trash?', days_left: 'days left', trash_note: 'Items are deleted permanently after {n} days.' },
            fa: { select_storage: 'موتور ذخیره‌سازی', theme_sys: 'سیستم', theme_light: 'روز', theme_dark: 'شب', logout: 'خروج', tab_upload: 'آپلود', tab_history: 'فضای کاری', drop_title: 'فایل را اینجا رها کنید', uploading: 'در حال ارسال...', resuming: 'تلاش مجدد...', loading: 'دریافت اطلاعات...', empty: 'هیچ فایلی در این پوشه نیست.', copy: 'کپی لینک', delete: 'حذف', copied: 'لینک کپی شد', deleted: 'حذف انجام شد', uploaded: 'آپلود با موفقیت انجام شد', root_dir: 'خانه', new_folder: 'پوشه جدید', prompt_folder: 'نام پوشه:', err_net: 'خطای ارتباط! در حال تلاش مجدد...', err_fail: 'آپلود به طور کامل شکست خورد.', err_tg: 'ربات تلگرام تنظیم نشده است!', err_r2: 'فضای R2 برای این پنل فعال نیست!', err_size_tg: 'حجم فایل برای تلگرام بیشتر از ۲۰ مگابایت است!', err_size_r2: 'حجم فایل بیشتر از 10 گیگابایت است!', moved: 'فایل جابجا شد', storage_used: 'فضای مصرفی', stat_img: 'عکس', stat_vid: 'ویدیو', stat_aud: 'صدا', stat_doc: 'اسناد', storage_tg: 'تلگرام', storage_r2: 'کلودفلر R2', config_title: 'تنظیمات API', config_sub: 'اطلاعات اتصال ربات تلگرام', config_token: 'توکن ربات', config_chatid: 'شناسه چت مدیر', config_save: 'ذخیره تنظیمات', saved: 'تنظیمات اعمال شد', url_placeholder: 'لینک مستقیم فایل (مثلا https://.../file.mp4)', upload_url_btn: 'آپلود مستقیم لینک', err_html: 'لینک وارد شده صفحه وب است! لطفاً فقط لینک مستقیم فایل را وارد کنید.', tab_trash: 'سطل زباله', trash_empty: 'سطل زباله خالی است.', share: 'اشتراک', unshare: 'لغو اشتراک', restore: 'بازیابی', purge: 'حذف برای همیشه', confirm_purge: 'این فایل برای همیشه حذف شود؟ این عمل قابل بازگشت نیست.', confirm_purge_folder: 'این پوشه و فایل‌های داخلش برای همیشه حذف شوند؟', shared_toast: 'لینک اشتراکی کپی شد', unshared_toast: 'اشتراکی لغو شد', trashed_toast: 'به سطل منتقل شد', folder: 'پوشه', err_session: 'نشست منقضی شد. دوباره وارد شوید.', err_r2_not_configured: 'فضای R2 برای این پنل فعال نیست. R2 را در داشبورد کلودفلر فعال کنید و نصب‌کننده را دوباره اجرا کنید.', err_tg_not_configured: 'ربات تلگرام تنظیم نشده است!', err_bad_token: 'تلگرام این توکن ربات را نپذیرفت.', err_bad_chat: 'آیدی عددی مدیر باید عدد باشد.', err_webhook_failed: 'اتصال وب‌هوک ربات انجام نشد.', err_too_big: 'حجم فایل زیاد است.', err_too_big_tg: 'حجم فایل برای تلگرام بیشتر از ۲۰ مگابایت است!', err_is_html: 'این لینک یک صفحه وب است، نه لینک مستقیم فایل.', err_invalid_url: 'لینک نامعتبر یا غیرقابل دسترس است.', err_fetch_failed: 'دریافت فایل از این لینک ممکن نشد.', err_upload_failed: 'آپلود ناموفق بود.', err_bad_name: 'نام نامعتبر است.', err_bad_file: 'فایل نامعتبر است.', err_bad_request: 'درخواست نامعتبر است.', err_bad_part: 'بخش آپلود نامعتبر است.', err_empty_file: 'فایل خالی قابل آپلود نیست.', err_server_error: 'خطای سرور. دوباره تلاش کنید.', err_not_found: 'یافت نشد.', token_hint: 'برای حفظ توکن فعلی بدون تغییر بگذارید', purged: 'برای همیشه حذف شد', err_unauthorized: 'نشست منقضی شد. دوباره وارد شوید.', items: 'مورد', search_ph: 'جست‌وجوی فایل…', no_results: 'فایلی پیدا نشد', empty_cta: 'آپلود فایل', move: 'انتقال', move_title: 'انتقال به…', unshare_t: 'لغو اشتراک', shared_tag: 'اشتراکی', engine_tg: 'تلگرام', engine_r2: 'کلودفلر R2', tg_limit: 'تا ۲۰ مگابایت برای هر فایل', r2_limit: 'تا ۱۰ گیگابایت برای هر فایل', install_app: 'نصب برنامه', pwa_hint: 'روی آیفون: Share ← Add to Home Screen', media_opt: 'ارسال به‌صورت مدیا در تلگرام', media_hint: 'عکس، ویدیو و موزیک به‌جای فایل، مدیا نمایش داده می‌شوند. تلگرام عکس‌ها را فشرده می‌کند؛ برای نگه‌داشتن فایل اصلی این گزینه را خاموش کنید.', usage_title: 'فضای R2', usage_refresh: 'تازه‌سازی', usage_live: 'مستقیم از باکت', usage_est: 'تخمین از روی فایل‌ها', usage_in_trash: 'در سطل زباله', usage_warn: 'به سقف R2 نزدیک شده‌اید. فایل‌های اضافه را پاک کنید یا سطل زباله را خالی کنید.', usage_crit: 'فضای R2 تقریباً پر است! قبل از آپلود بیشتر، جا باز کنید.', usage_over_confirm: 'این آپلود از سقف R2 شما بیشتر می‌شود. ادامه می‌دهید؟', cfg_r2limit: 'سقف فضای R2 به گیگابایت (۰ = بدون هشدار)', select: 'انتخاب', select_all: 'همه', selected: 'انتخاب‌شده', bulk_delete_confirm: '{n} فایل به سطل زباله منتقل شود؟', days_left: 'روز مانده', trash_note: 'موارد بعد از {n} روز برای همیشه حذف می‌شوند.' }
        };

        let currentLang = localStorage.getItem('lang') || ((navigator.language || '').toLowerCase().indexOf('fa') === 0 ? 'fa' : 'en'); let currentFolder = 'root'; let currentFolderName = ''; let fileSystem = { folders: [], files: [] }; let trashSystem = { folders: [], files: [] };

        document.addEventListener('DOMContentLoaded', () => { initTheme(); applyLang(); loadFS(); updateDropzoneLimit(); });

        function initTheme() { const t = localStorage.getItem('theme'); const dark = t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches; document.documentElement.classList.toggle('dark', dark); document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light'); }
        function toggleTheme() { const dark = !document.documentElement.classList.contains('dark'); document.documentElement.classList.toggle('dark', dark); document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light'); localStorage.setItem('theme', dark ? 'dark' : 'light'); }
        function toggleAppLangMenu() {}
        function setAppLang(l) { currentLang = l; localStorage.setItem('lang', currentLang); applyLang(); updateDropzoneLimit(); renderFS(); }

        
        function applyLang() { 
            document.documentElement.lang = currentLang; document.documentElement.dir = currentLang === 'fa' ? 'rtl' : 'ltr'; 
            document.getElementById('lang-btn-en').setAttribute('aria-pressed', currentLang === 'en'); document.getElementById('lang-btn-fa').setAttribute('aria-pressed', currentLang === 'fa'); 
            document.querySelectorAll('[data-i18n]').forEach(el => { if(DICT[currentLang][el.getAttribute('data-i18n')]) el.innerText = DICT[currentLang][el.getAttribute('data-i18n')]; }); 
            document.querySelectorAll('[data-i18n-ph]').forEach(el => { if(DICT[currentLang][el.getAttribute('data-i18n-ph')]) el.placeholder = DICT[currentLang][el.getAttribute('data-i18n-ph')]; }); 
            updateBreadcrumb(); renderAnalytics(); 
        }
        
        const formatBytes = (bytes) => { if(bytes === 0) return '0 MB'; const k = 1024; const sizes = ['B', 'KB', 'MB', 'GB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]; };
        const getFileType = (filename) => { const ext = filename.split('.').pop().toLowerCase(); if(['jpg','jpeg','png','gif','webp','svg'].includes(ext)) return 'img'; if(['mp4','webm','mkv','mov'].includes(ext)) return 'vid'; if(['mp3','wav','ogg','m4a'].includes(ext)) return 'aud'; return 'doc'; };
        const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
        const SPINNER = '<svg class="animate-spin h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
        function errText(code) { return DICT[currentLang]['err_' + String(code || '').toLowerCase()] || code || DICT[currentLang].err_net; }
        async function api(path, opts = {}) {
            const o = Object.assign({}, opts); o.headers = Object.assign({}, opts.headers || {});
            if (o.body && typeof o.body === 'object' && !(o.body instanceof Blob) && !(o.body instanceof FormData) && !(o.body instanceof ArrayBuffer)) { o.body = JSON.stringify(o.body); o.headers['Content-Type'] = 'application/json'; }
            let res;
            try { res = await fetch(path, o); } catch (e) { throw new Error(DICT[currentLang].err_net); }
            if (res.status === 401) { location.href = '/'; throw new Error(DICT[currentLang].err_session); }
            let data = null; try { data = await res.json(); } catch (e) {}
            if (!res.ok || (data && data.error)) throw new Error(errText(data && data.error));
            return data;
        }

        function updateDropzoneLimit() { const isR2 = document.querySelector('input[name="storageType"]:checked').value === 'r2'; document.getElementById('drop_limit_text').innerText = 'Max ' + (isR2 ? '10GB' : '20MB') + ' per file'; const mo = document.getElementById('media-opt'); if (mo) mo.classList.toggle('hidden', isR2); const ub = document.getElementById('usage-box-upload'); if (ub) ub.classList.toggle('hidden', !isR2); }





        async function openConfigModal() { try { const data = await api('/api/config'); document.getElementById('cfg_token').value = data.botToken || ''; document.getElementById('cfg_chatid').value = data.chatId || ''; document.getElementById('cfg_r2limit').value = (data.r2LimitGb === undefined ? '' : data.r2LimitGb); document.getElementById('cfg_info').innerText = 'monsmain-cloud v' + (data.version || '') + ' · R2: ' + (data.r2 ? 'on' : 'off'); } catch (e) { showToast(e.message, true); return; } const modal = document.getElementById('config-modal'); const box = document.getElementById('config-box'); modal.classList.remove('hidden'); setTimeout(() => { modal.classList.remove('opacity-0'); box.classList.remove('scale-95'); }, 10); }
        function closeConfigModal() { const modal = document.getElementById('config-modal'); const box = document.getElementById('config-box'); modal.classList.add('opacity-0'); box.classList.add('scale-95'); setTimeout(() => modal.classList.add('hidden'), 300); }
        async function saveConfig() { const btn = document.getElementById('btn_save_cfg'); btn.innerText = '...'; btn.disabled = true; const tokenVal = document.getElementById('cfg_token').value.trim(); const payload = { botToken: tokenVal.indexOf('•') > -1 ? '' : tokenVal, chatId: document.getElementById('cfg_chatid').value.trim(), r2LimitGb: document.getElementById('cfg_r2limit').value.trim() }; try { await api('/api/config', { method: 'POST', body: payload }); showToast(DICT[currentLang].saved); closeConfigModal(); loadUsage(); } catch (e) { showToast(e.message, true); } finally { btn.innerText = DICT[currentLang].config_save; btn.disabled = false; } }

        async function loadFS() { try { fileSystem = await api('/api/fs'); renderAnalytics(); renderFS(); } catch (e) { showToast(e.message, true); } }
        function navigateTo(folderId) { if (typeof toggleSelect === 'function') toggleSelect(false); currentFolder = folderId; const f = fileSystem.folders.find(x => x.id === folderId); currentFolderName = f ? f.name : ''; updateBreadcrumb(); renderFS(); }
        
        function updateBreadcrumb() { const bc = document.getElementById('breadcrumb'); let html = `<button onclick="navigateTo('root')" class="hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> <span data-i18n="root_dir">${DICT[currentLang].root_dir}</span></button>`; if (currentFolder !== 'root') html += `<span class="mx-2 text-neutral-300 dark:text-neutral-600">/</span> <span class="text-orange-600 dark:text-orange-400 font-bold">${esc(currentFolderName)}</span>`; bc.innerHTML = html; }

        function renderAnalytics() { if(!fileSystem.files || fileSystem.files.length === 0) { document.getElementById('analytics-panel').classList.add('hidden'); return; } document.getElementById('analytics-panel').classList.remove('hidden'); let stats = { img: 0, vid: 0, aud: 0, doc: 0, total: 0 }; fileSystem.files.forEach(f => { const s = f.size || 0; stats.total += s; stats[getFileType(f.name)] += s; }); document.getElementById('total-storage-text').innerText = formatBytes(stats.total); document.getElementById('total-files-text').innerText = `${fileSystem.files.length}`; const colors = { img: 'bg-blue-500', vid: 'bg-violet-500', aud: 'bg-emerald-500', doc: 'bg-amber-500' }; let barHtml = ''; let legendHtml = ''; ['img', 'vid', 'aud', 'doc'].forEach(key => { if(stats[key] > 0) { const pct = ((stats[key] / stats.total) * 100).toFixed(1); barHtml += `<div class="${colors[key]} h-full" style="width: ${pct}%" title="${DICT[currentLang]['stat_'+key]}: ${formatBytes(stats[key])}"></div>`; legendHtml += `<div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full ${colors[key]}"></span>${DICT[currentLang]['stat_'+key]} <span class="text-neutral-400 font-normal ml-1">${pct}%</span></div>`; } }); document.getElementById('analytics-bar').innerHTML = barHtml; document.getElementById('analytics-legend').innerHTML = legendHtml; }

        const IC = {
            folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
            img: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
            vid: '<path d="m16 13 5.22 3.48a.5.5 0 0 0 .78-.42V7.94a.5.5 0 0 0-.78-.42L16 11"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
            aud: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
            doc: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8M16 13H8M16 17H8"/>',
            link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
            unlink: '<circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/>',
            move: '<path d="M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1"/><path d="M2 13h10"/><path d="m9 16 3-3-3-3"/>',
            trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6M14 11v6"/>',
            upload: '<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/>',
            search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
            check: '<path d="M20 6 9 17l-5-5"/>',
            refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
            select: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/>'
        };
        const ico = (p, cls) => '<svg class="' + (cls || 'w-5 h-5') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
        const ENGINE = {
            tg: '<svg viewBox="0 0 24 24" class="w-4 h-4" aria-hidden="true"><path fill="#26A5E4" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
            r2: '<svg viewBox="0 0 24 24" class="w-4 h-4" aria-hidden="true"><path fill="#F38020" d="M16.509 16.845c.147-.507.09-.971-.155-1.316-.225-.316-.605-.499-1.062-.52l-8.66-.113a.156.156 0 01-.133-.07.194.194 0 01-.02-.156.24.24 0 01.203-.156l8.736-.113c1.035-.049 2.16-.886 2.554-1.913l.499-1.302a.27.27 0 00.014-.168 5.689 5.689 0 00-10.938-.584 2.584 2.584 0 00-1.793-.498 2.561 2.561 0 00-2.223 3.18A3.634 3.634 0 000 16.751c0 .175.014.351.035.527a.174.174 0 00.17.148h15.98a.22.22 0 00.204-.155l.12-.427zm2.757-5.564c-.077 0-.161 0-.239.011-.056 0-.105.042-.127.098l-.337 1.174c-.148.507-.092.971.154 1.317.225.316.605.498 1.062.52l1.844.113c.056 0 .105.026.133.07a.203.203 0 01.021.156.24.24 0 01-.204.156l-1.92.112c-1.042.049-2.159.887-2.553 1.914l-.141.358c-.028.072.021.142.099.142h6.597a.174.174 0 00.17-.126 4.87 4.87 0 00.175-1.28 4.74 4.74 0 00-4.734-4.727"/></svg>'
        };
        let searchQuery = ''; let bcBound = false; let selectMode = false; const selected = new Set(); let usageData = null; const THUMB_MAX = 4 * 1024 * 1024;
        function onSearch(v) { searchQuery = String(v || '').trim().toLowerCase(); renderFS(); }
        function switchView(view) {
            ['upload', 'history', 'trash'].forEach(v => { document.getElementById('view-' + v).classList.toggle('hidden-view', v !== view); const t = document.getElementById('tab-' + v); t.classList.toggle('tab-active', v === view); t.setAttribute('aria-selected', v === view); });
            if (view === 'upload') { const info = document.getElementById('upload-path-info'); const text = document.getElementById('upload-path-text'); if (currentFolder !== 'root') { info.classList.remove('hidden'); text.innerText = currentFolderName; } else info.classList.add('hidden'); }
            if (selectMode) toggleSelect(false);
            if (view === 'history') { loadFS(); loadUsage(); } if (view === 'trash') loadTrash(); if (view === 'upload') loadUsage();
            window.scrollTo({ top: 0 });
        }
        function showToast(msg, isError = false) { const toast = document.getElementById('toast'); document.getElementById('toast-msg').innerText = msg; document.getElementById('toast-icon').innerText = isError ? '!' : '✓'; toast.dataset.type = isError ? 'error' : 'ok'; toast.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(() => toast.classList.remove('show'), 3800); }
        function renderFS() {
            const T = DICT[currentLang]; const container = document.getElementById('fs-container'); container.innerHTML = '';
            const bc = document.getElementById('breadcrumb');
            if (!bcBound) { bc.addEventListener('dragover', handleDragOver); bc.addEventListener('dragleave', handleDragLeave); bc.addEventListener('drop', (e) => handleDrop(e, 'root')); bcBound = true; }
            const q = searchQuery; const match = (n) => !q || String(n).toLowerCase().indexOf(q) > -1;
            let shown = 0;
            if (currentFolder === 'root') {
                fileSystem.folders.filter(f => match(f.name)).forEach(f => {
                    shown++; const count = fileSystem.files.filter(x => x.folderId === f.id).length;
                    const el = document.createElement('div'); el.className = 'fs-card fs-folder';
                    el.innerHTML = '<button type="button" class="fs-main" onclick="navigateTo(\'' + f.id + '\')"><span class="fs-ico fs-ico-folder">' + ico(IC.folder, 'w-6 h-6') + '</span><span class="min-w-0 text-start"><span class="fs-name" dir="auto">' + esc(f.name) + '</span><span class="fs-meta">' + count + ' ' + esc(T.items) + ' • ' + new Date(f.date).toLocaleDateString() + '</span></span></button><button type="button" class="act act-icon act-danger" onclick="deleteFolder(\'' + f.id + '\', event)" aria-label="' + esc(T.delete) + '" title="' + esc(T.delete) + '">' + ico(IC.trash, 'w-4 h-4') + '</button>';
                    el.addEventListener('dragover', handleDragOver); el.addEventListener('dragleave', handleDragLeave); el.addEventListener('drop', (e) => handleDrop(e, f.id));
                    container.appendChild(el);
                });
            }
            container.classList.toggle('selecting', selectMode);
            const currentFiles = fileSystem.files.filter(f => (currentFolder === 'root' ? !f.folderId : f.folderId === currentFolder) && match(f.name));
            const colors = { img: 'fs-c-img', vid: 'fs-c-vid', aud: 'fs-c-aud', doc: 'fs-c-doc' };
            currentFiles.forEach(f => {
                shown++; const type = getFileType(f.name); const isMedia = type !== 'doc';
                const open = isMedia ? "openPreview('" + f.id + "', '" + type + "')" : "openItem('" + f.id + "')";
                const engine = f.provider === 'r2' ? ENGINE.r2 : ENGINE.tg; const engineName = f.provider === 'r2' ? T.engine_r2 : T.engine_tg;
                const shareRow = f.shareId
                    ? '<button type="button" class="act act-brand flex-1" onclick="copyShare(\'' + f.id + '\')">' + ico(IC.link, 'w-4 h-4') + '<span>' + esc(T.copy) + '</span></button><button type="button" class="act act-icon" onclick="unshareItem(\'' + f.id + '\')" aria-label="' + esc(T.unshare_t) + '" title="' + esc(T.unshare_t) + '">' + ico(IC.unlink, 'w-4 h-4') + '</button>'
                    : '<button type="button" class="act flex-1" onclick="shareItem(\'' + f.id + '\')">' + ico(IC.link, 'w-4 h-4') + '<span>' + esc(T.share) + '</span></button>';
                const isSel = selected.has(f.id); const thumb = type === 'img' && (f.size || 0) <= THUMB_MAX;
                const el = document.createElement('div'); el.className = 'fs-card fs-file' + (isSel ? ' is-selected' : ''); el.draggable = !selectMode;
                if (selectMode) el.addEventListener('click', (e) => { if (!e.target.closest('.sel-box')) toggleSel(f.id); });
                el.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', f.id); el.classList.add('opacity-50'); }); el.addEventListener('dragend', () => el.classList.remove('opacity-50'));
                const selBox = selectMode ? '<button type="button" class="sel-box' + (isSel ? ' on' : '') + '" aria-pressed="' + isSel + '" onclick="toggleSel(\'' + f.id + '\')">' + ico(IC.check, 'w-4 h-4') + '</button>' : '';
                const icoBtn = '<button type="button" class="fs-ico fs-ico-btn ' + colors[type] + (thumb ? ' fs-thumb' : '') + '" onclick="' + (selectMode ? 'return false' : open) + '" tabindex="-1" aria-hidden="true">' + ico(IC[type], 'w-6 h-6') + (thumb ? '<img loading="lazy" decoding="async" alt="" src="' + esc(f.url) + '" onerror="this.remove()">' : '') + '</button>';
                el.innerHTML = '<div class="fs-top">' + selBox + icoBtn + '<div class="min-w-0 flex-1"><button type="button" class="fs-name fs-link" dir="auto" title="' + esc(f.name) + '" onclick="' + (selectMode ? 'return false' : open) + '">' + esc(f.name) + '</button><div class="fs-meta"><span>' + formatBytes(f.size || 0) + '</span><span>•</span><span>' + new Date(f.date).toLocaleDateString() + '</span><span class="fs-engine" title="' + esc(engineName) + '">' + engine + '</span>' + (f.shareId ? '<span class="fs-shared">' + esc(T.shared_tag) + '</span>' : '') + '</div></div></div><div class="fs-actions">' + shareRow + '<button type="button" class="act act-icon" onclick="openMove(\'' + f.id + '\')" aria-label="' + esc(T.move) + '" title="' + esc(T.move) + '">' + ico(IC.move, 'w-4 h-4') + '</button><button type="button" class="act act-icon act-danger" onclick="deleteItem(\'' + f.id + '\')" aria-label="' + esc(T.delete) + '" title="' + esc(T.delete) + '">' + ico(IC.trash, 'w-4 h-4') + '</button></div>';
                container.appendChild(el);
            });
            if (shown === 0) {
                const msg = q ? T.no_results : T.empty;
                container.innerHTML = '<div class="col-span-full empty"><div class="empty-ico">' + ico(q ? IC.search : IC.folder, 'w-7 h-7') + '</div><p>' + esc(msg) + '</p>' + (q ? '' : '<button type="button" class="btn-brand" onclick="switchView(\'upload\')">' + ico(IC.upload, 'w-4 h-4') + '<span>' + esc(T.empty_cta) + '</span></button>') + '</div>';
            }
        }
        function openMove(id) { openMoveSheet([id]); }
        function openMoveSheet(ids) {
            const files = fileSystem.files.filter(x => ids.indexOf(x.id) > -1); if (!files.length) return; const T = DICT[currentLang];
            const list = document.getElementById('move-list'); list.innerHTML = '';
            document.getElementById('move-name').innerText = files.length === 1 ? files[0].name : files.length + ' ' + T.selected;
            const here = files.every(x => (x.folderId || 'root') === (files[0].folderId || 'root')) ? (files[0].folderId || 'root') : null;
            const targets = [{ id: 'root', name: T.root_dir }].concat(fileSystem.folders.map(x => ({ id: x.id, name: x.name })));
            targets.forEach(t => { const cur = here === t.id; const b = document.createElement('button'); b.type = 'button'; b.className = 'move-item' + (cur ? ' is-current' : ''); b.disabled = cur; b.innerHTML = ico(IC.folder, 'w-5 h-5') + '<span dir="auto">' + esc(t.name) + '</span>'; b.addEventListener('click', () => moveTo(ids, t.id)); list.appendChild(b); });
            const m = document.getElementById('move-modal'); m.classList.remove('hidden'); setTimeout(() => m.classList.remove('opacity-0'), 10);
        }
        function closeMove() { const m = document.getElementById('move-modal'); m.classList.add('opacity-0'); setTimeout(() => m.classList.add('hidden'), 250); }
        async function moveTo(ids, folderId) { closeMove(); try { await api('/api/files/bulk', { method: 'POST', body: { action: 'move', ids, folderId } }); showToast(DICT[currentLang].moved); toggleSelect(false); loadFS(); } catch (e) { showToast(e.message, true); } }

        function visibleFileIds() { const q = searchQuery; return fileSystem.files.filter(f => (currentFolder === 'root' ? !f.folderId : f.folderId === currentFolder) && (!q || String(f.name).toLowerCase().indexOf(q) > -1)).map(f => f.id); }
        function updateSelectBar() {
            const T = DICT[currentLang]; const bar = document.getElementById('select-bar'); if (!bar) return;
            bar.classList.toggle('show', selectMode); const n = selected.size;
            document.getElementById('sel-count').innerText = n + ' ' + T.selected;
            ['sel-move', 'sel-delete'].forEach(id => { document.getElementById(id).disabled = n === 0; });
            const btn = document.getElementById('btn-select'); if (btn) btn.classList.toggle('is-on', selectMode);
        }
        function toggleSelect(force) { selectMode = force === undefined ? !selectMode : !!force; if (!selectMode) selected.clear(); updateSelectBar(); if (typeof fileSystem !== 'undefined' && document.getElementById('fs-container')) renderFS(); }
        function toggleSel(id) { if (selected.has(id)) selected.delete(id); else selected.add(id); updateSelectBar(); renderFS(); }
        function selectAll() { const ids = visibleFileIds(); const all = ids.length > 0 && ids.every(i => selected.has(i)); ids.forEach(i => { if (all) selected.delete(i); else selected.add(i); }); updateSelectBar(); renderFS(); }
        function bulkMove() { if (selected.size) openMoveSheet(Array.from(selected)); }
        async function bulkDelete() { const n = selected.size; if (!n) return; if (!confirm(DICT[currentLang].bulk_delete_confirm.replace('{n}', n))) return; try { await api('/api/files/bulk', { method: 'POST', body: { action: 'delete', ids: Array.from(selected) } }); showToast(DICT[currentLang].trashed_toast); toggleSelect(false); loadFS(); } catch (e) { showToast(e.message, true); } }

        function usageHtml() {
            const u = usageData; if (!u || !u.r2 || !u.r2.enabled) return ''; const T = DICT[currentLang]; const r = u.r2;
            const gb = (b) => (b / 1e9).toFixed(b >= 1e10 ? 1 : 2); const pct = r.percent; const level = pct === null || pct === undefined ? 0 : pct >= 95 ? 2 : pct >= 80 ? 1 : 0;
            return '<div class="usage' + (level ? ' usage-w' + level : '') + '"><div class="usage-head"><span class="usage-title">' + ENGINE.r2 + '<span>' + esc(T.usage_title) + '</span></span><button type="button" class="act act-icon" onclick="loadUsage(true)" aria-label="' + esc(T.usage_refresh) + '" title="' + esc(T.usage_refresh) + '">' + ico(IC.refresh, 'w-4 h-4') + '</button></div>'
                + '<div class="usage-nums"><strong>' + gb(r.bytes) + ' GB</strong>' + (r.limitGb > 0 ? '<span>/ ' + r.limitGb + ' GB</span>' : '') + (pct !== null && pct !== undefined ? '<em>' + pct + '%</em>' : '') + '</div>'
                + (r.limitGb > 0 ? '<div class="usage-bar"><div style="width:' + Math.min(100, pct || 0) + '%"></div></div>' : '')
                + '<div class="usage-sub"><span>' + r.objects + ' ' + esc(T.items) + '</span><span>' + esc(r.source === 'bucket' ? T.usage_live : T.usage_est) + '</span>' + (r.trashBytes > 0 ? '<span>' + gb(r.trashBytes) + ' GB ' + esc(T.usage_in_trash) + '</span>' : '') + '<span>' + ENGINE.tg + ' ' + (u.tg ? u.tg.count + ' • ' + formatBytes(u.tg.bytes) : '') + '</span></div>'
                + (level ? '<div class="usage-warn">' + esc(level === 2 ? T.usage_crit : T.usage_warn) + '</div>' : '') + '</div>';
        }
        function renderUsage() { ['usage-box-upload', 'usage-box-drive'].forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = usageHtml(); }); }
        async function loadUsage(fresh) { try { usageData = await api('/api/usage' + (fresh ? '?fresh=1' : '')); renderUsage(); } catch (e) { if (fresh) showToast(e.message, true); } }

        let deferredInstall = null;
        window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredInstall = e; const b = document.getElementById('btn-install-app'); if (b) b.classList.remove('hidden'); });
        window.addEventListener('appinstalled', () => { deferredInstall = null; const b = document.getElementById('btn-install-app'); if (b) b.classList.add('hidden'); });
        async function installApp() { if (!deferredInstall) return; deferredInstall.prompt(); try { await deferredInstall.userChoice; } catch (e) {} deferredInstall = null; const b = document.getElementById('btn-install-app'); if (b) b.classList.add('hidden'); }
        if ('serviceWorker' in navigator) window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closePreview(); closeConfigModal(); closeMove(); if (selectMode) toggleSelect(false); } });

        function openPreview(id, type) { const f = fileSystem.files.find(x => x.id === id); if (!f) return; const modal = document.getElementById('media-modal'); const body = document.getElementById('modal-body'); document.getElementById('modal-title').innerText = f.name; body.innerHTML = '<div class="loader absolute text-white"></div>'; modal.classList.remove('hidden'); setTimeout(() => modal.classList.remove('opacity-0'), 10); const url = esc(f.url); let content = ''; if (type === 'img') content = '<img src="' + url + '" class="max-w-full max-h-[80vh] object-contain shadow-2xl" alt="Preview">'; else if (type === 'vid') content = '<video src="' + url + '" controls autoplay class="max-w-full max-h-[80vh] shadow-2xl w-full outline-none"></video>'; else if (type === 'aud') content = '<audio src="' + url + '" controls autoplay class="w-full max-w-md my-10 outline-none"></audio>'; setTimeout(() => { body.innerHTML = content; }, 300); }
        function closePreview() { const modal = document.getElementById('media-modal'); modal.classList.add('opacity-0'); setTimeout(() => { modal.classList.add('hidden'); document.getElementById('modal-body').innerHTML = ''; }, 300); } document.getElementById('media-modal').addEventListener('click', (e) => { if (e.target === document.getElementById('media-modal')) closePreview(); });

        function handleDragOver(e) { e.preventDefault(); e.currentTarget.classList.add('drag-over'); } function handleDragLeave(e) { e.currentTarget.classList.remove('drag-over'); }
        async function handleDrop(e, targetFolderId) { e.preventDefault(); e.currentTarget.classList.remove('drag-over'); const fileId = e.dataTransfer.getData('text/plain'); if(!fileId) return; const file = fileSystem.files.find(f => f.id === fileId); if(file && file.folderId === (targetFolderId === 'root' ? null : targetFolderId)) return; try { const oldIndex = fileSystem.files.findIndex(f => f.id === fileId); if(oldIndex > -1) fileSystem.files[oldIndex].folderId = targetFolderId === 'root' ? null : targetFolderId; renderFS(); showToast(DICT[currentLang].moved); await fetch(`/api/files/${fileId}/move`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ folderId: targetFolderId }) }); } catch(err) { showToast(DICT[currentLang].err_net, true); loadFS(); } }
        async function createNewFolder() { const name = prompt(DICT[currentLang].prompt_folder); if (!name || !name.trim()) return; try { await api('/api/folders', { method: 'POST', body: { name: name.trim() } }); loadFS(); } catch (e) { showToast(e.message, true); } }
        async function deleteFolder(id, e) { e.stopPropagation(); if (!confirm(DICT[currentLang].delete + '?')) return; try { await api('/api/folders/' + id, { method: 'DELETE' }); if (currentFolder === id) navigateTo('root'); showToast(DICT[currentLang].trashed_toast); loadFS(); } catch (err) { showToast(err.message, true); } }
        async function deleteItem(id) { try { await api('/api/files/' + id, { method: 'DELETE' }); showToast(DICT[currentLang].trashed_toast); loadFS(); } catch (e) { showToast(e.message, true); } }
        async function restoreItem(id, isFolder) { try { await api('/api/' + (isFolder ? 'folders' : 'files') + '/' + id + '/restore', { method: 'POST' }); showToast(DICT[currentLang].restore); loadTrash(); } catch (e) { showToast(e.message, true); } }
        async function purgeItem(id, isFolder) { if (!confirm(isFolder ? DICT[currentLang].confirm_purge_folder : DICT[currentLang].confirm_purge)) return; try { await api('/api/' + (isFolder ? 'folders' : 'files') + '/' + id + '/purge', { method: 'DELETE' }); showToast(DICT[currentLang].purged); loadTrash(); } catch (e) { showToast(e.message, true); } }
        async function shareItem(id) { try { const data = await api('/api/files/' + id + '/share', { method: 'POST' }); if (data.url) { await copyToClip(data.url); showToast(DICT[currentLang].shared_toast); loadFS(); } } catch (e) { showToast(e.message, true); } }
        async function unshareItem(id) { try { await api('/api/files/' + id + '/share', { method: 'DELETE' }); showToast(DICT[currentLang].unshared_toast); loadFS(); } catch (e) { showToast(e.message, true); } }
        async function loadTrash() { try { trashSystem = await api('/api/trash'); renderTrash(); } catch (e) { showToast(e.message, true); } }
        function renderTrash() {
            const container = document.getElementById('trash-container'); container.innerHTML = '';
            const note = document.getElementById('trash-note'); if (note) note.innerText = DICT[currentLang].trash_note.replace('{n}', (trashSystem && trashSystem.retentionDays) || 30);
            const folders = trashSystem.folders || [], files = trashSystem.files || [];
            if (!folders.length && !files.length) { container.innerHTML = '<div class="col-span-full text-center py-12 text-neutral-400 dark:text-neutral-500"><svg class="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>' + esc(DICT[currentLang].trash_empty) + '</div>'; return; }
            const colors = { img: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10', vid: 'text-violet-500 bg-violet-50 dark:bg-violet-500/10', aud: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10', doc: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' };
            folders.forEach(f => { const icon = '<div class="p-3 rounded-xl flex items-center justify-center shrink-0 text-neutral-500 bg-neutral-100 dark:bg-neutral-800"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg></div>'; container.appendChild(trashCard(icon, f.name, DICT[currentLang].folder + ' • ' + daysLeft(f) + ' ' + DICT[currentLang].days_left, f.id, true)); });
            files.forEach(f => { const type = getFileType(f.name); const icon = '<div class="p-3 rounded-xl flex items-center justify-center shrink-0 ' + colors[type] + '"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg></div>'; container.appendChild(trashCard(icon, f.name, formatBytes(f.size || 0) + ' • ' + daysLeft(f) + ' ' + DICT[currentLang].days_left, f.id, false)); });
        }
        async function copyToClip(text) { try { await navigator.clipboard.writeText(text); showToast(DICT[currentLang].copied); } catch (e) { showToast(text); } }
        function openItem(id) { const f = fileSystem.files.find(x => x.id === id); if (f) window.open(f.url, '_blank', 'noopener'); }
        async function copyShare(id) { const f = fileSystem.files.find(x => x.id === id); if (!f) return; if (f.shareId) { await copyToClip(location.origin + '/s/' + f.shareId); return; } await shareItem(id); }
        function trashCard(icon, name, meta, id, isFolder) { const el = document.createElement('div'); el.className = 'app-card item-card p-4 flex flex-col gap-3 group relative opacity-80'; el.innerHTML = '<div class="flex items-start gap-3 overflow-hidden">' + icon + '<div class="min-w-0 flex-1 pt-0.5"><p class="font-bold text-sm text-neutral-800 dark:text-neutral-200 truncate" dir="auto" title="' + esc(name) + '">' + esc(name) + '</p><p class="text-[10px] text-neutral-400 mt-0.5 font-mono">' + esc(meta) + '</p></div></div><div class="flex gap-1.5 mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-800/50"><button onclick="restoreItem(\'' + id + '\',' + isFolder + ')" class="flex-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 py-1.5 rounded-lg text-xs font-semibold transition">' + esc(DICT[currentLang].restore) + '</button><button onclick="purgeItem(\'' + id + '\',' + isFolder + ')" class="bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 px-2.5 py-1.5 rounded-lg transition text-xs font-semibold">' + esc(DICT[currentLang].purge) + '</button></div>'; return el; }
        function daysLeft(item) { const keep = (trashSystem && trashSystem.retentionDays) || 30; return Math.max(0, Math.ceil(keep - (Date.now() - (item.deletedAt || Date.now())) / 86400000)); }

        let urlCheckTimeout; let validatedUrl = '';
        function debounceCheckUrl() {
            clearTimeout(urlCheckTimeout);
            const url = document.getElementById('urlInput').value.trim();
            const icon = document.getElementById('urlStatusIcon'); const info = document.getElementById('urlFileInfo'); const btn = document.getElementById('urlBtn');
            btn.disabled = true; info.classList.add('hidden'); validatedUrl = '';
            if (!/^https?:\/\//i.test(url)) { icon.innerHTML = ''; icon.classList.add('hidden'); return; }
            icon.innerHTML = SPINNER; icon.classList.remove('hidden');
            urlCheckTimeout = setTimeout(async () => {
                try {
                    const data = await api('/api/check-url', { method: 'POST', body: { url } });
                    icon.textContent = '✅'; info.textContent = data.name + ' (' + formatBytes(data.size) + ')';
                    info.className = 'text-xs text-emerald-600 dark:text-emerald-400 px-2 font-bold flex items-center gap-1.5 transition-all';
                    validatedUrl = url; btn.disabled = false;
                } catch (e) {
                    icon.textContent = '❌'; info.textContent = e.message;
                    info.className = 'text-xs text-rose-600 dark:text-rose-400 px-2 font-bold flex items-center gap-1.5 transition-all';
                }
            }, 600);
        }

        function uploadUI() {
            const dropzone = document.getElementById('dropzone');
            const pc = document.getElementById('upload-progress-container');
            const bar = document.getElementById('progress-bar'), pct = document.getElementById('progress-percent'), stats = document.getElementById('progress-stats'), text = document.getElementById('progress-text');
            return {
                start(label) { pc.classList.remove('hidden'); dropzone.classList.add('pointer-events-none'); bar.style.width = '0%'; pct.innerText = '0%'; stats.innerText = ''; text.innerText = label || DICT[currentLang].uploading; },
                update(done, total) { const p = total ? Math.min(100, Math.round(done / total * 100)) : 0; bar.style.width = p + '%'; pct.innerText = total ? p + '%' : '…'; stats.innerText = formatBytes(done) + (total ? ' / ' + formatBytes(total) : ''); },
                label(t) { text.innerText = t; },
                end() { pc.classList.add('hidden'); dropzone.classList.remove('pointer-events-none'); }
            };
        }

        async function startUrlUpload() {
            if (!validatedUrl) return;
            const ui = uploadUI(); const urlInput = document.getElementById('urlInput');
            ui.start(DICT[currentLang].uploading);
            try {
                const res = await fetch('/api/upload-url', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: validatedUrl, folderId: currentFolder }) });
                if (res.status === 401) { location.href = '/'; return; }
                if ((res.headers.get('content-type') || '').indexOf('application/json') > -1) { const j = await res.json(); throw new Error(errText(j.error)); }
                const reader = res.body.getReader(); const decoder = new TextDecoder(); let buf = ''; let finished = false;
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    buf += decoder.decode(value, { stream: true });
                    let idx;
                    while ((idx = buf.indexOf('\n')) >= 0) {
                        const line = buf.slice(0, idx).trim(); buf = buf.slice(idx + 1);
                        if (!line) continue;
                        let msg; try { msg = JSON.parse(line); } catch (e) { continue; }
                        if (msg.error) throw new Error(errText(msg.error));
                        if (msg.done) finished = true;
                        else if (msg.p !== undefined) ui.update(msg.p, msg.t);
                    }
                }
                if (!finished) throw new Error(DICT[currentLang].err_fail);
                ui.update(1, 1); showToast(DICT[currentLang].uploaded); loadUsage();
                urlInput.value = ''; validatedUrl = ''; document.getElementById('urlBtn').disabled = true; document.getElementById('urlFileInfo').classList.add('hidden'); document.getElementById('urlStatusIcon').classList.add('hidden');
                setTimeout(() => { ui.end(); switchView('history'); }, 400);
            } catch (e) { showToast(e.message || DICT[currentLang].err_net, true); ui.end(); }
        }

        document.getElementById('fileInput').addEventListener('change', async (e) => {
            const file = e.target.files[0]; if (!file) return;
            const storageType = document.querySelector('input[name="storageType"]:checked').value;
            const input = e.target;
            if (file.size === 0) { showToast(DICT[currentLang].err_empty_file, true); input.value = ''; return; }
            if (storageType === 'tg' && file.size > 20 * 1024 * 1024) { showToast(DICT[currentLang].err_size_tg, true); input.value = ''; return; }
            if (storageType === 'r2' && file.size > 10 * 1024 * 1024 * 1024) { showToast(DICT[currentLang].err_size_r2, true); input.value = ''; return; }
            if (storageType === 'r2' && usageData && usageData.r2 && usageData.r2.limitGb > 0 && usageData.r2.bytes + file.size > usageData.r2.limitGb * 1e9) { if (!confirm(DICT[currentLang].usage_over_confirm)) { input.value = ''; return; } }
            const ui = uploadUI(); ui.start(DICT[currentLang].uploading); ui.update(0, file.size);
            let session = null;
            try {
                if (storageType === 'r2') {
                    session = await api('/api/r2/create', { method: 'POST', body: { name: file.name, size: file.size, type: file.type, folderId: currentFolder } });
                    const chunkSize = 10 * 1024 * 1024; const totalParts = Math.ceil(file.size / chunkSize); const parts = []; let uploaded = 0;
                    for (let i = 0; i < totalParts; i++) {
                        const n = i + 1; const chunk = file.slice(i * chunkSize, Math.min((i + 1) * chunkSize, file.size));
                        let attempt = 0, etag = null;
                        while (!etag) {
                            try {
                                const res = await fetch('/api/r2/part?key=' + encodeURIComponent(session.key) + '&uploadId=' + encodeURIComponent(session.uploadId) + '&n=' + n, { method: 'PUT', body: chunk });
                                if (res.status === 401) { location.href = '/'; return; }
                                if (!res.ok) throw new Error('part failed');
                                etag = (await res.json()).etag;
                                ui.label(DICT[currentLang].uploading);
                            } catch (err) {
                                if (++attempt >= 5) throw new Error(DICT[currentLang].err_fail);
                                ui.label(DICT[currentLang].resuming);
                                await new Promise(r => setTimeout(r, 2000 * attempt));
                            }
                        }
                        parts.push({ partNumber: n, etag }); uploaded += chunk.size; ui.update(uploaded, file.size);
                    }
                    await api('/api/r2/complete', { method: 'POST', body: { key: session.key, uploadId: session.uploadId, parts, name: file.name, folderId: currentFolder } });
                    session = null;
                    showToast(DICT[currentLang].uploaded); input.value = ''; ui.end(); loadUsage(); switchView('history');
                } else {
                    const fd = new FormData(); fd.append('file', file); fd.append('folderId', currentFolder); fd.append('asMedia', document.getElementById('opt-media').checked ? '1' : '0');
                    await new Promise((resolve, reject) => {
                        const xhr = new XMLHttpRequest(); xhr.open('POST', '/api/upload');
                        xhr.upload.onprogress = (ev) => { if (ev.lengthComputable) ui.update(ev.loaded, ev.total); };
                        xhr.onload = () => { let j = {}; try { j = JSON.parse(xhr.responseText); } catch (er) {} if (xhr.status === 401) { location.href = '/'; return resolve(); } if (xhr.status >= 200 && xhr.status < 300 && j.success) resolve(); else reject(new Error(errText(j.error))); };
                        xhr.onerror = () => reject(new Error(DICT[currentLang].err_net));
                        xhr.send(fd);
                    });
                    showToast(DICT[currentLang].uploaded); input.value = ''; ui.end(); switchView('history');
                }
            } catch (err) {
                if (session) fetch('/api/r2/abort', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: session.key, uploadId: session.uploadId }) }).catch(() => {});
                showToast(err.message || DICT[currentLang].err_fail, true); input.value = ''; ui.end();
            }
        });
    
