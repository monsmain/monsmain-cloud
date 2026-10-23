import { Utils } from '../utils.js';

export class Database {
    static _chain = Promise.resolve();
    constructor(kv) { this.kv = kv; }
    _tx(fn) { const run = Database._chain.then(() => fn()); Database._chain = run.catch(() => {}); return run; }

    async getUserLang(chatId) { return (await this.kv.get(`lang_${chatId}`)) || 'fa'; }
    async setUserLang(chatId, lang) { await this.kv.put(`lang_${chatId}`, lang); }

    async _load(chatId) {
        const data = await this.kv.get(`fs_${chatId}`);
        const fs = data ? JSON.parse(data) : {};
        return { folders: fs.folders || [], files: fs.files || [] };
    }
    async _save(chatId, fs) { await this.kv.put(`fs_${chatId}`, JSON.stringify(fs)); }

    async getFS(chatId, opts = {}) {
        const fs = await this._load(chatId);
        if (opts.includeTrash) return fs;
        if (opts.onlyTrash) return { folders: fs.folders.filter(f => f.deletedAt), files: fs.files.filter(f => f.deletedAt) };
        return { folders: fs.folders.filter(f => !f.deletedAt), files: fs.files.filter(f => !f.deletedAt) };
    }
    async findFile(chatId, fileId, opts = {}) {
        const fs = await this._load(chatId);
        const f = fs.files.find(x => x.id === fileId);
        if (!f) return null;
        if (f.deletedAt && !opts.includeTrash) return null;
        return f;
    }
    async findFileBy(chatId, predicate) {
        const fs = await this._load(chatId);
        return fs.files.find(f => !f.deletedAt && predicate(f)) || null;
    }

    addFolder(chatId, name) {
        return this._tx(async () => {
            const fs = await this._load(chatId);
            const folder = { id: 'd_' + Utils.generateId(), name: Utils.cleanName(name, 'Folder'), date: Date.now(), deletedAt: null };
            fs.folders.unshift(folder); await this._save(chatId, fs); return folder;
        });
    }
    deleteFolder(chatId, folderId) {
        return this._tx(async () => {
            const fs = await this._load(chatId);
            const folder = fs.folders.find(f => f.id === folderId && !f.deletedAt);
            if (!folder) return false;
            const now = Date.now();
            folder.deletedAt = now;
            fs.files.forEach(f => { if (f.folderId === folderId && !f.deletedAt) { f.deletedAt = now; f.originFolderId = folderId; f.viaFolder = true; } });
            await this._save(chatId, fs); return true;
        });
    }
    restoreFolder(chatId, folderId) {
        return this._tx(async () => {
            const fs = await this._load(chatId);
            const folder = fs.folders.find(f => f.id === folderId && f.deletedAt);
            if (!folder) return false;
            const trashedAt = folder.deletedAt;
            folder.deletedAt = null;
            fs.files.forEach(f => { const viaFolder = f.viaFolder === true || (f.viaFolder === undefined && f.deletedAt >= trashedAt);  if (f.deletedAt && viaFolder && f.originFolderId === folderId) { f.folderId = folderId; f.originFolderId = null; f.viaFolder = false; f.deletedAt = null; } });
            await this._save(chatId, fs); return true;
        });
    }
    purgeFolder(chatId, folderId) {
        return this._tx(async () => {
            const fs = await this._load(chatId);
            const folder = fs.folders.find(f => f.id === folderId && f.deletedAt);
            if (!folder) return [];
            const removed = fs.files.filter(f => f.deletedAt && (f.originFolderId === folderId || f.folderId === folderId));
            const ids = new Set(removed.map(f => f.id));
            fs.files = fs.files.filter(f => !ids.has(f.id));
            fs.files.forEach(f => { if (f.folderId === folderId) f.folderId = null; });
            fs.folders = fs.folders.filter(f => f.id !== folderId);
            await this._save(chatId, fs);
            await Promise.all(removed.filter(f => f.shareId).map(f => this.kv.delete(`share_${f.shareId}`).catch(() => {})));
            return removed;
        });
    }

    addFile(chatId, fileData) {
        return this._tx(async () => {
            const fs = await this._load(chatId);
            const folderOk = fileData.folderId && fs.folders.some(f => f.id === fileData.folderId && !f.deletedAt);
            const file = { ...fileData, name: Utils.cleanName(fileData.name), folderId: folderOk ? fileData.folderId : null, deletedAt: null, originFolderId: null, shareId: null };
            fs.files.unshift(file); await this._save(chatId, fs); return file;
        });
    }
    deleteFile(chatId, fileId) {
        return this._tx(async () => {
            const fs = await this._load(chatId);
            const file = fs.files.find(f => f.id === fileId && !f.deletedAt);
            if (!file) return false;
            file.deletedAt = Date.now(); file.originFolderId = file.folderId; file.viaFolder = false;
            await this._save(chatId, fs); return true;
        });
    }
    restoreFile(chatId, fileId) {
        return this._tx(async () => {
            const fs = await this._load(chatId);
            const file = fs.files.find(f => f.id === fileId && f.deletedAt);
            if (!file) return false;
            const home = file.originFolderId && fs.folders.find(fld => fld.id === file.originFolderId && !fld.deletedAt);
            file.folderId = home ? file.originFolderId : null; file.originFolderId = null; file.viaFolder = false; file.deletedAt = null;
            await this._save(chatId, fs); return true;
        });
    }
    purgeFile(chatId, fileId) {
        return this._tx(async () => {
            const fs = await this._load(chatId);
            const file = fs.files.find(f => f.id === fileId && f.deletedAt);
            if (!file) return null;
            fs.files = fs.files.filter(f => f.id !== fileId);
            await this._save(chatId, fs);
            if (file.shareId) await this.kv.delete(`share_${file.shareId}`).catch(() => {});
            return file;
        });
    }
    moveFile(chatId, fileId, newFolderId) {
        return this._tx(async () => {
            const fs = await this._load(chatId);
            const file = fs.files.find(f => f.id === fileId && !f.deletedAt);
            if (!file) return false;
            if (newFolderId && newFolderId !== 'root' && !fs.folders.some(f => f.id === newFolderId && !f.deletedAt)) return false;
            file.folderId = newFolderId === 'root' ? null : newFolderId;
            await this._save(chatId, fs); return true;
        });
    }
    shareFile(chatId, fileId) {
        return this._tx(async () => {
            const fs = await this._load(chatId);
            const file = fs.files.find(f => f.id === fileId && !f.deletedAt);
            if (!file) return null;
            if (!file.shareId) { file.shareId = crypto.randomUUID(); await this._save(chatId, fs); }
            await this.kv.put(`share_${file.shareId}`, JSON.stringify({ chatId, fileId: file.id }));
            return file.shareId;
        });
    }
    revokeShare(chatId, fileId) {
        return this._tx(async () => {
            const fs = await this._load(chatId);
            const file = fs.files.find(f => f.id === fileId);
            if (file && file.shareId) { await this.kv.delete(`share_${file.shareId}`).catch(() => {}); file.shareId = null; await this._save(chatId, fs); return true; }
            return false;
        });
    }
    deleteFiles(chatId, ids) {
        return this._tx(async () => {
            const fs = await this._load(chatId); const set = new Set(ids); const now = Date.now(); let n = 0;
            fs.files.forEach(f => { if (set.has(f.id) && !f.deletedAt) { f.deletedAt = now; f.originFolderId = f.folderId; f.viaFolder = false; n++; } });
            if (n) await this._save(chatId, fs); return n;
        });
    }
    moveFiles(chatId, ids, newFolderId) {
        return this._tx(async () => {
            const fs = await this._load(chatId); const set = new Set(ids);
            if (newFolderId && newFolderId !== 'root' && !fs.folders.some(f => f.id === newFolderId && !f.deletedAt)) return 0;
            let n = 0; fs.files.forEach(f => { if (set.has(f.id) && !f.deletedAt) { f.folderId = newFolderId === 'root' ? null : newFolderId; n++; } });
            if (n) await this._save(chatId, fs); return n;
        });
    }
    purgeExpired(chatId, ageMs) {
        return this._tx(async () => {
            const fs = await this._load(chatId); const cutoff = Date.now() - ageMs;
            const goneFolders = new Set(fs.folders.filter(f => f.deletedAt && f.deletedAt < cutoff).map(f => f.id));
            const removed = fs.files.filter(f => f.deletedAt && (f.deletedAt < cutoff || goneFolders.has(f.originFolderId) || goneFolders.has(f.folderId)));
            if (!removed.length && !goneFolders.size) return [];
            const ids = new Set(removed.map(f => f.id));
            fs.files = fs.files.filter(f => !ids.has(f.id)); fs.folders = fs.folders.filter(f => !goneFolders.has(f.id));
            await this._save(chatId, fs);
            await Promise.all(removed.filter(f => f.shareId).map(f => this.kv.delete(`share_${f.shareId}`).catch(() => {})));
            return removed;
        });
    }
    async resolveShare(shareId) { const data = await this.kv.get(`share_${shareId}`); return data ? JSON.parse(data) : null; }
}
