// Version and tunable limits.
import { Telegram } from './lib/telegram.js';

export const VERSION = '1.0.0';

export const CONFIG = {
    maxTgSize: 20 * 1024 * 1024,         // Telegram Bot API getFile limit (downloads) - also the Telegram-engine upload limit
    maxR2Size: 10 * 1024 * 1024 * 1024,  // 10GB per file (matches the R2 free tier total)
    partSize: 10 * 1024 * 1024,          // multipart part size (R2 needs equal sized parts except the last)
    botUrlMax: 200 * 1024 * 1024,        // remote upload cap for the bot (runs in waitUntil, ~30s after the response)
    sessionTtl: 30 * 24 * 3600,          // 30 days
    pbkdf2Iter: 50000,                   // lower this if you hit CPU limits on the free plan (max 100000)
    loginMaxFails: 5,
    loginWindow: 900,                    // 15 min
    signedLinkTtl: 3600,                 // bot download links live 1 hour
    minPassword: 8,
    trashDays: 30,                       // items in the trash are deleted for good after this many days
    cleanupEverySec: 6 * 3600,           // lazy cleanup throttle (a daily cron does the same when the installer set it up)
    usageCacheSec: 600,                  // bucket listing is cached for 10 minutes
    r2LimitGbDefault: 10,                // R2 free tier; 0 disables the warnings
    usageAlertLevels: [80, 95]           // % of the limit at which the bot warns the admin
};
