import { isOPFSSupported, ensureDir, writeText, writeBlob, readText, readFile, listDir, remove, exists } from './fs';
import type { IDBProject, IDBFileRecord } from './idb';
import * as idb from './idb';

const ROOT_DIR = 'caplayground';
const PROJECTS_DIR = `${ROOT_DIR}/projects`;
const MIGRATION_FLAG = 'caplay_opfs_migrated_v1';

export type StorageProject = IDBProject;
export type StorageFileRecord = IDBFileRecord;

let usingOPFS: boolean | null = null;
export async function isUsingOPFS(): Promise<boolean> {
  if (usingOPFS !== null) return usingOPFS;
  usingOPFS = await isOPFSSupported();
  return usingOPFS;
}

// Background migratio
async function migrateToOPFSIfNeeded() {
  try {
    const supported = await isUsingOPFS();
    if (!supported) return;
    if (typeof window !== 'undefined' && localStorage.getItem(MIGRATION_FLAG) === 'true') return;

    await ensureDir(PROJECTS_DIR);

    const projects = await idb.listProjects();
    for (const p of projects) {
      const base = `${PROJECTS_DIR}/${p.id}`;
      await ensureDir(base);
      const meta = { id: p.id, name: p.name, createdAt: p.createdAt, width: p.width, height: p.height, gyroEnabled: p.gyroEnabled };
      await writeText(`${base}/meta.json`, JSON.stringify(meta));
      const oldFolder = `${p.name}.ca`;
      const all = await idb.listFiles(p.id);
      for (const rec of all) {
        let rel = rec.path;
        if (rel.startsWith(`${oldFolder}/`)) rel = rel.slice(oldFolder.length + 1);
        const target = `${base}/${rel}`;
        const parentDir = target.split('/').slice(0, -1).join('/');
        await ensureDir(parentDir);
        if (rec.type === 'text') {
          await writeText(target, String(rec.data));
        } else {
          const buf = rec.data as ArrayBuffer;
          await writeBlob(target, buf);
        }
      }
    }
    if (typeof window !== 'undefined') localStorage.setItem(MIGRATION_FLAG, 'true');
  } catch {
  }
}

// OPFS
async function opfs_listProjects(): Promise<StorageProject[]> {
  await ensureDir(PROJECTS_DIR);
  const dirs = await listDir(PROJECTS_DIR);
  const out: StorageProject[] = [];
  for (const d of dirs) {
    if (d.kind !== 'directory') continue;
    const metaText = await readText(`${PROJECTS_DIR}/${d.name}/meta.json`);
    if (!metaText) continue;
    try {
      const m = JSON.parse(metaText) as StorageProject;
      out.push(m);
    } catch {}
  }
  return out.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
}

async function opfs_getProject(id: string): Promise<StorageProject | undefined> {
  const t = await readText(`${PROJECTS_DIR}/${id}/meta.json`);
  if (!t) return undefined;
  try { return JSON.parse(t) as StorageProject; } catch { return undefined; }
}

async function opfs_createProject(p: StorageProject): Promise<void> {
  const base = `${PROJECTS_DIR}/${p.id}`;
  await ensureDir(base);
  await writeText(`${base}/meta.json`, JSON.stringify(p));
}

async function opfs_updateProject(p: StorageProject): Promise<void> {
  const base = `${PROJECTS_DIR}/${p.id}`;
  await ensureDir(base);
  await writeText(`${base}/meta.json`, JSON.stringify(p));
}

async function opfs_deleteProject(id: string): Promise<void> {
  const base = `${PROJECTS_DIR}/${id}`;
  await remove(base, { recursive: true });
}

async function opfs_putTextFile(projectId: string, path: string, data: string): Promise<void> {
  const base = `${PROJECTS_DIR}/${projectId}`;
  const meta = await opfs_getProject(projectId);
  const nameFolder = `${(meta?.name || projectId)}.ca/`;
  const rel = path.startsWith(nameFolder) ? path.slice(nameFolder.length) : path;
  const full = `${base}/${rel}`;
  await ensureDir(full.split('/').slice(0, -1).join('/'));
  await writeText(full, data);
}

async function opfs_putBlobFile(projectId: string, path: string, data: Blob | ArrayBuffer): Promise<void> {
  const base = `${PROJECTS_DIR}/${projectId}`;
  const meta = await opfs_getProject(projectId);
  const nameFolder = `${(meta?.name || projectId)}.ca/`;
  const rel = path.startsWith(nameFolder) ? path.slice(nameFolder.length) : path;
  const full = `${base}/${rel}`;
  await ensureDir(full.split('/').slice(0, -1).join('/'));
  await writeBlob(full, data);
}

async function opfs_putBlobFilesBatch(projectId: string, files: Array<{ path: string; data: Blob | ArrayBuffer }>): Promise<void> {
  for (const f of files) await opfs_putBlobFile(projectId, f.path, f.data);
}

async function opfs_getFile(projectId: string, path: string): Promise<StorageFileRecord | undefined> {
  const base = `${PROJECTS_DIR}/${projectId}`;
  const meta = await opfs_getProject(projectId);
  const nameFolder = `${(meta?.name || projectId)}.ca/`;
  const rel = path.startsWith(nameFolder) ? path.slice(nameFolder.length) : path;
  const full = `${base}/${rel}`;
  const isTextPath = (p: string) => /\.(caml|xml|plist|json|txt|md|svg)$/i.test(p);
  const b = await readFile(full);
  if (b !== null) {
    if (isTextPath(rel)) {
      const t = await readText(full);
      if (t !== null) return { id: `${projectId}:${path}`, projectId, path, type: 'text', data: t };
    }
    return { id: `${projectId}:${path}`, projectId, path, type: 'blob', data: b };
  }
  return undefined;
}

async function walkDir(rootPath: string, prefix: string): Promise<StorageFileRecord[]> {
  const out: StorageFileRecord[] = [];
  const entries = await listDir(rootPath);
  for (const e of entries) {
    const p = `${rootPath}/${e.name}`;
    if (e.kind === 'directory') {
      const nested = await walkDir(p, `${prefix}${e.name}/`);
      out.push(...nested);
    } else {
      const rel = `${prefix}${e.name}`;
      const isTextPath = (rp: string) => /\.(caml|xml|plist|json|txt|md|svg)$/i.test(rp);
      if (isTextPath(rel)) {
        const t = await readText(`${rootPath}/${e.name}`);
        if (t !== null) out.push({ id: `${rel}`, projectId: '', path: rel, type: 'text', data: t });
        else {
          const b = await readFile(`${rootPath}/${e.name}`);
          if (b !== null) out.push({ id: `${rel}`, projectId: '', path: rel, type: 'blob', data: b });
        }
      } else {
        const b = await readFile(`${rootPath}/${e.name}`);
        if (b !== null) out.push({ id: `${rel}`, projectId: '', path: rel, type: 'blob', data: b });
      }
    }
  }
  return out;
}

async function opfs_listFiles(projectId: string, prefix?: string): Promise<StorageFileRecord[]> {
  const base = `${PROJECTS_DIR}/${projectId}`;
  const existsBase = await exists(base);
  if (!existsBase) return [];
  const meta = await opfs_getProject(projectId);
  const nameFolder = `${(meta?.name || projectId)}.ca`;
  const all = await walkDir(base, '');
  const normalized = all.map(r => ({
    ...r,
    path: `${nameFolder}/${r.path}`,
  }));
  const withProj = normalized.map(r => ({ ...r, id: `${projectId}:${r.path}`, projectId }));
  return prefix ? withProj.filter(r => r.path.startsWith(prefix)) : withProj;
}

async function opfs_deleteFile(projectId: string, path: string): Promise<void> {
  const full = `${PROJECTS_DIR}/${projectId}/${path}`;
  await remove(full, { recursive: false });
}

export async function listProjects(): Promise<StorageProject[]> {
  const supported = await isUsingOPFS();
  if (supported) {
    await migrateToOPFSIfNeeded();
    return opfs_listProjects();
  }
  return idb.listProjects();
}

export async function getProject(id: string): Promise<StorageProject | undefined> {
  const supported = await isUsingOPFS();
  if (supported) return opfs_getProject(id);
  return idb.getProject(id);
}

export async function createProject(p: StorageProject): Promise<void> {
  const supported = await isUsingOPFS();
  if (supported) return opfs_createProject(p);
  return idb.createProject(p);
}

export async function updateProject(p: StorageProject): Promise<void> {
  const supported = await isUsingOPFS();
  if (supported) return opfs_updateProject(p);
  return idb.updateProject(p);
}

export async function deleteProject(id: string): Promise<void> {
  const supported = await isUsingOPFS();
  if (supported) return opfs_deleteProject(id);
  return idb.deleteProject(id);
}

export async function putTextFile(projectId: string, path: string, data: string): Promise<void> {
  const supported = await isUsingOPFS();
  if (supported) return opfs_putTextFile(projectId, path, data);
  return idb.putTextFile(projectId, path, data);
}

export async function putBlobFile(projectId: string, path: string, data: Blob | ArrayBuffer): Promise<void> {
  const supported = await isUsingOPFS();
  if (supported) return opfs_putBlobFile(projectId, path, data);
  return idb.putBlobFile(projectId, path, data);
}

export async function putBlobFilesBatch(projectId: string, files: Array<{ path: string; data: Blob | ArrayBuffer }>): Promise<void> {
  const supported = await isUsingOPFS();
  if (supported) return opfs_putBlobFilesBatch(projectId, files);
  return idb.putBlobFilesBatch(projectId, files);
}

export async function getFile(projectId: string, path: string): Promise<StorageFileRecord | undefined> {
  const supported = await isUsingOPFS();
  if (supported) return opfs_getFile(projectId, path);
  return idb.getFile(projectId, path);
}

export async function listFiles(projectId: string, prefix?: string): Promise<StorageFileRecord[]> {
  const supported = await isUsingOPFS();
  if (supported) return opfs_listFiles(projectId, prefix);
  return idb.listFiles(projectId, prefix);
}

export async function deleteFile(projectId: string, path: string): Promise<void> {
  const supported = await isUsingOPFS();
  if (supported) return opfs_deleteFile(projectId, path);
  return idb.deleteFile(projectId, path);
}

export async function ensureUniqueProjectName(base: string): Promise<string> {
  const existing = (await listProjects()).map(p => p.name);
  if (!existing.includes(base)) return base;
  let i = 1;
  while (existing.includes(`${base} (${i})`)) i++;
  return `${base} (${i})`;
}
