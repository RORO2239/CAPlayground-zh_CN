// OPFS helpers
export async function isOPFSSupported(): Promise<boolean> {

  try {
    const hasAPI = !!(navigator?.storage && (navigator.storage as any).getDirectory);
    if (!hasAPI) return false;

    const root: any = await (navigator.storage as any).getDirectory();
    if (!root) return false;

    const probeDir = '__opfs_probe__';
    let dir: any | null = null;
    try {
      dir = await root.getDirectoryHandle(probeDir, { create: true });
      const fh = await dir.getFileHandle('t.txt', { create: true });
      const w = await fh.createWritable();
      await w.write(new Blob(['ok'], { type: 'text/plain' }));
      await w.close();
      // cleanup
      try { await (dir as any).removeEntry('t.txt'); } catch {}
      try { await (root as any).removeEntry(probeDir, { recursive: true }); } catch {}
      return true;
    } catch {
      try { if (dir) await (dir as any).removeEntry('t.txt'); } catch {}
      try { await (root as any).removeEntry(probeDir, { recursive: true }); } catch {}
      return false;
    }
  } catch {
    return false;
  }
}
  
  async function getRoot(): Promise<FileSystemDirectoryHandle> {
    const root: FileSystemDirectoryHandle = await navigator.storage.getDirectory();
    return root;
  }
  
  function splitPath(p: string): string[] {
    return p.split('/').filter(Boolean);
  }
  
  async function resolveDir(root: FileSystemDirectoryHandle, parts: string[], create = false): Promise<FileSystemDirectoryHandle> {
    let dir = root;
    for (const part of parts) {
      dir = await dir.getDirectoryHandle(part, { create });
    }
    return dir;
  }
  
  async function resolveParent(root: FileSystemDirectoryHandle, fullPath: string, create = false): Promise<{ parent: FileSystemDirectoryHandle; name: string }> {
    const parts = splitPath(fullPath);
    const name = parts.pop() as string;
    const parent = await resolveDir(root, parts, create);
    return { parent, name };
  }
  
  export async function ensureDir(path: string): Promise<FileSystemDirectoryHandle> {
    const root = await getRoot();
    return resolveDir(root, splitPath(path), true);
  }
  
  export async function writeText(path: string, text: string): Promise<void> {
    const root = await getRoot();
    const { parent, name } = await resolveParent(root, path, true);
    const file = await parent.getFileHandle(name, { create: true });
    const w = await file.createWritable();
    await w.write(new Blob([text], { type: 'text/plain' }));
    await w.close();
  }
  
  export async function writeBlob(path: string, data: Blob | ArrayBuffer): Promise<void> {
    const root = await getRoot();
    const { parent, name } = await resolveParent(root, path, true);
    const file = await parent.getFileHandle(name, { create: true });
    const w = await file.createWritable();
    const blob = data instanceof Blob ? data : new Blob([data]);
    await w.write(blob);
    await w.close();
  }
  
  export async function readText(path: string): Promise<string | null> {
    try {
      const root = await getRoot();
      const { parent, name } = await resolveParent(root, path, false);
      const file = await parent.getFileHandle(name);
      const f = await file.getFile();
      return await f.text();
    } catch {
      return null;
    }
  }
  
  export async function readFile(path: string): Promise<ArrayBuffer | null> {
    try {
      const root = await getRoot();
      const { parent, name } = await resolveParent(root, path, false);
      const file = await parent.getFileHandle(name);
      const f = await file.getFile();
      return await f.arrayBuffer();
    } catch {
      return null;
    }
  }
  
  export async function listDir(path: string): Promise<Array<{ name: string; kind: 'file' | 'directory' }>> {
    const out: Array<{ name: string; kind: 'file' | 'directory' }> = [];
    try {
      const root = await getRoot();
      const dir = await resolveDir(root, splitPath(path), false);
      // @ts-ignore
      for await (const [name, handle] of (dir as any).entries()) {
        out.push({ name, kind: (handle as any).kind });
      }
    } catch {}
    return out;
  }
  
  export async function exists(path: string): Promise<boolean> {
    try {
      const root = await getRoot();
      const { parent, name } = await resolveParent(root, path, false);
      await parent.getFileHandle(name);
      return true;
    } catch {
      try {
        const root = await getRoot();
        await resolveDir(root, splitPath(path), false);
        return true;
      } catch {
        return false;
      }
    }
  }
  
  export async function remove(path: string, opts: { recursive?: boolean } = {}): Promise<void> {
    try {
      const root = await getRoot();
      const parts = splitPath(path);
      const name = parts.pop();
      const dir = await resolveDir(root, parts, false);
      await (dir as any).removeEntry(name!, { recursive: !!opts.recursive });
    } catch {}
  }
  