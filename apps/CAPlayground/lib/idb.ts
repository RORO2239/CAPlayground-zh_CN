export type IDBProject = {
  id: string;
  name: string;
  createdAt: string;
  width: number;
  height: number;
  gyroEnabled?: boolean;
};

export type IDBFileRecord = {
  id: string;
  projectId: string;
  path: string;
  type: 'text' | 'blob';
  data: string | ArrayBuffer;
};

const DB_NAME = 'caplayground-db';
const DB_VERSION = 1;

function promisify<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('projects')) {
        const s = db.createObjectStore('projects', { keyPath: 'id' });
        s.createIndex('by_name', 'name', { unique: true });
      }
      if (!db.objectStoreNames.contains('files')) {
        const s = db.createObjectStore('files', { keyPath: 'id' });
        s.createIndex('by_project', 'projectId', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(db: IDBDatabase, mode: IDBTransactionMode = 'readonly') {
  return db.transaction(['projects', 'files'], mode);
}

// Projects
export async function listProjects(): Promise<IDBProject[]> {
  const db = await openDB();
  const t = tx(db);
  const store = t.objectStore('projects');
  const req = store.getAll();
  const res = await promisify(req);
  db.close();
  return Array.isArray(res) ? res : [];
}

export async function getProject(id: string): Promise<IDBProject | undefined> {
  const db = await openDB();
  const t = tx(db);
  const store = t.objectStore('projects');
  const res = await promisify(store.get(id));
  db.close();
  return res as any;
}

export async function getProjectByName(name: string): Promise<IDBProject | undefined> {
  const db = await openDB();
  const t = tx(db);
  const store = t.objectStore('projects');
  const idx = store.index('by_name');
  try {
    const res = await promisify(idx.get(name));
    db.close();
    return res as any;
  } catch (e) {
    db.close();
    return undefined;
  }
}

export async function createProject(p: IDBProject): Promise<void> {
  const db = await openDB();
  const t = tx(db, 'readwrite');
  const store = t.objectStore('projects');
  await promisify(store.add(p));
  db.close();
}

export async function updateProject(p: IDBProject): Promise<void> {
  const db = await openDB();
  const t = tx(db, 'readwrite');
  const store = t.objectStore('projects');
  await promisify(store.put(p));
  db.close();
}

export async function deleteProject(id: string): Promise<void> {
  const db = await openDB();
  const t = tx(db, 'readwrite');
  await promisify(t.objectStore('projects').delete(id));
  // cascade delete files
  const filesIdx = t.objectStore('files').index('by_project');
  const range = IDBKeyRange.only(id);
  const toDelete: string[] = [];
  await new Promise<void>((resolve, reject) => {
    const req = filesIdx.openCursor(range);
    req.onsuccess = () => {
      const cursor = req.result as IDBCursorWithValue | null;
      if (!cursor) return resolve();
      const rec = cursor.value as IDBFileRecord;
      toDelete.push(rec.id);
      cursor.continue();
    };
    req.onerror = () => reject(req.error);
  });
  for (const key of toDelete) {
    await promisify(t.objectStore('files').delete(key));
  }
  db.close();
}

// Files
export async function putTextFile(projectId: string, path: string, data: string): Promise<void> {
  const db = await openDB();
  const t = tx(db, 'readwrite');
  const rec: IDBFileRecord = { id: `${projectId}:${path}`, projectId, path, type: 'text', data };
  await promisify(t.objectStore('files').put(rec));
  db.close();
}

export async function putBlobFile(projectId: string, path: string, data: Blob | ArrayBuffer): Promise<void> {
  const db = await openDB();
  const t = tx(db, 'readwrite');
  const buffer = data instanceof Blob ? await data.arrayBuffer() : data;
  const rec: IDBFileRecord = { id: `${projectId}:${path}`, projectId, path, type: 'blob', data: buffer };
  await promisify(t.objectStore('files').put(rec));
  db.close();
}

export async function putBlobFilesBatch(projectId: string, files: Array<{ path: string; data: Blob | ArrayBuffer }>): Promise<void> {
  // Convert all blobs to ArrayBuffers first (outside transaction)
  const records: IDBFileRecord[] = [];
  for (const file of files) {
    const buffer = file.data instanceof Blob ? await file.data.arrayBuffer() : file.data;
    records.push({
      id: `${projectId}:${file.path}`,
      projectId,
      path: file.path,
      type: 'blob',
      data: buffer
    });
  }
  
  // Now write all records in a single transaction
  const db = await openDB();
  const t = tx(db, 'readwrite');
  const store = t.objectStore('files');
  
  for (const rec of records) {
    store.put(rec);
  }
  
  await new Promise<void>((resolve, reject) => {
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
  });
  
  db.close();
}

export async function getFile(projectId: string, path: string): Promise<IDBFileRecord | undefined> {
  const db = await openDB();
  const t = tx(db);
  const res = await promisify(t.objectStore('files').get(`${projectId}:${path}`));
  db.close();
  return res as any;
}

export async function listFiles(projectId: string, prefix?: string): Promise<IDBFileRecord[]> {
  const db = await openDB();
  const t = tx(db);
  const idx = t.objectStore('files').index('by_project');
  const range = IDBKeyRange.only(projectId);
  const out: IDBFileRecord[] = [];
  await new Promise<void>((resolve, reject) => {
    const req = idx.openCursor(range);
    req.onsuccess = () => {
      const cursor = req.result as IDBCursorWithValue | null;
      if (!cursor) return resolve();
      const rec = cursor.value as IDBFileRecord;
      if (!prefix || rec.path.startsWith(prefix)) out.push(rec);
      cursor.continue();
    };
    req.onerror = () => reject(req.error);
  });
  db.close();
  return out;
}

export async function deleteFile(projectId: string, path: string): Promise<void> {
  const db = await openDB();
  const t = tx(db, 'readwrite');
  await promisify(t.objectStore('files').delete(`${projectId}:${path}`));
  db.close();
}

export async function ensureUniqueProjectName(base: string): Promise<string> {
  const existing = (await listProjects()).map(p => p.name);
  if (!existing.includes(base)) return base;
  let i = 1;
  while (existing.includes(`${base} (${i})`)) i++;
  return `${base} (${i})`;
}
