export function sanitizeFilename(name: string): string {
  const n = (name || '').trim();
  if (!n) return '';
  const parts = n.split('.');
  const ext = parts.length > 1 ? parts.pop() as string : '';
  const base = parts.join('.') || 'image';
  let safeBase = base.replace(/[^a-z0-9\-_.]+/gi, '_');
  safeBase = safeBase.replace(/^-+/, '').replace(/-+$/, '');
  if (!safeBase) safeBase = 'image';
  const safeExt = (ext || '').replace(/[^a-z0-9]+/gi, '').toLowerCase();
  return safeExt ? `${safeBase}.${safeExt}` : safeBase;
}

export async function dataURLToBlob(dataURL: string): Promise<Blob> {
  const [meta, data] = dataURL.split(',');
  const isBase64 = /;base64$/i.test(meta);
  const mimeMatch = meta.match(/^data:([^;]+)(;base64)?$/i);
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  if (isBase64) {
    const byteString = atob(data);
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ia], { type: mime });
  } else {
    return new Blob([decodeURIComponent(data)], { type: mime });
  }
}

export const normalize = (s: string) => {
  try { s = decodeURIComponent(s); } catch {}
  return (s || '').trim().toLowerCase();
};
