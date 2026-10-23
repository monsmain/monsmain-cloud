import { CONFIG, VERSION } from '../config.js';
import { Telegram } from '../lib/telegram.js';
import { PWA_REGISTER, PWA_TAGS } from '../pwa.js';
import { Password } from '../security/password.js';
import { FAVICON_TAGS, ICON_CLOUD, ICON_MOON, ICON_SUN, THEME_BOOT } from './shared.js';
import { UI_CONTROLS_CSS, UI_PAGE_CSS } from './styles.generated.js';
import { Utils } from '../utils.js';

export const AuthPage = (mode, opts = {}) => {
    const attr = (s) => Utils.esc(s).replace(/"/g, '&quot;');
    const field = (id, labelId, inner) => `<div><label for="${id}" id="lbl-${labelId}"></label>${inner}</div>`;
    const fields = {
        signup: `${opts.setupRequired ? field('f-key', 'key', `<input id="f-key" class="mono" type="text" name="setupKey" required autocomplete="off" value="${attr(opts.key || '')}" placeholder="••••••••">`) : ''}
            ${field('f-token', 'token', '<input id="f-token" class="mono" type="text" name="botToken" required autocomplete="off" spellcheck="false" placeholder="123456789:AAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx">')}
            ${field('f-chat', 'chatid', '<input id="f-chat" class="mono" type="text" inputmode="numeric" name="chatId" required autocomplete="off" placeholder="12345678">')}
            ${field('f-pass', 'pass', `<input id="f-pass" type="password" name="pwd" required minlength="${CONFIG.minPassword}" autocomplete="new-password" placeholder="••••••••">`)}`,
        login: field('f-pass', 'pass', '<input id="f-pass" type="password" name="pwd" required autocomplete="current-password" placeholder="••••••••">'),
        reset: field('f-pass', 'pass', `<input id="f-pass" type="password" name="pwd" required minlength="${CONFIG.minPassword}" autocomplete="new-password" placeholder="••••••••">`),
        verify: field('f-pass', 'pass', '<input id="f-pass" class="mono" type="text" inputmode="numeric" name="pwd" required pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code" placeholder="••••••" style="text-align:center;letter-spacing:.5em">')
    };
    return `<!DOCTYPE html>
<html lang="en" data-theme="light"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex"><title>monsmain-cloud</title>
${FAVICON_TAGS}${PWA_TAGS}
<link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet">
<script>${THEME_BOOT}</script>
<style>${UI_CONTROLS_CSS}${UI_PAGE_CSS}</style></head>
<body>
<div class="top">
  <div class="brand"><div class="logo">${ICON_CLOUD}</div><span>monsmain-cloud</span></div>
  <div class="pc-controls">
    <div class="pc-seg" role="group" aria-label="Language"><button type="button" id="lang-en" onclick="setLang('en')">EN</button><button type="button" id="lang-fa" onclick="setLang('fa')">فارسی</button></div>
    <button type="button" class="pc-icon" onclick="toggleTheme()" aria-label="Toggle theme">${ICON_SUN}${ICON_MOON}</button>
  </div>
</div>
<form action="/auth/${mode}" method="POST" class="card">
  <h1 id="ui-title">monsmain-cloud</h1><p class="sub" id="ui-sub"></p>
  ${fields[mode]}
  ${mode === 'signup' ? '<p class="sub" style="font-size:.78rem;margin:14px 0 0" id="ui-hint"></p>' : ''}
  <button type="submit" class="btn" id="ui-btn"></button>
  ${mode === 'login' ? '<a href="/auth/reset" class="btn outline" id="ui-link"></a>' : ''}
  ${mode === 'reset' || mode === 'verify' ? '<a href="/" class="btn outline" id="ui-link"></a>' : ''}
  <div id="ui-err" data-code="${attr(opts.err || '')}" data-detail="${attr(opts.detail || '')}" class="alert err ${opts.err ? '' : 'hidden'}"></div>
</form>
<div class="foot">monsmain-cloud v${VERSION}</div>
<script>
var MODE = '${mode}';
var UI = {
 en: { title: {signup:'Workspace Setup', login:'Welcome Back', reset:'Reset Access', verify:'Two-Factor Auth'},
  sub: {signup:'Connect your Telegram bot and choose a master password.', login:'Sign in to monsmain-cloud Drive', reset:'Choose a new master password', verify:'Enter the recovery code sent to your Telegram'},
  btn: {signup:'Initialize Workspace', login:'Sign In', reset:'Send Recovery Code', verify:'Verify & Update'},
  pass: {signup:'Master Password (min ${CONFIG.minPassword} chars)', login:'Password', reset:'New Password (min ${CONFIG.minPassword} chars)', verify:'6-Digit Code'},
  key:'Setup Key', token:'Telegram Bot Token (from @BotFather)', chatid:'Admin Chat ID (from @userinfobot)',
  hint:'Open your bot in Telegram and press Start before submitting, so it can message you.',
  link:{login:'Recover Password', reset:'Return to Login', verify:'Return to Login'},
  err:{bad_password:'Incorrect password.', too_many:'Too many attempts. Try again in 15 minutes.', already:'This panel is already set up.', bad_key:'Invalid setup key.', bad_token:'Telegram rejected this bot token.', bad_token_format:'The token format looks wrong. Copy the whole token from @BotFather (like 123456789:AAxxxxxxxx...).', bad_chat:'Admin Chat ID must be a number.', chat_unreachable:'The bot cannot message this chat. Open the bot in Telegram, press Start, then try again.', webhook_failed:'Could not connect the bot webhook. Check the token and try again.', weak_password:'Password is too short.', bad_code:'Invalid or expired code.', no_bot:'Telegram bot is not configured.', server:'Something went wrong. Please try again.'} },
 fa: { title: {signup:'راه‌اندازی فضای ابری', login:'ورود به پنل', reset:'بازیابی رمز عبور', verify:'تأییدیه دو مرحله‌ای'},
  sub: {signup:'ربات تلگرام را متصل کنید و رمز عبور مدیریت را تعیین کنید.', login:'رمز عبور خود را وارد کنید', reset:'رمز عبور جدید را وارد کنید', verify:'کد ارسال‌شده به تلگرام خود را وارد کنید'},
  btn: {signup:'ایجاد فضای ابری', login:'ورود', reset:'ارسال کد تأیید', verify:'تأیید و تغییر رمز'},
  pass: {signup:'رمز عبور مدیریت (حداقل ${CONFIG.minPassword} کاراکتر)', login:'رمز عبور', reset:'رمز عبور جدید (حداقل ${CONFIG.minPassword} کاراکتر)', verify:'کد ۶ رقمی'},
  key:'کلید راه‌اندازی', token:'توکن ربات تلگرام (از @BotFather)', chatid:'آیدی عددی مدیر (از @userinfobot)',
  hint:'قبل از ثبت، ربات خود را در تلگرام باز کنید و Start بزنید تا بتواند به شما پیام بدهد.',
  link:{login:'فراموشی رمز عبور؟', reset:'بازگشت به ورود', verify:'بازگشت به ورود'},
  err:{bad_password:'رمز عبور اشتباه است.', too_many:'تعداد تلاش‌ها زیاد بود. ۱۵ دقیقه دیگر دوباره امتحان کنید.', already:'این پنل قبلاً راه‌اندازی شده است.', bad_key:'کلید راه‌اندازی نامعتبر است.', bad_token:'تلگرام این توکن ربات را قبول نکرد.', bad_token_format:'قالب توکن درست نیست. کل توکن را از @BotFather کپی کنید (مثل 123456789:AAxxxxxxxx...).', bad_chat:'آیدی عددی مدیر باید عدد باشد.', chat_unreachable:'ربات نمی‌تواند به این چت پیام بدهد. ربات را در تلگرام باز کنید، Start بزنید و دوباره تلاش کنید.', webhook_failed:'اتصال وب‌هوک ربات انجام نشد. توکن را بررسی و دوباره تلاش کنید.', weak_password:'رمز عبور خیلی کوتاه است.', bad_code:'کد نامعتبر یا منقضی است.', no_bot:'ربات تلگرام تنظیم نشده است.', server:'مشکلی پیش آمد. دوباره تلاش کنید.'} }
};
var lang = document.documentElement.lang === 'fa' ? 'fa' : 'en';
function $(id){ return document.getElementById(id); }
function setText(id, text){ var el = $(id); if(el) el.textContent = text; }
function updateUI(){
  var T = UI[lang];
  document.documentElement.lang = lang; document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  setText('ui-title', T.title[MODE]); setText('ui-sub', T.sub[MODE]); setText('ui-btn', T.btn[MODE]); setText('lbl-pass', T.pass[MODE]);
  setText('lbl-key', T.key); setText('lbl-token', T.token); setText('lbl-chatid', T.chatid); setText('ui-hint', T.hint);
  if(T.link[MODE]) setText('ui-link', T.link[MODE]);
  var e = $('ui-err'); if(e && e.dataset.code) e.textContent = (T.err[e.dataset.code] || e.dataset.code) + (e.dataset.detail ? ' (' + e.dataset.detail + ')' : '');
  $('lang-en').setAttribute('aria-pressed', lang === 'en'); $('lang-fa').setAttribute('aria-pressed', lang === 'fa');
}
function setLang(l){ lang = l; localStorage.setItem('lang', l); updateUI(); }
function toggleTheme(){ var d = document.documentElement.getAttribute('data-theme') !== 'dark'; document.documentElement.setAttribute('data-theme', d ? 'dark' : 'light'); localStorage.setItem('theme', d ? 'dark' : 'light'); }
updateUI();
${PWA_REGISTER}
</script></body></html>`;
};
