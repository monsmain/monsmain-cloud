// Login, first-time setup, password recovery and the panel / login pages.
import { ensureWebhook, setupBotCommands } from '../bot/webhook.js';
import { CONFIG } from '../config.js';
import { maybeCleanup } from '../lib/maintenance.js';
import { CHATID_RE, TOKEN_RE, Telegram, asciiDigits, stripInvisible } from '../lib/telegram.js';
import { Password } from '../security/password.js';
import { RateLimit } from '../security/rate-limit.js';
import { Session } from '../security/session.js';
import { AuthPage } from '../ui/auth-page.js';
import { WebApp } from '../ui/panel.generated.js';
import { Utils } from '../utils.js';

// Returns a Response when the request belongs to the auth pages, otherwise null.
export async function authRoutes(c) {
    const { request, env, ctx, url, method, path, passHash, botToken, chatId, sessionSecret, webhookSecret, setupToken, db, tg, isAuth, ip } = c;
    // ---------- Auth pages ----------
    if (method === 'GET' && path === '/') {
        if (isAuth) {
            if (botToken && !webhookSecret) ctx.waitUntil(ensureWebhook(env, botToken, url.origin)); // upgrade older installs
            ctx.waitUntil(maybeCleanup(env));
            return Utils.htmlResp(WebApp());
        }
        return Utils.htmlResp(AuthPage(passHash ? 'login' : 'signup', { setupRequired: !!setupToken, key: url.searchParams.get('key') || '' }));
    }
    if (method === 'GET' && path === '/auth/reset') return passHash ? Utils.htmlResp(AuthPage('reset')) : Utils.redirect('/');
    if (method === 'GET' && path === '/auth/verify') return passHash ? Utils.htmlResp(AuthPage('verify')) : Utils.redirect('/');
    if (path === '/logout' && (method === 'GET' || method === 'POST')) return Utils.redirect('/', Session.clearCookie());

    if (method === 'POST' && path === '/auth/signup') {
        const keyOpts = { setupRequired: !!setupToken };
        if (passHash) return Utils.htmlResp(AuthPage('login', { err: 'already' }), 409);
        if (await RateLimit.count(env.DB, `signup_${ip}`) >= 10) return Utils.htmlResp(AuthPage('signup', { ...keyOpts, err: 'too_many' }), 429);
        const fd = await request.formData();
        const pwd = String(fd.get('pwd') || ''), newToken = stripInvisible(fd.get('botToken')), newChat = asciiDigits(stripInvisible(fd.get('chatId'))), setupKey = stripInvisible(fd.get('setupKey'));
        const fail = async (err, status = 400, detail = '') => { await RateLimit.hit(env.DB, `signup_${ip}`, CONFIG.loginWindow); return Utils.htmlResp(AuthPage('signup', { ...keyOpts, key: setupKey, err, detail }), status); };
        if (setupToken && !Utils.timingSafeEqual(setupKey, setupToken)) return fail('bad_key', 403);
        if (pwd.length < CONFIG.minPassword) return fail('weak_password');
        if (!TOKEN_RE.test(newToken)) return fail('bad_token_format');
        if (!CHATID_RE.test(newChat)) return fail('bad_chat');
        const bot = new Telegram(newToken);
        const me = await bot.getMe();
        if (!me.ok) return fail('bad_token', 400, me.description);
        const hello = await bot.sendMessage(newChat, '✅ monsmain-cloud is ready / پنل آماده شد');
        if (!hello.ok) return fail('chat_unreachable', 400, hello.description);
        const secret = Utils.randomToken(24);
        const wh = await bot.setWebhook(`${url.origin}/hook`, secret);
        if (!wh.ok) return fail('webhook_failed', 400, wh.description);
        await setupBotCommands(bot); // adds /start (and /menu) to the bot's command menu
        const newSession = Utils.randomToken();
        await Promise.all([
            env.DB.put('site_password_hash', await Password.hash(pwd)), env.DB.put('tg_bot_token', newToken), env.DB.put('tg_chat_id', newChat),
            env.DB.put('session_secret', newSession), env.DB.put('webhook_secret', secret)
        ]);
        await RateLimit.clear(env.DB, `signup_${ip}`);
        return Utils.redirect('/', Session.cookie(await Session.create(newSession)));
    }

    if (method === 'POST' && path === '/auth/login') {
        if (!passHash) return Utils.redirect('/');
        if (await RateLimit.count(env.DB, `login_${ip}`) >= CONFIG.loginMaxFails) return Utils.htmlResp(AuthPage('login', { err: 'too_many' }), 429);
        const pwd = String((await request.formData()).get('pwd') || '');
        if (await Password.verify(pwd, passHash)) {
            await RateLimit.clear(env.DB, `login_${ip}`);
            if (Password.needsUpgrade(passHash)) await env.DB.put('site_password_hash', await Password.hash(pwd));
            let secret = sessionSecret; if (!secret) { secret = Utils.randomToken(); await env.DB.put('session_secret', secret); }
            return Utils.redirect('/', Session.cookie(await Session.create(secret)));
        }
        await RateLimit.hit(env.DB, `login_${ip}`, CONFIG.loginWindow);
        return Utils.htmlResp(AuthPage('login', { err: 'bad_password' }), 401);
    }

    if (method === 'POST' && path === '/auth/reset') {
        if (!tg || !chatId) return Utils.htmlResp(AuthPage('reset', { err: 'no_bot' }), 400);
        if (await RateLimit.count(env.DB, `reset_${ip}`) >= 3 || await RateLimit.count(env.DB, 'reset_all') >= 10) return Utils.htmlResp(AuthPage('reset', { err: 'too_many' }), 429);
        const newPwd = String((await request.formData()).get('pwd') || '');
        if (newPwd.length < CONFIG.minPassword) return Utils.htmlResp(AuthPage('reset', { err: 'weak_password' }), 400);
        await RateLimit.hit(env.DB, `reset_${ip}`, 3600); await RateLimit.hit(env.DB, 'reset_all', 3600);
        const code = Utils.generateCode();
        await env.DB.put('reset_pending', JSON.stringify({ code, hash: await Password.hash(newPwd), attempts: 0 }), { expirationTtl: 600 });
        await tg.sendMessage(chatId, `🔐 <b>درخواست تغییر رمز عبور پنل / Panel password reset</b>\n\n<code>${code}</code>\n\n10 min`);
        return Utils.redirect('/auth/verify');
    }

    if (method === 'POST' && path === '/auth/verify') {
        if (await RateLimit.count(env.DB, `verify_${ip}`) >= CONFIG.loginMaxFails) return Utils.htmlResp(AuthPage('verify', { err: 'too_many' }), 429);
        const input = String((await request.formData()).get('pwd') || '').trim();
        const raw = await env.DB.get('reset_pending');
        const pending = raw ? JSON.parse(raw) : null;
        if (pending && Utils.timingSafeEqual(input, pending.code)) {
            const newSession = Utils.randomToken();
            await env.DB.put('site_password_hash', pending.hash);
            await env.DB.put('session_secret', newSession); // signs out all other sessions
            await env.DB.delete('reset_pending'); await RateLimit.clear(env.DB, `verify_${ip}`);
            return Utils.redirect('/', Session.cookie(await Session.create(newSession)));
        }
        await RateLimit.hit(env.DB, `verify_${ip}`, CONFIG.loginWindow);
        if (pending) { pending.attempts++; if (pending.attempts >= CONFIG.loginMaxFails) await env.DB.delete('reset_pending'); else await env.DB.put('reset_pending', JSON.stringify(pending), { expirationTtl: 600 }); }
        return Utils.htmlResp(AuthPage('verify', { err: 'bad_code' }), 401);
    }
    return null; // not handled here
}
