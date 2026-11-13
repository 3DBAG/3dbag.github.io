import { Matrix4, Vector3 } from 'three';

const MAX_BYTES = 24 * 1024 * 1024;
const MAX_FILE_BYTES = 8 * 1024 * 1024;

export function earthPoint([longitude, latitude]) {
  const lon = longitude * Math.PI / 180;
  const lat = latitude * Math.PI / 180;
  const e2 = 6.69437999014e-3;
  const n = 6378137 / Math.sqrt(1 - e2 * Math.sin(lat) ** 2);
  return new Vector3(n * Math.cos(lat) * Math.cos(lon), n * Math.cos(lat) * Math.sin(lon), n * (1 - e2) * Math.sin(lat));
}

// ECEF oriented boxes used by the current Cesium tileset. Unsupported bounds
// are skipped, so switching datasets cannot trigger an unbounded traversal.
export function nearBox(box, transform, point, radius = 900) {
  if (!box || box.length !== 12) return false;
  const matrix = new Matrix4().set(
    box[3], box[6], box[9], box[0],
    box[4], box[7], box[10], box[1],
    box[5], box[8], box[11], box[2],
    0, 0, 0, 1
  ).premultiply(transform);
  if (Math.abs(matrix.determinant()) < 1e-10) return false;
  const local = point.clone().applyMatrix4(matrix.clone().invert());
  const axes = [0, 1, 2].map(i => new Vector3().setFromMatrixColumn(matrix, i).length());
  return [local.x, local.y, local.z].every((value, i) => Math.abs(value) <= 1 + radius / axes[i]);
}

export function createNeighbourPreloader(rootUrl) {
  const cache = new Map();
  let cacheBytes = 0;
  let controller;
  let timer;
  const fetchTiles = (url, options) => {
    const entry = cache.get(String(url));
    return entry ? Promise.resolve(new Response(entry.bytes, { headers: entry.headers })) : fetch(url, options);
  };
  async function warm(url, signal, budget) {
    if (cache.has(url)) return cache.get(url);
    signal.throwIfAborted();
    if (budget.requests-- <= 0 || budget.bytes <= 0) return null;
    const response = await fetch(url, { signal, priority: 'low' });
    if (!response.ok) { await response.body?.cancel(); return null; }
    const limit = Math.min(MAX_FILE_BYTES, budget.bytes);
    if (Number(response.headers.get('content-length')) > limit) { await response.body?.cancel(); return null; }
    const reader = response.body.getReader();
    const chunks = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      budget.bytes -= value.byteLength;
      if (size > limit) { await reader.cancel(); return null; }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    while (cacheBytes + size > MAX_BYTES && cache.size) {
      const key = cache.keys().next().value;
      cacheBytes -= cache.get(key).bytes.byteLength;
      cache.delete(key);
    }
    const entry = { bytes, headers: { 'content-type': response.headers.get('content-type') || 'application/octet-stream' } };
    cache.set(url, entry);
    cacheBytes += size;
    return entry;
  }
  async function nearby(url, point, signal, budget, candidates, transform = new Matrix4(), depth = 0) {
    if (depth > 12 || candidates.length >= 24) return;
    const entry = await warm(url, signal, budget);
    if (!entry) return;
    const json = JSON.parse(new TextDecoder().decode(entry.bytes));
    async function visit(tile, parent) {
      signal.throwIfAborted();
      if (!tile || candidates.length >= 24) return;
      const matrix = tile.transform ? parent.clone().multiply(new Matrix4().fromArray(tile.transform)) : parent;
      if (!nearBox(tile.boundingVolume?.box, matrix, point)) return;
      const uri = tile.content?.uri || tile.content?.url;
      if (uri) {
        const contentUrl = new URL(uri, url).href;
        if (new URL(contentUrl).pathname.endsWith('.json')) {
          await nearby(contentUrl, point, signal, budget, candidates, matrix, depth + 1);
        } else if (!tile.children?.length) {
          const box = tile.boundingVolume.box;
          const distance = new Vector3(...box.slice(0, 3)).applyMatrix4(matrix).distanceTo(point);
          candidates.push({ url: contentUrl, distance });
        }
      }
      for (const child of tile.children || []) await visit(child, matrix);
    }
    await visit(json.root, transform);
  }
  function cancel() { clearTimeout(timer); controller?.abort(); }
  function schedule(centers, busy = () => false) {
    cancel();
    const connection = navigator.connection;
    if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '')) return;
    controller = new AbortController();
    const { signal } = controller;
    const run = async () => {
      if (signal.aborted || document.hidden) return;
      if (busy()) { timer = setTimeout(run, 1000); return; }
      const budget = { bytes: MAX_BYTES, requests: 24 };
      try {
        // Sequential, low-priority fetching keeps the active view responsive.
        for (const center of centers) {
          const candidates = [];
          await nearby(rootUrl, earthPoint(center), signal, budget, candidates);
          candidates.sort((a, b) => a.distance - b.distance);
          for (const tile of candidates.slice(0, 6)) await warm(tile.url, signal, budget);
        }
      } catch (error) {
        // Prefetch is opportunistic; failures never affect foreground requests.
        if (error.name !== 'AbortError') console.debug('Neighbour preload skipped', error);
      }
    };
    timer = setTimeout(run, 1500);
  }
  return { fetchTiles, schedule, destroy() { cancel(); cache.clear(); cacheBytes = 0; } };
}
