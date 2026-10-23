import { Telegram } from './lib/telegram.js';

export const VERSION = '1.0.0';

export const CONFIG = {
    maxTgSize: 20 * 1024 * 1024,
    maxR2Size: 10 * 1024 * 1024 * 1024,
    partSize: 10 * 1024 * 1024,
    botUrlMax: 200 * 1024 * 1024,
    sessionTtl: 30 * 24 * 3600,
    pbkdf2Iter: 50000,
    loginMaxFails: 5,
    loginWindow: 900,
    signedLinkTtl: 3600,
    minPassword: 8,
    trashDays: 30,
    cleanupEverySec: 6 * 3600,
    usageCacheSec: 600,
    r2LimitGbDefault: 10,
    usageAlertLevels: [80, 95]
};
